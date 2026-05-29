import React from 'react';
import { Search, ShoppingBag, User, Store, ArrowRight, Star, BookOpen, Shirt, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

// --- MOCK DATA ---
const mockStores = [
  { id: 1, name: "Sakura Treats", type: "Snacks Asiáticos", rating: 4.9, cover: "bg-pink-100", avatar: "🌸" },
  { id: 2, name: "Pixel Cozy", type: "Accesorios Gaming", rating: 4.8, cover: "bg-blue-100", avatar: "☁️" },
  { id: 3, name: "Matcha Books", type: "Manga & Papelería", rating: 4.7, cover: "bg-emerald-100", avatar: "🍵" },
  { id: 4, name: "Starlight", type: "Moda Kawaii", rating: 4.9, cover: "bg-purple-100", avatar: "✨" },
];

const mockCategories = [
  { id: 1, name: "Snacks", Icon: Store, color: "bg-pink-50 text-pink-500" },
  { id: 2, name: "Manga", Icon: BookOpen, color: "bg-emerald-50 text-emerald-500" },
  { id: 3, name: "Ropa", Icon: Shirt, color: "bg-blue-50 text-blue-500" },
  { id: 4, name: "Deco", Icon: Sparkles, color: "bg-purple-50 text-purple-500" },
];

const mockTrending = [
  { id: 1, name: 'Pocky Fresa Edición Limitada', price: 4, store: 'Sakura Treats', bgColor: 'bg-pink-50', icon: '🍓' },
  { id: 2, name: 'Taza Nube Cerámica', price: 12, store: 'Pixel Cozy', bgColor: 'bg-blue-50', icon: '☕' },
  { id: 3, name: 'Set de Papelería Ghibli', price: 15, store: 'Matcha Books', bgColor: 'bg-emerald-50', icon: '📝' },
  { id: 4, name: 'Sweater Oversize Pastel', price: 25, store: 'Starlight', bgColor: 'bg-purple-50', icon: '🎀' },
];

export default function Home() {
  const { getCartCount, toggleCart, addToCart } = useCart();
  const cartCount = getCartCount();

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200">
      <header className="bg-[#faf9f8]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500">
              <Store size={22} strokeWidth={2.5} />
            </div>
            <div className="text-xl font-bold tracking-tight text-slate-800">
              Komorebi
            </div>
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="flex w-full bg-white rounded-full px-4 py-2.5 items-center shadow-sm border border-slate-100 focus-within:border-pink-200 focus-within:ring-4 focus-within:ring-pink-50 transition-all">
              <Search className="text-slate-400 mr-3" size={18} />
              <input type="text" placeholder="Busca tiendas o productos..." className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-slate-400" />
            </div>
          </div>
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
              <User size={16} /><span>Entrar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <section className="mt-16 mb-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-600 shadow-sm border border-slate-100 mb-8">
            <span className="text-pink-400"><Sparkles size={16} /></span>
            <span>Descubre tiendas locales increíbles</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-800 leading-tight">
            Tu nuevo lugar favorito <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">para encontrar magia.</span>
          </h1>
          <p className="text-lg text-slate-500 mb-12 max-w-xl">
            Un espacio acogedor donde creadores y marcas independientes comparten sus mejores productos contigo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {mockCategories.map(cat => {
              const IconComponent = cat.Icon;
              return (
                <button key={cat.id} className="flex items-center space-x-3 px-5 py-3 rounded-full bg-white text-sm font-semibold shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-pink-100">
                  <span className={`${cat.color} p-1.5 rounded-full`}><IconComponent size={20} /></span>
                  <span className="text-slate-700">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">Tiendas que amamos</h2>
            <Link to="/explorar-tiendas" className="text-sm font-semibold text-pink-500 hover:text-pink-600 flex items-center">
              Explorar todas <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStores.map(store => (
              <div key={store.id} className="bg-white rounded-[2rem] overflow-hidden flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className={`h-32 ${store.cover} w-full relative transition-transform duration-500 group-hover:scale-105`}>
                  <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border-4 border-white">{store.avatar}</div>
                </div>
                <div className="pt-10 pb-6 px-6 flex flex-col flex-1 bg-white relative z-10">
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{store.name}</h3>
                  <p className="text-sm text-slate-500 mb-6">{store.type}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center text-sm font-semibold text-slate-600"><Star size={16} className="text-yellow-400 fill-yellow-400 mr-1.5" /> {store.rating}</span>
                    <Link to={`/tienda/${store.id}`} className="bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">Visitar</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-2xl font-bold text-slate-800 mb-10 flex items-center gap-3">Tesoros del día</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mockTrending.map(product => (
              <div key={product.id} className="bg-white rounded-[2rem] p-5 flex flex-col relative group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <button className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/50 backdrop-blur-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-pink-500 hover:bg-white">
                  <Heart size={18} />
                </button>
                <div className={`${product.bgColor} h-48 rounded-[1.5rem] flex items-center justify-center text-7xl mb-5 transition-transform duration-500 group-hover:scale-95`}>{product.icon}</div>
                <div className="text-xs font-medium text-slate-400 mb-2 flex items-center">{product.store}</div>
                <h4 className="font-semibold text-slate-800 leading-snug mb-4 flex-1">{product.name}</h4>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg text-slate-800">${product.price}</span>
                  <button onClick={() => addToCart(product)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-800 hover:text-white transition-colors">
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}