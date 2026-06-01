import React, { useState } from 'react';
import { Store, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [isLogin, setIsLogin] = useState(true); // Controla si mostramos Login o Registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para la experiencia de usuario (Carga y Errores)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Para mensajes de éxito

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // LÓGICA PARA INICIAR SESIÓN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Si todo sale bien, lo mandamos al panel de control (que crearemos pronto)
        navigate('/admin'); 

      } else {
        // LÓGICA PARA REGISTRARSE
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        setMessage('¡Cuenta creada! Por favor, revisa tu correo electrónico para verificar tu cuenta (o intenta iniciar sesión directamente si no tienes confirmación de email activada).');
        setIsLogin(true); // Lo devolvemos al login
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col justify-center items-center p-6 selection:bg-pink-200">
      
      {/* Botón flotante para volver al inicio */}
      <Link to="/" className="absolute top-6 left-6 flex items-center bg-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-50 hover:text-pink-600 transition-colors text-slate-600 shadow-sm border border-slate-100">
        <ArrowLeft size={16} className="mr-2" /> Volver a la tienda
      </Link>

      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-pink-100 rounded-[1.5rem] flex items-center justify-center text-pink-500 mb-4 shadow-sm">
            <Store size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Komorebi <span className="text-pink-500">Crea</span></h1>
          <p className="text-slate-500 mt-2 font-medium">El panel de control para tu tienda mágica.</p>
        </div>

        {/* TARJETA DE FORMULARIO */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/20 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
            {isLogin ? 'Bienvenido de nuevo' : 'Únete como Vendedor'}
          </h2>

          {/* Mensajes de Alerta */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium mb-6 border border-red-100 text-center">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-medium mb-6 border border-emerald-100 text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hola@tutienda.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#faf9f8] border border-slate-200 focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50 transition-all text-sm font-medium text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#faf9f8] border border-slate-200 focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50 transition-all text-sm font-medium text-slate-700"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl hover:bg-slate-700 transition-colors shadow-md flex items-center justify-center gap-2 mt-4 disabled:bg-slate-400"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Botón para alternar entre Login y Registro */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              {isLogin ? '¿Aún no tienes una tienda?' : '¿Ya tienes una cuenta?'}
            </p>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setMessage(null);
              }}
              className="mt-2 text-pink-500 font-bold hover:text-pink-600 transition-colors"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}