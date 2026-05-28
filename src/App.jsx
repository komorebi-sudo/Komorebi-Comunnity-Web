import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, Store, TrendingUp, ArrowRight, Star, Gamepad2, BookOpen, Shirt, Sparkles } from 'lucide-react';

// --- MOCK DATA (Simulación de Base de Datos del Mall) ---

const mockStores = [
  { id: 1, name: "Otaku Haven", type: "Anime & Manga", rating: 4.9, cover: "bg-purple-400", avatar: "👾" },
  { id: 2, name: "Retro Pixel", type: "Videojuegos Clásicos", rating: 4.8, cover: "bg-emerald-400", avatar: "🕹️" },
  { id: 3, name: "Sugar Tokyo", type: "Snacks Asiáticos", rating: 4.7, cover: "bg-pink-400", avatar: "🍡" },
  { id: 4, name: "Comics Vault", type: "Comics & Figuras", rating: 4.9, cover: "bg-blue-400", avatar: "🦸‍♂️" },
];

const mockCategories = [
  { id: 1, name: "Videojuegos", icon: <Gamepad2 size={24} />, color: "bg-emerald-100 text-emerald-700" },
  { id: 2, name: "Manga & Libros", icon: <BookOpen size={24} />, color: "bg-purple-100 text-purple-700" },
  { id: 3, name: "Ropa Geek", icon: <Shirt size={24} />, color: "bg-blue-100 text-blue-700" },
  { id: 4, name: "Coleccionables", icon: <Sparkles size={24} />, color: "bg-yellow-100 text-yellow-700" },
];

const mockTrending = [
  { id: 1, name: 'Figura Articulada Mecha', price: 45, store: 'Otaku Haven', bgColor: 'bg-indigo-100', icon: '🤖' },
  { id: 2, name: 'Caja Sorpresa Snacks', price: 20, store: 'Sugar Tokyo', bgColor: 'bg-rose-100', icon: '🍱' },
  { id: 3, name: 'Consola Retro Portátil', price: 60, store: 'Retro Pixel', bgColor: 'bg-teal-100', icon: '🎮' },
  { id: 4, name: 'Camiseta D20 Dice', price: 15, store: 'Ropa Geek', bgColor: 'bg-orange-100', icon: '🎲' },
];

export default function App() {
  const [cartCount, setCartCount] = useState(3);

  // Clases CSS reutilizables para el estilo "Neobrutalista"
  const brutalistShadow = "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const brutalistHover = "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all";

  return (
    <div className="min-h-screen bg-[#f4f3ec] text-slate-900 font-sans selection:bg-pink-300">
      
      {/* 1. HEADER DEL MALL */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo Principal */}
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className={`w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center ${brutalistShadow} group-hover:rotate-12 transition-transform`}>
              <Store size={20} strokeWidth={2.5} />
            </div>
            <div className="text-2xl font-black tracking-tighter uppercase">
              Komorebi<span className="text-purple-600">Mall</span>
            </div>
          </div>

          {/* Buscador Global (Oculto en móvil) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className={`flex w-full bg-white rounded-full p-1 items-center ${brutalistShadow}`}>
              <Search className="text-slate-400 ml-3 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="Busca tiendas, figuras, juegos..." 
                className="flex-1 bg-transparent border-none focus:outline-none font-medium"
              />
              <button className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors">
                Buscar
              </button>
            </div>
          </div>

          {/* Iconos de Usuario */}
          <div className="flex items-center space-x-4">
            <button className={`p-2 bg-white rounded-full ${brutalistShadow} ${brutalistHover} relative`}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-black">
                  {cartCount}
                </span>
              )}
            </button>
            <button className={`hidden sm:flex items-center space-x-2 bg-purple-200 px-4 py-2 rounded-full font-bold ${brutalistShadow} ${brutalistHover}`}>
              <User size={18} />
              <span>Mi Perfil</span>
            </button>
            <button className="md:hidden p-2"><Menu size={28} /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        
        {/* 2. HERO SECTION (El impacto visual) */}
        <section className="mt-12 mb-20 flex flex-col items-center text-center">
          <div className="inline-block bg-yellow-300 px-4 py-1.5 rounded-full font-black text-sm mb-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
            🚀 EL PRIMER MULTIVERSO DE TIENDAS GEEK
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 max-w-4xl leading-tight">
            Encuentra todo tu <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 stroke-black stroke-2" style={{ WebkitTextStroke: '2px black' }}>
              Loot Épico
            </span> en un solo lugar.
          </h1>
          <p className="text-xl font-medium text-slate-600 mb-10 max-w-2xl">
            Explora cientos de tiendas independientes de Venezuela. Desde figuras de colección hasta los snacks asiáticos más raros.
          </p>
          
          {/* Categorías Rápidas */}
          <div className="flex flex-wrap justify-center gap-4">
            {mockCategories.map(cat => (
              <button key={cat.id} className={`flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white font-bold text-lg ${brutalistShadow} ${brutalistHover}`}>
                <span className={cat.color + " p-1.5 rounded-lg border-2 border-black"}>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. SECCIÓN DE TIENDAS DESTACADAS (Lo más importante de un Marketplace) */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black uppercase flex items-center gap-3">
              <Store size={32} className="text-pink-500" /> Tiendas Destacadas
            </h2>
            <button className="font-bold text-purple-600 hover:underline flex items-center">
              Ver todas <ArrowRight size={18} className="ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStores.map(store => (
              <div key={store.id} className={`bg-white rounded-3xl overflow-hidden flex flex-col group cursor-pointer ${brutalistShadow} ${brutalistHover}`}>
                {/* Banner de la tienda */}
                <div className={`h-24 ${store.cover} w-full border-b-2 border-black relative`}>
                  {/* Avatar flotante */}
                  <div className="absolute -bottom-6 left-4 w-14 h-14 bg-white rounded-full border-2 border-black flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {store.avatar}
                  </div>
                </div>
                {/* Info de la tienda */}
                <div className="pt-8 pb-5 px-5 flex flex-col flex-1">
                  <h3 className="font-black text-xl mb-1">{store.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-4">{store.type}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center font-bold bg-yellow-100 px-2.5 py-1 rounded-lg border-2 border-black text-sm">
                      <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" /> {store.rating}
                    </span>
                    <button className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold group-hover:bg-purple-600 transition-colors">
                      Visitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SECCIÓN DE PRODUCTOS TENDENCIA (Mix de varios vendedores) */}
        <section className="mb-20">
          <h2 className="text-3xl font-black uppercase flex items-center gap-3 mb-8">
            <TrendingUp size={32} className="text-emerald-500" /> Trending Hoy
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mockTrending.map(product => (
              <div key={product.id} className={`bg-white rounded-3xl p-4 flex flex-col relative ${brutalistShadow} ${brutalistHover}`}>
                
                {/* Icono gigante de placeholder */}
                <div className={`${product.bgColor} h-48 rounded-2xl flex items-center justify-center text-7xl mb-4 border-2 border-black`}>
                  {product.icon}
                </div>
                
                {/* Tag de la tienda (¡CLAVE EN MARKETPLACES!) */}
                <div className="text-xs font-bold text-slate-500 mb-2 flex items-center">
                  <Store size={12} className="mr-1" /> {product.store}
                </div>

                <h4 className="font-black text-lg leading-tight mb-4 flex-1">
                  {product.name}
                </h4>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-black text-2xl">
                    ${product.price}
                  </span>
                  <button className="bg-emerald-300 p-2.5 rounded-full border-2 border-black hover:bg-emerald-400 transition-colors">
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CALL TO ACTION (Reclutar Vendedores) */}
        <section className={`bg-purple-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden ${brutalistShadow}`}>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black uppercase mb-4" style={{ WebkitTextStroke: '1px black' }}>
              ¿Tienes mercancía Geek?
            </h2>
            <p className="text-xl font-medium mb-8 text-purple-100">
              Abre tu propia tienda personalizada en Komorebi Mall en menos de 5 minutos y llega a miles de otakus y gamers en todo el país.
            </p>
            <button className={`bg-yellow-300 text-black px-8 py-4 rounded-full font-black text-lg ${brutalistShadow} hover:-translate-y-1 hover:bg-yellow-400 transition-all`}>
              Crear mi tienda gratis
            </button>
          </div>
          {/* Adornos de fondo */}
          <div className="absolute top-0 left-0 text-9xl opacity-20 transform -translate-x-1/2 -translate-y-1/4">🛍️</div>
          <div className="absolute bottom-0 right-0 text-9xl opacity-20 transform translate-x-1/4 translate-y-1/4">✨</div>
        </section>

      </main>
    </div>
  );
}