import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Store, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

export default function MarketplaceLayout({ children, showSearch = true, initialSearch = '' }) {
  const { getCartCount, toggleCart } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Manejador centralizado de búsquedas
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200">
      
      <header className="bg-[#faf9f8]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO KOMOREBI */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
              <Store size={22} strokeWidth={2.5} />
            </div>
            <div className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
              Komorebi
            </div>
          </Link>

          {/* BARRA DE BÚSQUEDA (Ocultable) */}
          {showSearch ? (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit} className="flex w-full bg-white rounded-full px-4 py-2.5 items-center shadow-sm border border-slate-100 focus-within:border-pink-200 focus-within:ring-4 focus-within:ring-pink-50 transition-all">
                <Search className="text-slate-400 mr-3" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Busca tiendas o productos..." 
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-slate-400" 
                />
              </form>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center space-x-3">
            <Link to="/favoritos" className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <Heart size={20} />
              {favorites.length > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{favorites.length}</span>}
            </Link>
            <button onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 relative text-slate-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
            </button>
            <Link to="/perfil" className="hidden sm:flex items-center space-x-2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm">
              <User size={16} /><span>Mi Perfil</span>
            </Link>
          </div>

        </div>
      </header>

      {/* AQUÍ SE INYECTA EL CONTENIDO DE CADA PÁGINA */}
      {children}
      
    </div>
  );
}