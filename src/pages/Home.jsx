import React from 'react';
import { Search, ShoppingBag, User, Store, ArrowRight, Star, BookOpen, Shirt, Sparkles, Heart, Gamepad2, Coffee, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

// --- MOCK DATA ---
const mockStores = [
  { id: 1, name: "Sakura Treats", type: "Snacks Asiáticos", rating: 4.9, cover: "bg-pink-100", avatar: "🌸" },
  { id: 2, name: "Pixel Cozy", type: "Accesorios Gaming", rating: 4.8, cover: "bg-blue-100", avatar: "☁️" },
  { id: 3, name: "Matcha Books", type: "Manga & Papelería", rating: 4.7, cover: "bg-emerald-100", avatar: "🍵" },
  { id: 4, name: "Starlight", type: "Moda Kawaii", rating: 4.9, cover: "bg-purple-100", avatar: "✨" },
];

const mockCategoriesGrid = [
  { id: 1, name: "Snacks & Dulces", count: "12 tiendas", Icon: Coffee, color: "bg-pink-100", textColor: "text-pink-600" },
  { id: 2, name: "Gaming Setup", count: "8 tiendas", Icon: Gamepad2, color: "bg-blue-100", textColor: "text-blue-600" },
  { id: 3, name: "Manga & Libros", count: "15 tiendas", Icon: BookOpen, color: "bg-emerald-100", textColor: "text-emerald-600" },
  { id: 4, name: "Moda & Ropa", count: "20 tiendas", Icon: Shirt, color: "bg-purple-100", textColor: "text-purple-600" },
  { id: 5, name: "Coleccionables", count: "10 tiendas", Icon: Store, color: "bg-orange-100", textColor: "text-orange-600" },
  { id: 6, name: "Arte & Papelería", count: "18 tiendas", Icon: Palette, color: "bg-rose-100", textColor: "text-rose-600" },
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
        
        {/* HERO SECTION */}
        <section className="mt-16 mb-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-600 shadow-sm border border-slate-100 mb-8">
            <span className="text-pink-400"><Sparkles size={16} /></span>
            <span>Descubre tiendas locales increíbles</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-800 leading-tight">
            Tu nuevo lugar favorito <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">para encontrar magia.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl">
            Un espacio acogedor donde creadores y marcas independientes comparten sus mejores productos contigo.
          </p>
        </section>

        {/* NUEVA SECCIÓN: EXPLORA POR CATEGORÍAS */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">Explora por Categorías</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockCategoriesGrid.map(cat => {
              const IconComponent = cat.Icon;
              return (
                <Link key={cat.id} to="/explorar-tiendas" className="bg-white rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all border border-slate-100 group">
                  <div className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <IconComponent size={28} className={cat.textColor} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{cat.count}</p>
                </Link>
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
                {/* Z-20 MANTENIDO AQUÍ PARA EVITAR EL CORTE DEL AVATAR */}
                <div className={`h-32 ${store.cover} w-full relative z-20 transition-transform duration-500 group-hover:scale-105`}>
                  <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border-4 border-white">
                    {store.avatar}
                  </div>
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