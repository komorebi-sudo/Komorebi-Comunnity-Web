import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import MarketplaceLayout from '../components/layout/MarketplaceLayout'; // IMPORTAMOS EL LAYOUT

export default function Favorites() {
  const { favorites } = useFavorites();
  const [openPopoverId, setOpenPopoverId] = useState(null);

  return (
    <MarketplaceLayout showSearch={false}>
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24">
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
              <ProductCard 
                key={product.id} 
                product={product} 
                openPopoverId={openPopoverId} 
                setOpenPopoverId={setOpenPopoverId} 
              />
            ))}
          </div>
        )}
      </main>
    </MarketplaceLayout>
  );
}