import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, Store, TrendingUp, ArrowRight, Star, Gamepad2, BookOpen, Shirt, Sparkles } from 'lucide-react';

// --- MOCK DATA ---
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

// --- COMPONENTE HOME ---
export default function Home() {
  const [cartCount, setCartCount] = useState(3);

  const brutalistShadow = "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const brutalistHover = "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all";

  return (
    <div className="min-h-screen bg-[#f4f3ec] text-slate-900 font-sans selection:bg-pink-300">
      
      {/* 1. HEADER DEL MALL */}
      <header className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className={`w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center ${brutalistShadow} group-hover:rotate-12 transition-transform`}>
              <Store size={20} strokeWidth={2.5} />
            </div>
            <div className="text-2xl font-black tracking-tighter uppercase">
              Komorebi<span className="text-purple-600">Mall</span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className={`flex w-full bg-white rounded-full p-1 items-center ${brutalistShadow}`}>
              <Search className="text-slate-400 ml-3 mr-2" size={20} />
              <input type="text" placeholder="Busca tiendas, figuras, juegos..." className="flex-1 bg-transparent border-none focus:outline-none font-medium" />
              <button className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors">Buscar</button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className={`p-2 bg-white rounded-full ${brutalistShadow} ${brutalistHover} relative`}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-black">{cartCount}</span>}
            </button>
            <button className={`hidden sm:flex items-center space-x-2 bg-purple-200 px-4 py-2 rounded-full font-bold ${brutalistShadow} ${brutalistHover}`}>
              <User size={18} /><span>Mi Perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        {/* Hero Section */}
        <section className="mt-12 mb-20 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 max-w-4xl leading-tight">
                Encuentra todo tu <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 stroke-black stroke-2" style={{ WebkitTextStroke: '2px black' }}>Loot Épico</span>
            </h1>
        </section>

        {/* Tiendas Destacadas */}
        <section className="mb-20">
            <h2 className="text-3xl font-black uppercase flex items-center gap-3 mb-8">Tiendas Destacadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {mockStores.map(store => (
                    <div key={store.id} className={`bg-white rounded-3xl p-5 ${brutalistShadow}`}>
                        <h3 className="font-black text-xl">{store.name}</h3>
                        <button className="bg-black text-white px-4 py-1 mt-4 rounded-full">Visitar</button>
                    </div>
                ))}
            </div>
        </section>
      </main>
    </div>
  );
}