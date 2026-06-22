import React from 'react';
import { Search, Heart, ShoppingBag, User, Store, ArrowLeft, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import OptimizedImage from '../components/ui/OptimizedImage';
import ProductCard from '../components/ProductCard';

export default function TemplateDefault({
  store,
  processedProducts,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  openPopoverId,
  setOpenPopoverId
}) {
  const { toggleCart, getCartCount } = useCart();
  const cartCount = getCartCount();
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans pb-12 selection:bg-pink-200">
      
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
            <Link to="/favoritos" className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <Heart size={20} />
              {favorites.length > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{favorites.length}</span>}
            </Link>
            <button onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
            </button>
            <Link to="/perfil" className="hidden sm:flex items-center space-x-2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm">
              <User size={16} /><span>Mi Perfil</span>
            </Link>
          </div>
        </div>
      </header>

      {/* BANNER OPTIMIZADO */}
      <div className={`w-full h-40 ${store.cover_color || 'bg-slate-100'} border-b border-slate-100 relative overflow-hidden`}>
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src={store.banner_url} 
            alt={`Banner de ${store.name}`} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-end pb-6 relative z-10">
           <Link to="/" className="absolute top-6 left-6 flex items-center bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition-colors text-slate-700 shadow-sm">
             <ArrowLeft size={14} className="mr-1" /> Volver
           </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 relative -mt-12">
        
        {/* AVATAR OPTIMIZADO */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-8 text-center relative pt-14">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-black text-slate-300 shadow-sm border-4 border-white overflow-hidden">
              {store.avatar_url ? (
                <OptimizedImage src={store.avatar_url} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                store.name?.charAt(0).toUpperCase()
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{store.name}</h1>
            <p className="text-sm text-slate-500 mb-4">{store.type}</p>
          </div>
        </aside>

        <section className="flex-1 mt-4 md:mt-12">
          
          {store.products && store.products.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" placeholder={`Buscar en ${store.name}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-slate-100 focus:outline-none focus:border-pink-200 transition-all text-sm font-medium shadow-sm"
                />
              </div>
              <div className="relative w-full sm:w-64 flex-shrink-0 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><SlidersHorizontal size={16} /></div>
                <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} className="w-full pl-11 pr-10 py-3 bg-white border border-slate-100 text-slate-700 text-sm font-bold rounded-full appearance-none shadow-sm cursor-pointer outline-none">
                  <option value="todos">Todos los productos</option>
                  <option value="destacados">✨ Destacados</option>
                  <option value="ofertas">🏷️ Ofertas</option>
                  <option value="precio-menor">💸 Precio: Menor a Mayor</option>
                  <option value="precio-mayor">💎 Precio: Mayor a Menor</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><ChevronDown size={18} /></div>
              </div>
            </div>
          )}

          {(!store.products || store.products.length === 0) ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-500 shadow-sm">Esta tienda aún no ha publicado productos. 🌸</div>
          ) : processedProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-500 shadow-sm flex flex-col items-center"><Search size={48} className="text-slate-200 mb-4" /><h3 className="text-lg font-bold text-slate-800 mb-2">No encontramos nada</h3></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* MAGIA DE COMPONENTIZACIÓN: Todo se resume a esto 👇 */}
              {processedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  openPopoverId={openPopoverId} 
                  setOpenPopoverId={setOpenPopoverId} 
                />
              ))}

            </div>
          )}
        </section>
      </main>
    </div>
  );
}