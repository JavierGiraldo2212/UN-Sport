import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar a la nueva página
import { Calendar, Megaphone, MessageCircle, Send, Reply } from 'lucide-react';
import axios from 'axios';

// Componente para un Comentario Individual (y sus respuestas)
const CommentItem = ({ comment, currentUserId, onReplyAdded, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Solo permitimos responder si es nivel 0 (Comentario principal)
  // Nivel 0 = Comentario Principal
  // Nivel 1 = Respuesta
  const canReply = level === 0; 

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setIsSubmitting(true);

    try {
      // Llamada al endpoint de respuesta
      await axios.post(`http://localhost:8080/api/announcements/comments/${comment.id}/reply`, {
        content: replyContent,
        authorId: currentUserId
      });
      setReplyContent("");
      setShowReplyForm(false);
      onReplyAdded();
    } catch (error) {
      console.error("Error respondiendo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`mt-3 ${level > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="bg-gray-50 p-3 rounded-lg text-sm text-left"> {/* text-left para alinear */}
        <div className="flex justify-between items-start mb-1">
          <span className="font-bold text-gray-800 text-xs">
            {comment.author?.firstName || "Usuario"} {comment.author?.lastName}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-700">{comment.content}</p>
        
        {/* Botón Responder (Solo en nivel 0) */}
        {canReply && (
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs text-blue-600 hover:underline mt-2 flex items-center gap-1"
          >
            <Reply className="w-3 h-3" /> Responder
          </button>
        )}
      </div>

      {/* Formulario de Respuesta */}
      {showReplyForm && (
        <form onSubmit={handleSendReply} className="mt-2 ml-4 flex gap-2">
          <input 
            type="text" 
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Escribe una respuesta..."
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <button type="submit" disabled={isSubmitting} className="text-blue-600">
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Renderizar respuestas hijas si existen */}
      {comment.replies && comment.replies.map(reply => (
        <CommentItem 
          key={reply.id} 
          comment={reply} 
          currentUserId={currentUserId} 
          onReplyAdded={onReplyAdded}
          level={level + 1} 
        />
      ))}
    </div>
  );
};

const AnnouncementItem = ({ announcement, currentUserId, onCommentAdded }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtramos para mostrar solo los comentarios principales (que no tienen padre)
  // Las respuestas se renderizan dentro de cada CommentItem
    const topLevelComments = announcement.comments ? announcement.comments.filter(c => !c.parentId) : [];
    const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      await axios.post(`http://localhost:8080/api/announcements/${announcement.id}/comments`, {
        content: newComment,
        authorId: currentUserId
      });
      setNewComment("");
      onCommentAdded();
    } catch (error) {
      console.error("Error al comentar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-200 text-left">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 text-lg">{announcement.title}</h3>
        <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1 shrink-0">
          <Calendar className="w-3 h-3" />
          {new Date(announcement.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap mb-4 text-left">
        {announcement.content}
      </p>

      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
            {announcement.author?.firstName?.charAt(0) || 'E'}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Por {announcement.author?.firstName || 'Entrenador'} {announcement.author?.lastName}
          </span>
        </div>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{topLevelComments.length} Comentarios</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-2 border-t border-dashed border-gray-200 animate-in fade-in">
          {/* Lista de comentarios */}
          <div className="space-y-2 mb-4">
            {topLevelComments.length > 0 ? (
              topLevelComments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  currentUserId={currentUserId}
                  onReplyAdded={onCommentAdded}
                />
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">Sé el primero en comentar.</p>
            )}
          </div>

          {/* Input nuevo comentario principal */}
          <form onSubmit={handlePostComment} className="flex gap-2 items-center mt-4">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit" 
              disabled={isSubmitting || !newComment.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default function AnnouncementList({ announcements, currentUserId, onRefresh, showAll = false }) {
  const navigate = useNavigate();

  if (!announcements || announcements.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-gray-100 p-3 rounded-full w-fit mx-auto mb-3">
          <Megaphone className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-medium">Sin novedades</h3>
        <p className="text-gray-500 text-sm mt-1">Aún no hay anuncios publicados.</p>
      </div>
    );
  }

  // SI showAll es falso, cortamos para mostrar SOLO UNO.
  const visibleAnnouncements = showAll ? announcements : announcements.slice(0, 1);

  return (
    <div className="space-y-4">
      {visibleAnnouncements.map((announcement) => (
        <AnnouncementItem 
          key={announcement.id} 
          announcement={announcement} 
          currentUserId={currentUserId}
          onCommentAdded={onRefresh}
        />
      ))}

      {/* Botón Ver Todos (Solo aparece si NO estamos en modo showAll y hay más de 1) */}
      {!showAll && announcements.length > 1 && (
        <button 
          onClick={() => navigate('/announcements')}
          className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition border border-dashed border-blue-200"
        >
          Ver los {announcements.length - 1} anuncios anteriores
        </button>
      )}
    </div>
  );
}