import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import OptimizedImage from './ui/OptimizedImage';
import QuickAddPopover from './QuickAddPopover';
import { useFavorites } from '../context/FavoritesContext';

export default function ProductCard({ 
  product, 
  store, // NUEVO: Prop opcional para mostrar de qué tienda es
  openPopoverId, 
  setOpenPopoverId 
}) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(product.id);

  return (
    <div className="bg-white rounded-[2rem] p-5 flex flex-col relative group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
      
      <button 
        onClick={(e) => { e.preventDefault(); toggleFavorite(product); }} 
        className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm shadow-sm transition-all ${isFav ? 'bg-white text-pink-500' : 'bg-white/50 text-slate-400 hover:bg-white hover:text-pink-500 opacity-0 group-hover:opacity-100'}`}
      >
        <Heart size={18} className={isFav ? "fill-pink-500" : ""} />
      </button>
      
      {product.badge && (
        <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-extrabold px-2 py-1 rounded-full shadow-sm tracking-wider uppercase">
          {product.badge}
        </span>
      )}

      <Link to={`/producto/${product.slug}`} className="flex flex-col flex-1 cursor-pointer">
        <div className={`h-40 rounded-[1.5rem] flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-95 relative overflow-hidden ${product.image_url ? 'bg-slate-100' : 'bg-transparent'}`}>
          <OptimizedImage 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          {/* MINI AVATAR DE TIENDA (Solo si se pasa el prop 'store') */}
          {store && (
            <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-bold text-slate-500 shadow-sm border border-slate-100 overflow-hidden" title={`Vendido por ${store.name}`}>
              {store.avatar_url ? <img src={store.avatar_url} className="w-full h-full object-cover" /> : store.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <h4 className="font-semibold text-slate-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-pink-500 transition-colors">
          {product.name}
        </h4>
        
        {/* NOMBRE DE LA TIENDA (Solo si se pasa el prop 'store') */}
        {store && (
          <span className="text-xs font-medium text-slate-400 mb-4 hover:text-pink-500 transition-colors flex items-center w-max">
            {store.name}
          </span>
        )}
      </Link>
      
      <div className="mt-auto">
        <div className="relative flex items-center justify-between">
          <span className="font-bold text-lg text-slate-800">${product.price}</span>
          
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              setOpenPopoverId(openPopoverId === product.id ? null : product.id); 
            }} 
            className="bg-slate-50 hover:bg-slate-800 hover:text-white text-slate-600 text-xs font-bold px-4 py-2.5 rounded-full transition-colors shadow-sm relative z-10"
          >
            Agregar
          </button>
          
          {openPopoverId === product.id && (
            <QuickAddPopover product={product} onClose={() => setOpenPopoverId(null)} />
          )}
        </div>
      </div>
    </div>
  );
}