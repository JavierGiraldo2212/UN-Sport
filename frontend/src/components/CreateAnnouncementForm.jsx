import { useState } from 'react';
import axios from 'axios';
import { Send, X } from 'lucide-react';

export default function CreateAnnouncementForm({ authorId, onCancel, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:8080/api/announcements', {
        title,
        content,
        authorId
      });
      
      // Limpiar y avisar al padre que todo salió bien
      setTitle('');
      setContent('');
      onSuccess();
    } catch (error) {
      console.error("Error publicando anuncio:", error);
      alert("Hubo un error al publicar el anuncio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-md mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">Nuevo Anuncio</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
            placeholder="Ej: Cambio de horario..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition h-24 resize-none"
            placeholder="Escribe los detalles aquí..."
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg shadow-sm transition flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? 'Publicando...' : (
              <>
                <Send className="w-4 h-4" /> Publicar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}