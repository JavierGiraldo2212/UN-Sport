import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import axios from 'axios'
import { 
  LogOut, User, Dumbbell, Calendar, ClipboardList, 
  Users, PlusCircle, Activity, Megaphone 
} from 'lucide-react'

// Importamos nuestros nuevos componentes
import AnnouncementList from '../components/AnnouncementList'
import CreateAnnouncementForm from '../components/CreateAnnouncementForm'

export default function Dashboard() {
  const navigate = useNavigate()
  
  // Estados de datos
  const [profiles, setProfiles] = useState([])
  const [myProfile, setMyProfile] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  
  // Estados de interfaz
  const [loading, setLoading] = useState(true)
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  // Función para cargar anuncios (la usaremos al inicio y al publicar uno nuevo)
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/announcements')
      setAnnouncements(res.data)
    } catch (error) {
      console.error("Error cargando anuncios:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          navigate('/')
          return
        }

        // Cargar perfiles y anuncios en paralelo
        const [profilesRes, announcementsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/profiles'),
          axios.get('http://localhost:8080/api/announcements')
        ])

        setProfiles(profilesRes.data)
        setAnnouncements(announcementsRes.data)
        
        const currentProfile = profilesRes.data.find(p => p.id === user.id)
        setMyProfile(currentProfile)

      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleAnnouncementCreated = () => {
    setShowAnnouncementForm(false) // Cerrar formulario
    fetchAnnouncements() // Recargar lista para ver el nuevo
  }

  // --- VISTAS ---

  const CoachView = () => (
    <div className="space-y-8">
      {/* Banner de Estado */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-3 shadow-sm">
        <div className="bg-blue-100 p-3 rounded-full">
            <Users className="text-blue-600 w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-900">Modo Entrenador Activo</h3>
          <p className="text-blue-700">Gestión centralizada del equipo de atletismo</p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition group">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition">
              <PlusCircle className="w-6 h-6 text-blue-600 group-hover:text-white transition" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Crear Entrenamiento</h4>
              <p className="text-sm text-gray-500">Diseñar nueva rutina</p>
            </div>
          </div>
        </button>

        {/* Botón para abrir el formulario de anuncios */}
        <button 
          onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
          className={`flex items-center justify-between p-6 border rounded-xl shadow-sm hover:shadow-md transition group text-left ${
            showAnnouncementForm ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' : 'bg-white border-gray-200 hover:border-orange-500'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg transition ${showAnnouncementForm ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {showAnnouncementForm ? 'Cancelar Anuncio' : 'Publicar Anuncio'}
              </h4>
              <p className="text-sm text-gray-500">Notificar al equipo</p>
            </div>
          </div>
        </button>
      </div>

      {/* Sección de Anuncios (Creación + Lista) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-800">Tablón de Anuncios</h3>
        </div>

        {showAnnouncementForm && (
          <CreateAnnouncementForm 
            authorId={myProfile.id} 
            onCancel={() => setShowAnnouncementForm(false)}
            onSuccess={handleAnnouncementCreated}
          />
        )}
        <AnnouncementList 
          announcements={announcements} 
          currentUserId={myProfile?.id}
          onRefresh={fetchAnnouncements}
          // No pasamos showAll, así que por defecto solo mostrará 1
        />
      </section>

      {/* Lista de Atletas */}
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Lista de Atletas</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {profiles.filter(p => p.role?.nombre === 'ATLETA').length > 0 ? (
             profiles.filter(p => p.role?.nombre === 'ATLETA').map(atleta => (
                <div key={atleta.id} className="p-4 border-b border-gray-100 last:border-0 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{atleta.firstName || "Atleta"} {atleta.lastName}</p>
                      <p className="text-xs text-gray-500">{atleta.trainingCategory?.modalidad || "General"}</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 font-medium hover:underline">Ver Perfil</button>
                </div>
             ))
          ) : (
            <div className="p-8 text-center text-gray-500">No hay atletas registrados aún.</div>
          )}
        </div>
      </section>
    </div>
  )

  const AthleteView = () => (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <Dumbbell className="text-green-600 w-6 h-6" />
        <div>
          <h3 className="font-semibold text-green-900">Panel de Atleta</h3>
          <p className="text-sm text-green-700">Tu plan de entrenamiento al día.</p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... (Tus tarjetas de calendario/progreso aquí se mantienen igual) ... */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:border-green-500 transition cursor-pointer">
          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h4 className="font-semibold mb-1">Mi Calendario</h4>
          <p className="text-sm text-gray-500">Ver programación</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:border-orange-500 transition cursor-pointer">
          <Activity className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <h4 className="font-semibold mb-1">Mi Progreso</h4>
          <p className="text-sm text-gray-500">Estadísticas</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:border-blue-500 transition cursor-pointer">
          <ClipboardList className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h4 className="font-semibold mb-1">Rutina de Hoy</h4>
          <p className="text-sm text-gray-500">Sin asignar</p>
        </div>
      </div>

      {/* Sección de Anuncios (Solo lectura para atletas) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-800">Noticias del Equipo</h3>
        </div>
        <AnnouncementList 
          announcements={announcements} 
          currentUserId={myProfile?.id}
          onRefresh={fetchAnnouncements}
          // No pasamos showAll, así que por defecto solo mostrará 1
        />
      </section>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const displayName = myProfile?.firstName || (myProfile?.role?.nombre === 'ENTRENADOR' ? 'Entrenador' : 'Atleta')

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white p-1.5 rounded-lg">
            <Dumbbell className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">UN Sport</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              {myProfile?.role?.nombre || "Cargando..."}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Hola, {displayName}
          </h2>
          <p className="text-gray-600">Bienvenido a tu panel de control deportivo.</p>
        </header>

        {myProfile?.role?.nombre === 'ENTRENADOR' ? <CoachView /> : <AthleteView />}
      
      </main>
    </div>
  )
}