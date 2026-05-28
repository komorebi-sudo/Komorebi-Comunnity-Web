import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, User, Menu, ChevronDown, SlidersHorizontal, ChevronRight } from 'lucide-react';

// Datos de prueba (Mocks) para los productos, simulando una base de datos
const mockProducts = [
  { id: 1, name: 'Mochi de Melón Kubota Seika', price: 12, bgColor: 'bg-[#c3f07a]', badge: 'TOP', icon: '🍈' },
  { id: 2, name: 'Bolas de Chocolate Maltesers', price: 4, bgColor: 'bg-[#ffb3c6]', icon: '🍫' },
  { id: 3, name: 'Caramelos Bottle Caps', price: 3, bgColor: 'bg-[#ffe4b5]', icon: '🍬' },
  { id: 4, name: 'Tambor Toxic Waste Purple', price: 6, bgColor: 'bg-[#a0e8f0]', icon: '☣️' },
  { id: 5, name: 'Gomitas Hartbeat Jumbo Love', price: 5, bgColor: 'bg-[#ffc999]', badge: 'NUEVO', icon: '❤️' },
  { id: 6, name: 'Chocolate Toblerone Nougat', price: 8, bgColor: 'bg-[#ffe4b5]', icon: '🍫' },
  { id: 7, name: 'Skittles Yoghurt Mix', price: 5, bgColor: 'bg-[#ffb3c6]', icon: '🌈' },
  { id: 8, name: 'Crema de Chocolate Teasers', price: 15, bgColor: 'bg-[#c3f07a]', icon: '🍯' },
  { id: 9, name: 'Mochi Tradicional Kubota', price: 11, bgColor: 'bg-[#ffe4b5]', icon: '🍡' },
  { id: 10, name: 'Oreo Crispy Roll Matcha', price: 4, bgColor: 'bg-[#ffc999]', icon: '🍵' },
  { id: 11, name: 'Marshmallow con Fresa', price: 5, bgColor: 'bg-[#ffb3c6]', icon: '🍓' },
  { id: 12, name: 'Kinder Bueno Mini', price: 7, bgColor: 'bg-[#a0e8f0]', icon: '🍫' },
];

export default function App() {
  const [favorites, setFavorites] = useState(new Set([1, 4])); // Simulamos algunos favoritos ya marcados
  const [cartCount, setCartCount] = useState(2);

  const toggleFavorite = (id) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
  };

  return (
    // Contenedor principal con el color de fondo rosa muy claro
    <div className="min-h-screen bg-[#fdf0f5] text-slate-800 font-sans pb-12">
      
      {/* 1. BARRA DE NAVEGACIÓN (HEADER) */}
      <header className="bg-white/50 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="text-3xl font-extrabold text-[#d26c8b] tracking-tighter cursor-pointer">
            GIFTIE<span className="text-teal-500">.</span>
          </div>

          {/* Enlaces de Navegación (Ocultos en móvil) */}
          <nav className="hidden md:flex space-x-6 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-teal-600 transition-colors">Catálogo</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Ofertas</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Envíos</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Blog</a>
          </nav>

          {/* Iconos de Acción */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-600 hover:text-[#d26c8b] transition-colors"><Heart size={20} /></button>
            <button className="p-2 text-slate-600 hover:text-teal-600 transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#d26c8b] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="hidden sm:flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-full font-medium transition-colors">
              <User size={18} />
              <span>Entrar</span>
            </button>
            <button className="md:hidden p-2 text-slate-600"><Menu size={24} /></button>
          </div>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* BARRA LATERAL (FILTROS) */}
        <aside className="w-full md:w-64 flex-shrink-0">
          {/* Breadcrumbs (Ruta) */}
          <div className="flex items-center text-xs text-slate-500 mb-6 space-x-1">
            <a href="#" className="hover:underline">Inicio</a>
            <ChevronRight size={12} />
            <a href="#" className="hover:underline">Catálogo</a>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-semibold">Dulces Asiáticos</span>
          </div>

          <h1 className="text-4xl font-bold text-teal-800 mb-8 font-serif tracking-tight">Catálogo</h1>

          {/* Menú de Categorías */}
          <div className="space-y-2 mb-8">
            <h3 className="font-bold mb-3 text-slate-800">Categorías</h3>
            <button className="w-full flex justify-between items-center bg-[#fbcfe8] text-[#9d174d] px-4 py-2.5 rounded-2xl font-medium text-sm">
              Dulces <ChevronDown size={16} />
            </button>
            <div className="pl-4 space-y-2 text-sm text-slate-600 mt-2">
              <a href="#" className="block hover:text-teal-600">Barras de chocolate</a>
              <a href="#" className="block hover:text-teal-600">Gomitas</a>
              <a href="#" className="block hover:text-teal-600">Mochi</a>
              <a href="#" className="block hover:text-teal-600 font-bold text-slate-800">Ver todo...</a>
            </div>
            <button className="w-full flex justify-between items-center bg-white border border-slate-200 px-4 py-2.5 rounded-2xl font-medium text-sm mt-2 hover:bg-slate-50 text-slate-600">
              Bebidas <ChevronDown size={16} />
            </button>
          </div>

          {/* Sección de Filtros */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold mb-4 flex items-center text-slate-800">
              <SlidersHorizontal size={16} className="mr-2" /> Filtros
            </h3>
            
            {/* Filtro: Precio */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block text-slate-700">Precio ($)</label>
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="0" className="w-full border rounded-xl px-3 py-1.5 text-sm bg-slate-50 focus:outline-none focus:border-teal-400" />
                <span>-</span>
                <input type="number" placeholder="100" className="w-full border rounded-xl px-3 py-1.5 text-sm bg-slate-50 focus:outline-none focus:border-teal-400" />
              </div>
            </div>

            {/* Filtro: Marca */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 block text-slate-700 flex justify-between">
                Marca <ChevronDown size={14} className="text-slate-400"/>
              </label>
              <div className="space-y-2 text-sm text-slate-600">
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" /> <span>Pocky</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" /> <span>Kasugai</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" /> <span>Meiji</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" className="rounded text-teal-500 focus:ring-teal-500" /> <span>Kracie</span></label>
              </div>
            </div>

            {/* Botones de acción del filtro */}
            <div className="flex flex-col space-y-2 mt-8">
              <button className="w-full border-2 border-slate-200 text-slate-600 font-medium py-2 rounded-full hover:bg-slate-50 transition-colors">Limpiar</button>
              <button className="w-full bg-[#fbcfe8] text-[#9d174d] font-bold py-2 rounded-full hover:bg-[#f9a8d4] transition-colors">Aplicar</button>
            </div>
          </div>
        </aside>

        {/* ZONA DE PRODUCTOS (GRID) */}
        <section className="flex-1">
          
          {/* Barra de Búsqueda Superior */}
          <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-slate-100 mb-8 items-center">
            <Search className="text-slate-400 ml-3 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Encuentra tu dulce favorito..." 
              className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 placeholder-slate-400"
            />
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
              Buscar
            </button>
          </div>

          {/* Grid de Tarjetas de Producto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {mockProducts.map((product) => (
              <div 
                key={product.id} 
                className={`${product.bgColor} rounded-3xl p-4 flex flex-col relative group transition-transform hover:-translate-y-1 hover:shadow-lg`}
              >
                {/* Etiqueta / Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-orange-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                    {product.badge}
                  </span>
                )}

                {/* Botón de Favorito */}
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors"
                >
                  <Heart 
                    size={18} 
                    className={favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-slate-700"} 
                  />
                </button>

                {/* Imagen del producto (Simulada con emojis grandes para el prototipo) */}
                <div className="h-40 flex items-center justify-center text-7xl mb-4 drop-shadow-md">
                  {product.icon}
                </div>

                {/* Información del producto */}
                <div className="mt-auto">
                  <h4 className="font-semibold text-slate-800 text-sm leading-tight mb-4 h-10 line-clamp-2">
                    {product.name}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <button className="bg-white/80 hover:bg-white text-slate-800 text-xs font-bold px-4 py-2 rounded-full transition-colors border border-white/50 shadow-sm">
                      Al carrito
                    </button>
                    <span className="font-extrabold text-slate-800">
                      ${product.price}
                    </span>
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