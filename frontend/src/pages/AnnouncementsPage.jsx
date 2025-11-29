import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Megaphone } from 'lucide-react'
import AnnouncementList from '../components/AnnouncementList'
import { supabase } from '../supabase/client'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [userId, setUserId] = useState(null)

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      const res = await axios.get('http://localhost:8080/api/announcements')
      setAnnouncements(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-blue-600 transition w-fit mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Megaphone className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Noticias del Equipo</h1>
          </div>
        </div>

        <AnnouncementList 
          announcements={announcements} 
          currentUserId={userId} 
          onRefresh={fetchData}
          showAll={true} // Propiedad nueva para forzar vista completa
        />
      </div>
    </div>
  )
}