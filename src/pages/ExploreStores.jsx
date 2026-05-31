import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, User, Store, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { supabase } from '../lib/supabaseClient'; // Conectamos Supabase

export default function ExploreStores() {
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();

  // Estados para manejar los datos de la base de datos
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        let { data, error } = await supabase
          .from('stores')
          .select('*');

        if (error) throw error;
        setStores(data || []);
      } catch (err) {
        console.error("Error al cargar el directorio de tiendas:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStores();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200">
      <header className="bg-[#faf9f8]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform"><Store size={22} strokeWidth={2.5} /></div>
            <div className="text-xl font-bold tracking-tight text-slate-800">Komorebi</div>
          </Link>
          <div className="flex items-center space-x-3">
            <button onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
            </button>
            <button className="hidden sm:flex items-center space-x-2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm"><User size={16} /><span>Entrar</span></button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24 mt-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/" className="text-pink-500 font-semibold flex items-center text-sm mb-4 hover:underline"><ArrowLeft size={16} className="mr-1"/> Volver al inicio</Link>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Directorio de Tiendas</h1>
            <p className="text-slate-500 mt-2">Explora y descubre tus nuevos creadores favoritos.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-400 font-medium flex flex-col items-center">
            <Store className="animate-bounce mb-4 text-pink-400" size={32} />
            Cargando el directorio...
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-500">
            Aún no hay tiendas registradas en el directorio.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stores.map(store => (
              <div key={store.id} className="bg-white rounded-[2rem] overflow-hidden flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className={`h-28 ${store.cover_color || 'bg-slate-100'} w-full relative z-20 transition-transform duration-500 group-hover:scale-105`}>
                  <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border-4 border-white">
                    {store.avatar_icon || '🏪'}
                  </div>
                </div>
                <div className="pt-10 pb-6 px-6 flex flex-col flex-1 bg-white relative z-10">
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{store.name}</h3>
                  <p className="text-sm text-slate-500 mb-6">{store.type}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center text-sm font-semibold text-slate-600"><Star size={16} className="text-yellow-400 fill-yellow-400 mr-1.5" /> {store.rating || 5.0}</span>
                    {/* AQUÍ ESTÁ EL CAMBIO IMPORTANTE: store.slug */}
                    <Link to={`/tienda/${store.slug}`} className="bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">Visitar</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}