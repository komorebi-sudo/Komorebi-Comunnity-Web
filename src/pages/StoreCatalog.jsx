import React, { useEffect, useState } from 'react';
import { Search, Heart, ShoppingBag, User, Store, ArrowLeft, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';

export default function StoreCatalog() {
  const { storeSlug } = useParams(); 
  const { addToCart, toggleCart, getCartCount } = useCart();
  const cartCount = getCartCount();

  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ESTADOS PARA BÚSQUEDA Y FILTROS DESPLEGABLES
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');

  useEffect(() => {
    async function fetchStoreAndProducts() {
      try {
        let { data, error } = await supabase
          .from('stores')
          .select('*, products(*)')
          .eq('slug', storeSlug) 
          .single();

        if (error) throw error;
        setStore(data);
      } catch (err) {
        console.error("Error al cargar la tienda:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (storeSlug) fetchStoreAndProducts();
  }, [storeSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center text-slate-500">
        <Store className="animate-bounce mb-4 text-pink-400" size={32} />
        <p>Abriendo las puertas de la tienda...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center text-slate-700">
        <h1 className="text-2xl font-bold mb-2">Tienda no encontrada</h1>
        <Link to="/" className="bg-pink-100 text-pink-600 px-6 py-2.5 rounded-full font-bold">Volver al Mall</Link>
      </div>
    );
  }

  // LÓGICA DE FILTRADO Y ORDENAMIENTO AVANZADO
  // 1. Primero copiamos los productos para no modificar los originales
  let processedProducts = [...(store.products || [])];

  // 2. Aplicamos la búsqueda por texto si hay algo escrito
  if (searchTerm) {
    processedProducts = processedProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // 3. Aplicamos el filtro u ordenamiento seleccionado en el menú
  switch (activeFilter) {
    case 'destacados':
      processedProducts = processedProducts.filter(p => p.is_trending === true);
      break;
    case 'ofertas':
      processedProducts = processedProducts.filter(p => p.badge && p.badge.toLowerCase().includes('oferta'));
      break;
    case 'precio-menor':
      processedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'precio-mayor':
      processedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'a-z':
      processedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'z-a':
      processedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      // 'todos' - se queda tal cual
      break;
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans pb-12 selection:bg-pink-200">
      
      {/* CABECERA */}
      <header className="bg-[#faf9f8]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
              <Store size={22} strokeWidth={2.5} />
            </div>
            <div className="text-xl font-bold tracking-tight text-slate-800">
              Komorebi
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <button onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="hidden sm:flex items-center space-x-2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm">
              <User size={16} />
              <span>Entrar</span>
            </button>
          </div>
        </div>
      </header>

      {/* BANNER DE LA TIENDA */}
      <div className={`w-full h-40 ${store.cover_color || 'bg-slate-100'} border-b border-slate-100 relative`}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-end pb-6 relative">
           <Link to="/" className="absolute top-6 left-6 flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition-colors text-slate-700 shadow-sm">
             <ArrowLeft size={14} className="mr-1" /> Volver
           </Link>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 relative -mt-12">
        
        {/* SIDEBAR IZQUIERDO (Info de la tienda) */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-8 text-center relative pt-14">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm border-4 border-white">
              {store.avatar_icon || '🏪'}
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{store.name}</h1>
            <p className="text-sm text-slate-500 mb-4">{store.type}</p>
          </div>
        </aside>

        {/* ÁREA DE PRODUCTOS */}
        <section className="flex-1 mt-4 md:mt-12">
          
          {/* BARRA DE BÚSQUEDA Y MENÚ DESPLEGABLE */}
          {store.products && store.products.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Buscador */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={`Buscar en ${store.name}...`} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-slate-100 focus:outline-none focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                />
              </div>
              
              {/* Menú Desplegable (Dropdown) */}
              <div className="relative w-full sm:w-64 flex-shrink-0 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-pink-500 transition-colors">
                  <SlidersHorizontal size={16} />
                </div>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white border border-slate-100 text-slate-700 text-sm font-bold rounded-full appearance-none focus:outline-none focus:border-pink-200 focus:ring-4 focus:ring-pink-50 shadow-sm cursor-pointer transition-all"
                >
                  <option value="todos">Todos los productos</option>
                  <option value="destacados">✨ Destacados</option>
                  <option value="ofertas">🏷️ Ofertas</option>
                  <option value="precio-menor">💸 Precio: Menor a Mayor</option>
                  <option value="precio-mayor">💎 Precio: Mayor a Menor</option>
                  <option value="a-z">📝 Nombre: A - Z</option>
                  <option value="z-a">📝 Nombre: Z - A</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          )}

          {/* CUADRÍCULA DE PRODUCTOS (Usa processedProducts) */}
          {(!store.products || store.products.length === 0) ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-500 shadow-sm">
              Esta tienda aún no ha publicado productos. 🌸
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-500 shadow-sm flex flex-col items-center">
              <Search size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No encontramos nada</h3>
              <p>No hay productos que coincidan con tu búsqueda o filtro.</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveFilter('todos'); }} 
                className="mt-6 text-pink-500 font-bold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-[2rem] p-5 flex flex-col relative group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  
                  {product.badge && (
                    <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-extrabold px-2 py-1 rounded-full shadow-sm tracking-wider uppercase">
                      {product.badge}
                    </span>
                  )}

                  <Link to={`/producto/${product.slug}`} className="flex flex-col flex-1 cursor-pointer">
                    <div className={`${product.bg_color || 'bg-slate-50'} h-40 rounded-[1.5rem] flex items-center justify-center text-7xl mb-5 transition-transform duration-500 group-hover:scale-95`}>
                      {product.icon || '📦'}
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm leading-snug mb-4 line-clamp-2 group-hover:text-pink-500 transition-colors">
                      {product.name}
                    </h4>
                  </Link>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-slate-800">${product.price}</span>
                      <button 
                        onClick={() => addToCart({ ...product, store: store.name })} 
                        className="bg-slate-50 hover:bg-slate-800 hover:text-white text-slate-600 text-xs font-bold px-4 py-2.5 rounded-full transition-colors shadow-sm relative z-10"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}