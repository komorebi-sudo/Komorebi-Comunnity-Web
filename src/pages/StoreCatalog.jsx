import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, SlidersHorizontal, Store, ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const storesDatabase = {
  "1": { name: "Sakura Treats", type: "Snacks Asiáticos", cover: "bg-pink-100", avatar: "🌸", products: [{ id: 101, name: 'Mochi de Melón Kubota', price: 12, bgColor: 'bg-pink-50', badge: 'TOP', icon: '🍈' }, { id: 102, name: 'Pocky Fresa Edición Limitada', price: 4, bgColor: 'bg-rose-50', icon: '🍓' }, { id: 103, name: 'Caramelos Bottle Caps', price: 3, bgColor: 'bg-orange-50', icon: '🍬' }, { id: 104, name: 'Skittles Yoghurt Mix', price: 5, bgColor: 'bg-fuchsia-50', icon: '🌈' }] },
  "2": { name: "Pixel Cozy", type: "Accesorios Gaming", cover: "bg-blue-100", avatar: "☁️", products: [{ id: 201, name: 'Taza Nube Cerámica', price: 12, bgColor: 'bg-blue-50', badge: 'NUEVO', icon: '☕' }, { id: 202, name: 'Consola Retro Pastel', price: 45, bgColor: 'bg-indigo-50', icon: '🎮' }, { id: 203, name: 'Mousepad Kawaii', price: 15, bgColor: 'bg-cyan-50', icon: '🖱️' }] },
  "3": { name: "Matcha Books", type: "Manga & Papelería", cover: "bg-emerald-100", avatar: "🍵", products: [{ id: 301, name: 'Set de Papelería Ghibli', price: 15, bgColor: 'bg-emerald-50', icon: '📝' }, { id: 302, name: 'Manga Vol. 1 Edición Especial', price: 10, bgColor: 'bg-teal-50', icon: '📖' }] },
  "4": { name: "Starlight", type: "Moda Kawaii", cover: "bg-purple-100", avatar: "✨", products: [{ id: 401, name: 'Sweater Oversize Pastel', price: 25, bgColor: 'bg-purple-50', badge: 'OFERTA', icon: '🎀' }, { id: 402, name: 'Mochila Osito', price: 30, bgColor: 'bg-fuchsia-50', icon: '🎒' }] }
};

export default function StoreCatalog() {
  const { storeId } = useParams();
  const [favorites, setFavorites] = useState(new Set());
  
  const { addToCart, toggleCart, getCartCount } = useCart();
  const cartCount = getCartCount();
  const store = storesDatabase[storeId];

  const toggleFavorite = (id) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
  };

  if (!store) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center text-slate-700">
        <h1 className="text-2xl font-bold mb-2">Tienda no encontrada</h1>
        <Link to="/" className="bg-pink-100 text-pink-600 px-6 py-2.5 rounded-full font-bold">Volver al Mall</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans pb-12 selection:bg-pink-200">
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

      <div className={`w-full h-40 ${store.cover} border-b border-slate-100 relative`}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-end pb-6 relative">
           <Link to="/" className="absolute top-6 left-6 flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white transition-colors text-slate-700 shadow-sm"><ArrowLeft size={14} className="mr-1" /> Volver</Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 relative -mt-12">
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-8 text-center relative pt-14">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm border-4 border-white">{store.avatar}</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{store.name}</h1>
            <p className="text-sm text-slate-500 mb-4">{store.type}</p>
          </div>
        </aside>

        <section className="flex-1 mt-12 md:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.products.map((product) => (
              <div key={product.id} className="bg-white rounded-[2rem] p-5 flex flex-col relative group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className={`${product.bgColor} h-40 rounded-[1.5rem] flex items-center justify-center text-7xl mb-5 transition-transform duration-500 group-hover:scale-95`}>{product.icon}</div>
                <div className="mt-auto">
                  <h4 className="font-semibold text-slate-800 text-sm leading-snug mb-4 line-clamp-2">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-slate-800">${product.price}</span>
                    <button onClick={() => addToCart({ ...product, store: store.name })} className="bg-slate-50 hover:bg-slate-800 hover:text-white text-slate-600 text-xs font-bold px-4 py-2.5 rounded-full transition-colors shadow-sm">Agregar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}