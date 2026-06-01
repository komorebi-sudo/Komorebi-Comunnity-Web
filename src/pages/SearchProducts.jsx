import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Store, Heart, Filter, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import QuickAddPopover from '../components/QuickAddPopover';

export default function SearchProducts() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const navigate = useNavigate();
  const { getCartCount, toggleCart } = useCart();
  const { favorites } = useFavorites();
  const cartCount = getCartCount();

  // Estados de Búsqueda y Filtros
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopoverId, setOpenPopoverId] = useState(null);

  // Filtros del Sidebar
  const [maxPrice, setMaxPrice] = useState(100);

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        // 1. Traemos las tiendas para los logos
        let { data: storesData } = await supabase.from('stores').select('*');
        setStores(storesData || []);

        // 2. Construimos la consulta dinámica a Supabase
        let query = supabase.from('products').select('*');

        // Si hay texto, buscamos coincidencias en el nombre (ignorando mayúsculas/minúsculas)
        if (initialQuery) {
          query = query.ilike('name', `%${initialQuery}%`);
        }

        // Aplicamos el filtro de precio
        query = query.lte('price', maxPrice);

        const { data: productsData, error } = await query;
        if (error) throw error;
        
        setProducts(productsData || []);
      } catch (err) {
        console.error("Error buscando productos:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [initialQuery, maxPrice]); // Se vuelve a ejecutar si cambia la búsqueda o el precio

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200">
      {/* HEADER (Reutilizado para mantener consistencia) */}
      <header className="bg-[#faf9f8]/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500">
              <Store size={22} strokeWidth={2.5} />
            </div>
            <div className="text-xl font-bold tracking-tight text-slate-800">Komorebi</div>
          </Link>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="flex w-full bg-white rounded-full px-4 py-2.5 items-center shadow-sm border border-slate-100 focus-within:border-pink-200 focus-within:ring-4 focus-within:ring-pink-50 transition-all">
              <Search className="text-slate-400 mr-3" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca tiendas o productos..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-slate-400" 
              />
            </form>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link to="/favoritos" className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <Heart size={20} />
              {favorites.length > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{favorites.length}</span>}
            </Link>
            <button id="cart-header-icon" onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300 relative text-slate-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">
            {initialQuery ? `Resultados para "${initialQuery}"` : "Explorar Productos"}
          </h1>
          <p className="text-slate-500 mt-2">{products.length} productos encontrados</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* BARRA LATERAL DE FILTROS */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                <Filter size={18} /> Filtros
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-4">Precio Máximo: ${maxPrice}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="200" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full accent-pink-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>$1</span>
                  <span>$200+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* CUADRÍCULA DE RESULTADOS */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin mb-4 text-pink-400" size={40} />
                <p>Buscando magia...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No encontramos nada para "{initialQuery}"</h3>
                <p className="text-slate-500">Prueba usando otras palabras o ajustando el filtro de precio.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(product => {
                  const productStore = stores.find(s => s.id === product.store_id);

                  return (
                    <div key={product.id} className="bg-white rounded-[2rem] p-5 flex flex-col relative group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                      {product.badge && (
                        <span className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                          {product.badge}
                        </span>
                      )}
                      
                      <Link id={`product-image-${product.id}`} to={`/producto/${product.slug}`} className={`${product.bg_color || 'bg-slate-50'} h-48 rounded-[1.5rem] relative overflow-hidden flex items-center justify-center text-7xl mb-5 transition-transform duration-500 group-hover:scale-95`}>
                        {product.icon || '📦'}
                        {productStore && (
                          <div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm shadow-sm border border-slate-100" title={`Vendido por ${productStore.name}`}>
                            {productStore.avatar_icon || '🏪'}
                          </div>
                        )}
                      </Link>
                      
                      <Link to={`/producto/${product.slug}`}>
                        <h4 className="font-semibold text-slate-800 leading-snug mb-1 hover:text-pink-500 transition-colors line-clamp-2">{product.name}</h4>
                      </Link>

                      {productStore && (
                        <Link to={`/tienda/${productStore.slug}`} className="text-xs font-medium text-slate-400 mb-4 hover:text-pink-500 transition-colors flex items-center w-max">
                          {productStore.name}
                        </Link>
                      )}
                      
                      <div className="relative flex items-center justify-between mt-auto">
                        <span className="font-bold text-lg text-slate-800">${product.price}</span>
                        
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenPopoverId(openPopoverId === product.id ? null : product.id);
                          }} 
                          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-800 hover:text-white transition-colors shadow-sm"
                        >
                          <ShoppingBag size={18} />
                        </button>

                        {openPopoverId === product.id && (
                          <QuickAddPopover product={product} onClose={() => setOpenPopoverId(null)} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}