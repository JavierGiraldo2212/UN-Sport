import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'
import AnnouncementsPage from './pages/AnnouncementsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Nueva Ruta */}
        <Route path="/announcements" element={<AnnouncementsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App