import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, Store, TrendingUp, ChevronRight, Star, Gamepad2, BookOpen, Shirt, Sparkles, Heart } from 'lucide-react';

// --- MOCK DATA ---
const mockStores = [
  { id: 1, name: "Sakura Shop", type: "Anime & Papelería", rating: 4.9, bg: "bg-pink-50", iconBg: "bg-pink-200", text: "text-pink-600", avatar: "🌸" },
  { id: 2, name: "Cozy Games", type: "Videojuegos & Consolas", rating: 4.8, bg: "bg-blue-50", iconBg: "bg-blue-200", text: "text-blue-600", avatar: "🎮" },
  { id: 3, name: "Matcha Bites", type: "Snacks Importados", rating: 4.9, bg: "bg-green-50", iconBg: "bg-green-200", text: "text-green-600", avatar: "🍵" },
  { id: 4, name: "Starlight", type: "Figuras & K-Pop", rating: 4.7, bg: "bg-purple-50", iconBg: "bg-purple-200", text: "text-purple-600", avatar: "✨" },
];

const mockCategories = [
  { id: 1, name: "Figuras", icon: <Sparkles size={20} className="text-purple-500" /> },
  { id: 2, name: "Snacks", icon: <Heart size={20} className="text-pink-500" /> },
  { id: 3, name: "Ropa", icon: <Shirt size={20} className="text-blue-500" /> },
  { id: 4, name: "Juegos", icon: <Gamepad2 size={20} className="text-emerald-500" /> },
  { id: 5, name: "Manga", icon: <BookOpen size={20} className="text-orange-500" /> },
];

const mockTrending = [
  { id: 1, name: 'Peluche Gato Kawaii 30cm', price: 25, store: 'Sakura Shop', imgBg: 'bg-[#ffe4e6]', icon: '🐈' },
  { id: 2, name: 'Caja Pocky Fresa Matcha', price: 8, store: 'Matcha Bites', imgBg: 'bg-[#dcfce7]', icon: '🍓' },
  { id: 3, name: 'Nintendo Switch Lite Coral', price: 199, store: 'Cozy Games', imgBg: 'bg-[#e0e7ff]', icon: '🕹️' },
  { id: 4, name: 'Lámpara Luna 3D', price: 15, store: 'Starlight', imgBg: 'bg-[#f3e8ff]', icon: '🌕' },
];

export default function Home() {
  const [cartCount, setCartCount] = useState(2);

  return (
    // Fondo principal muy claro, cálido y limpio
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200">
      
      {/* 1. HEADER MINIMALISTA */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Suave */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center transform rotate-3">
              <Store size={22} strokeWidth={2} />
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-800">
              Komorebi<span className="text-pink-400 font-medium">.</span>
            </div>
          </div>

          {/* Buscador Integrado (Pill shape suave) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-12">
            <div className="flex w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-full px-5 py-2.5 items-center border border-slate-200/60 focus-within:border-pink-200 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(244,114,182,0.1)]">
              <Search className="text-slate-400 mr-3" size={18} />
              <input 
                type="text" 
                placeholder="Busca tiendas, peluches, dulces..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Iconos de Usuario */}
          <div className="flex items-center space-x-5 text-slate-500">
            <button className="hover:text-pink-500 transition-colors hidden sm:block">
              <Heart size={22} strokeWidth={1.5} />
            </button>
            <button className="hover:text-pink-500 transition-colors relative">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <button className="hidden sm:flex items-center space-x-2 text-sm font-semibold hover:text-slate-800 transition-colors">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span>Entrar</span>
            </button>
            <button className="md:hidden"><Menu size={24} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* 2. HERO SECTION (Suave y acogedor) */}
        <section className="mt-16 mb-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-pink-50 text-pink-600 px-4 py-2 rounded-full font-medium text-sm mb-6">
              <Sparkles size={16} />
              <span>Tu nuevo lugar favorito</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-6 leading-[1.1]">
              Un espacio para <br className="hidden md:block" />
              tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">gustos únicos.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Descubre tienditas locales llenas de magia. Desde snacks asiáticos hasta coleccionables que te harán sonreír.
            </p>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-lg hover:shadow-slate-800/20 active:scale-95">
              Explorar el Mall
            </button>
          </div>

          {/* Composición visual en lugar de una sola imagen grande */}
          <div className="flex-1 hidden lg:flex justify-center relative w-full h-[400px]">
             {/* Simulando tarjetas flotantes cute */}
             <div className="absolute top-10 right-20 w-48 h-64 bg-pink-100 rounded-3xl rotate-6 shadow-xl shadow-pink-100/50 flex flex-col items-center justify-center text-6xl">🍡</div>
             <div className="absolute bottom-10 left-10 w-56 h-56 bg-purple-100 rounded-[2.5rem] -rotate-3 shadow-xl shadow-purple-100/50 flex flex-col items-center justify-center text-7xl z-10">🧸</div>
             <div className="absolute top-32 left-32 w-40 h-40 bg-blue-100 rounded-full shadow-xl shadow-blue-100/50 flex flex-col items-center justify-center text-5xl">🎮</div>
          </div>
        </section>

        {/* 3. CATEGORÍAS (Estilo Burbuja) */}
        <section className="mb-20">
          <div className="flex flex-wrap justify-center gap-4">
            {mockCategories.map(cat => (
              <button key={cat.id} className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-sm shadow-slate-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all border border-slate-100 text-slate-600 hover:text-slate-800 font-medium">
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. TIENDAS DESTACADAS (Tarjetas suaves) */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Tienditas con encanto</h2>
              <p className="text-slate-500">Apoya a creadores y vendedores locales.</p>
            </div>
            <button className="hidden sm:flex items-center text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors">
              Ver todas <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStores.map(store => (
              <div key={store.id} className={`${store.bg} p-6 rounded-[2rem] flex flex-col items-center text-center group cursor-pointer transition-transform hover:-translate-y-1`}>
                <div className={`w-20 h-20 ${store.iconBg} rounded-3xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {store.avatar}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{store.name}</h3>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${store.text}`}>{store.type}</p>
                <div className="flex items-center bg-white/60 px-3 py-1 rounded-full text-sm font-medium text-slate-600">
                  <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" /> {store.rating}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. PRODUCTOS TENDENCIA (Catálogo limpio) */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800">Recién llegados</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {mockTrending.map(product => (
              <div key={product.id} className="group cursor-pointer">
                {/* Imagen (Fondo Suave) */}
                <div className={`${product.imgBg} aspect-square rounded-[2rem] flex items-center justify-center text-6xl mb-4 relative overflow-hidden`}>
                  <div className="transform group-hover:scale-110 transition-transform duration-500">{product.icon}</div>
                  
                  {/* Botón Favorito Flotante Oculto */}
                  <button className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-400 hover:text-pink-500">
                    <Heart size={18} />
                  </button>
                </div>
                
                {/* Info */}
                <div className="px-2">
                  <div className="flex items-center text-xs text-slate-400 mb-1.5">
                    <Store size={12} className="mr-1" /> {product.store}
                  </div>
                  <h4 className="font-semibold text-slate-700 leading-tight mb-2 group-hover:text-pink-500 transition-colors">
                    {product.name}
                  </h4>
                  <div className="font-bold text-lg text-slate-800">
                    ${product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CALL TO ACTION (Suave e invitante) */}
        <section className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-pink-500">
              <Store size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
              Abre tu propia tiendita
            </h2>
            <p className="text-slate-600 mb-8 text-lg">
              Únete a nuestra comunidad de vendedores. Es fácil, rápido y lleno de color. Personaliza tu espacio y empieza a vender.
            </p>
            <button className="bg-white text-slate-800 px-8 py-4 rounded-full font-bold text-lg shadow-sm hover:shadow-md transition-all active:scale-95 border border-slate-100">
              Crear mi tienda gratis
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}