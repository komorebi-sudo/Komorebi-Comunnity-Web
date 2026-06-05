import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans pb-24 selection:bg-pink-200">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-slate-500 hover:text-pink-500 flex items-center font-medium text-sm transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Volver al inicio
          </Link>
          <div className="text-xl font-bold tracking-tight text-slate-800">
            Komorebi <span className="text-slate-300 font-normal">| Favoritos</span>
          </div>
          <div className="w-32"></div> 
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={28} className="text-pink-500 fill-pink-500" />
          <h1 className="text-3xl font-extrabold text-slate-800">Tus Favoritos</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
            <Heart size={64} className="text-slate-200 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Aún no tienes favoritos</h2>
            <p className="text-slate-500 mb-6">Guarda los productos que más te gusten para comprarlos después.</p>
            <Link to="/explorar-tiendas" className="bg-pink-100 text-pink-600 px-6 py-3 rounded-full font-bold hover:bg-pink-200 transition-colors">
              Explorar tiendas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="bg-white rounded-[2rem] p-5 flex flex-col relative group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <button onClick={() => toggleFavorite(product)} className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-pink-500 hover:bg-white shadow-sm transition-all">
                  <Heart size={18} className="fill-pink-500" />
                </button>

                <Link to={`/producto/${product.slug}`} className="flex flex-col flex-1 mt-2">
                  <div className={`h-40 rounded-[1.5rem] flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-95 relative overflow-hidden ${product.image_url ? 'bg-slate-100' : 'bg-slate-50 border-2 border-dashed border-slate-200'}`}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center w-full h-full">
                        <span className="text-[11px] font-bold text-slate-400 mb-1 leading-tight">Ups aqui deberia haber una foto hermosa...</span>
                        <span className="text-[9px] text-slate-400/80 font-medium">alguien sera despedido hoy</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm leading-snug mb-4 line-clamp-2 hover:text-pink-500 transition-colors">
                    {product.name}
                  </h4>
                </Link>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-slate-800">${product.price}</span>
                    <button onClick={() => addToCart({ ...product, quantity: 1 })} className="bg-slate-50 hover:bg-slate-800 hover:text-white text-slate-600 text-xs font-bold px-4 py-2.5 rounded-full transition-colors shadow-sm">
                      Agregar
                    </button>
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