import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client'; // Importamos tu cliente real
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Mail, Lock, Trophy, ChevronRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      // --- LÓGICA REAL DE SUPABASE ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Login exitoso:', data.user);
      navigate('/dashboard'); // Redirigir al dashboard si todo sale bien

    } catch (error) {
      // Manejo de errores
      console.error('Error de login:', error);
      setErrorMsg('Credenciales incorrectas o error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      {/* Panel izquierdo - Imagen */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80"
          alt="Deporte universitario"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-green-600/90 flex items-center justify-center z-10">
          <div className="text-white text-center px-8">
            <Trophy className="w-24 h-24 mx-auto mb-6 opacity-90" />
            <h1 className="text-5xl font-bold mb-4 tracking-tight">UN Sports</h1>
            <p className="text-xl opacity-90 font-light max-w-md mx-auto">
              Únete a la comunidad deportiva universitaria y gestiona tu entrenamiento.
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Logo móvil */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-8">
            <div className="bg-green-100 p-3 rounded-full mb-3">
               <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">UN Sports</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
              <p className="text-gray-500">
                Ingresa tus credenciales para acceder
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@unal.edu.co"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
                  />
                </div>
              </div>

              {/* Mensaje de Error */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-green-600 hover:text-green-500 transition">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando...
                  </span>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Form */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                ¿No tienes una cuenta?{' '}
                <a href="#" className="font-medium text-green-600 hover:text-green-500 transition">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-400">
            © 2025 UN Sports - Universidad Nacional
          </p>
        </div>
      </div>
    </div>
  );
}