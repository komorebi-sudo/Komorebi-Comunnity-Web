import React from 'react';
import { Search, Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuickAddPopover from '../components/QuickAddPopover';
import OptimizedImage from '../components/ui/OptimizedImage';

export default function TemplatePixel({
  store,
  processedProducts,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  toggleFavorite,
  isFavorite,
  addToCart,
  openPopoverId,
  setOpenPopoverId
}) {
  // Aplicamos la fuente retro a todo el contenedor
  const retroFont = { fontFamily: '"Press Start 2P", cursive', letterSpacing: '-1px' };

  return (
    <div style={retroFont} className="min-h-screen bg-[#F0F0F0] text-black pb-12 selection:bg-[#FF004D] selection:text-white uppercase">
      
      {/* BANNER 8-BIT */}
      <div className="w-full h-48 border-b-8 border-black relative overflow-hidden bg-[#87CEEB]">
        {store.banner_url ? (
          <img src={store.banner_url} alt="Banner" className="absolute inset-0 w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
             <span className="text-[#FFCC00] text-xl animate-pulse">INSERT COIN...</span>
          </div>
        )}
        <div className="absolute top-6 left-6 z-10">
           <Link to="/" className="bg-white border-4 border-black px-4 py-2 text-xs hover:bg-[#FFCC00] transition-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none flex items-center">
             <ArrowLeft size={16} className="mr-2" strokeWidth={3} /> VOLVER
           </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 relative -mt-16">
        
        {/* AVATAR Y TÍTULO 8-BIT */}
        <div className="bg-white border-4 border-black p-6 mb-8 text-center relative shadow-[8px_8px_0_0_#000]">
          <div className="w-24 h-24 mx-auto bg-white border-4 border-black mb-4 flex items-center justify-center text-4xl shadow-[4px_4px_0_0_#000] overflow-hidden">
            {store.avatar_url ? (
              <img src={store.avatar_url} alt={store.name} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
            ) : (
              store.name?.charAt(0).toUpperCase()
            )}
          </div>
          <h1 className="text-xl md:text-2xl text-black mb-2 leading-loose">{store.name}</h1>
          <p className="text-[10px] text-gray-500">LVL 1 - {store.type}</p>
        </div>

        {/* CONTROLES DE BÚSQUEDA 8-BIT */}
        {store.products && store.products.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <input 
                type="text" placeholder={`BUSCAR EN ${store.name}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-4 bg-white border-4 border-black outline-none focus:bg-[#FFCC00] transition-none text-xs shadow-[4px_4px_0_0_#000]"
              />
            </div>
            <select
              value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full sm:w-64 px-4 py-4 bg-white border-4 border-black text-xs appearance-none outline-none focus:bg-[#FFCC00] shadow-[4px_4px_0_0_#000] cursor-pointer"
            >
              <option value="todos">TODO EL INVENTARIO</option>
              <option value="precio-menor">$$$ MENOR</option>
              <option value="precio-mayor">$$$ MAYOR</option>
            </select>
          </div>
        )}

        {/* GRID DE PRODUCTOS 8-BIT */}
        {processedProducts.length === 0 ? (
          <div className="bg-black text-white p-12 text-center border-4 border-white shadow-[8px_8px_0_0_#000]">
            <h3 className="text-xl text-[#FF004D] mb-4 blink">GAME OVER</h3>
            <p className="text-xs">NO SE ENCONTRARON OBJETOS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 flex flex-col relative border-4 border-black shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#FF004D] transition-all duration-75">
                
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
                  className={`absolute top-2 right-2 z-10 p-2 border-4 border-black transition-none shadow-[2px_2px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none ${isFavorite(product.id) ? 'bg-[#FF004D] text-white' : 'bg-white text-black hover:bg-[#FFCC00]'}`}
                >
                  <Heart size={16} strokeWidth={3} className={isFavorite(product.id) ? "fill-white" : ""} />
                </button>

                <Link to={`/producto/${product.slug}`} className="flex flex-col flex-1 cursor-pointer">
                  <div className={`h-40 border-4 border-black flex items-center justify-center mb-4 relative overflow-hidden bg-gray-200`}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                    ) : (
                      <span className="text-[10px]">NO_IMG.SPR</span>
                    )}
                  </div>
                  <h4 className="text-[11px] leading-relaxed mb-4 line-clamp-2 hover:text-[#FF004D]">{product.name}</h4>
                </Link>
                
                <div className="mt-auto border-t-4 border-black pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${product.price}</span>
                    <button 
                      onClick={(e) => { e.preventDefault(); setOpenPopoverId(openPopoverId === product.id ? null : product.id); }} 
                      className="bg-[#29ADFF] text-white border-4 border-black text-[10px] px-3 py-2 shadow-[4px_4px_0_0_#000] hover:bg-[#FFCC00] hover:text-black active:translate-y-1 active:translate-x-1 active:shadow-none transition-none"
                    >
                      ADD
                    </button>
                    {openPopoverId === product.id && <QuickAddPopover product={product} onClose={() => setOpenPopoverId(null)} />}
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