import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, Package, Heart, Store, LogOut, ArrowLeft, Loader2, Sparkles, Clock, CheckCircle, FileText } from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [userStore, setUserStore] = useState(null);
  const [myOrders, setMyOrders] = useState([]); // NUEVO: Estado para el historial de compras
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        // Si no está logueado, lo pateamos al Login
        if (!session) {
          navigate('/login');
          return;
        }
        setSession(session);

        // 1. Verificamos si este usuario ya es un VENDEDOR (tiene tienda)
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setUserStore(storeData);

        // 2. Buscamos el HISTORIAL DE COMPRAS de este usuario
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (ordersData) {
          setMyOrders(ordersData);
        }

      } catch (err) {
        console.error("Error al cargar perfil:", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoading) return <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={32}/></div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200 pb-12">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO OFICIAL QUE LLEVA AL HOME */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
              <Store size={22} strokeWidth={2.5} />
            </div>
            <div className="text-xl font-bold tracking-tight text-slate-800">
              Komorebi <span className="text-slate-300 font-normal hidden sm:inline">| Mi Perfil</span>
            </div>
          </Link>

          {/* BOTONES DE NAVEGACIÓN */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-pink-500 transition-colors">
              Ir de compras
            </Link>
            <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-400 hover:text-red-500 px-4 py-2 rounded-xl transition-colors font-bold text-sm bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100">
              <LogOut size={16} /><span className="hidden sm:inline">Salir</span>
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* CABECERA DEL PERFIL */}
        <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center text-3xl font-black text-pink-500 shadow-inner">
            {session.user.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-1">¡Hola, comprador!</h1>
            <p className="text-slate-500 font-medium">{session.user.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-400 hover:text-red-500 px-4 py-2 rounded-xl transition-colors font-bold text-sm bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100">
            <LogOut size={16} /><span>Cerrar sesión</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COLUMNA IZQUIERDA: Herramientas del Comprador */}
          <div className="space-y-8">
            
            {/* HISTORIAL DE COMPRAS */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Package className="text-slate-400"/> Mis Pedidos</h2>
              
              {myOrders.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                  <Package size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 text-sm font-medium">Aún no has hecho ninguna compra.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(order => {
                    const itemCount = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
                    const orderTotal = order.total || (order.items ? order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0);

                    return (
                      <div key={order.id} className="bg-[#faf9f8] rounded-2xl p-5 border border-slate-100 flex flex-col gap-4 hover:border-pink-200 transition-colors">
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pedido #{order.id.split('-')[0]}</span>
                            <h3 className="font-bold text-slate-800 text-sm mt-0.5">{new Date(order.created_at).toLocaleDateString()}</h3>
                          </div>
                          
                          <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 ${order.status === 'enviado' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {order.status === 'enviado' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                            {order.status === 'enviado' ? 'Enviado' : 'Preparando'}
                          </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 mb-0.5">{itemCount} artículo{itemCount !== 1 ? 's' : ''}</p>
                            <p className="text-lg font-black text-pink-500">${orderTotal.toFixed(2)}</p>
                          </div>
                          
                          {/* BOTÓN MÁGICO DE GUÍA DE ENVÍO */}
                          {order.status === 'enviado' && order.shipping_receipt_url && (
                            <a 
                              href={order.shipping_receipt_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                            >
                              <FileText size={14} /> Ver guía
                            </a>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Heart className="text-pink-500 fill-pink-500"/> Mis Favoritos</h2>
              <p className="text-slate-500 text-sm font-medium mb-4">Revisa todos los productos que has guardado para comprar después.</p>
              <Link to="/favoritos" className="inline-block bg-pink-50 text-pink-600 font-bold px-6 py-2.5 rounded-full hover:bg-pink-100 transition-colors text-sm">
                Ver favoritos
              </Link>
            </div>
          </div>

          {/* COLUMNA DERECHA: Zona del Vendedor (El Puente) */}
          <div>
            <div className={`rounded-[2rem] p-8 shadow-sm border ${userStore ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-100'}`}>
              <div className="flex items-center gap-3 mb-4">
                {userStore ? <Store size={28} className="text-pink-400" /> : <Sparkles size={28} className="text-pink-500" />}
                <h2 className={`text-2xl font-bold ${userStore ? 'text-white' : 'text-slate-800'}`}>Zona de Creadores</h2>
              </div>
              
              {userStore ? (
                <>
                  <p className="text-slate-300 mb-6 font-medium">Tienes una tienda activa: <strong className="text-white">{userStore.name}</strong></p>
                  <Link to="/admin" className="w-full bg-pink-500 text-white font-bold py-3.5 rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 shadow-md">
                    <Store size={18} /> Ir al Panel de Vendedor
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-slate-600 mb-6 font-medium leading-relaxed">¿Tienes productos increíbles para compartir? Únete a nuestra comunidad de creadores y abre tu propia tienda en Komorebi.</p>
                  <Link to="/admin" className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                    <Store size={18} /> Convertirme en Vendedor
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}