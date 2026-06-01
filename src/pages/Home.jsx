import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, User, Store, ArrowRight, Star, BookOpen, Shirt, Sparkles, Heart, Gamepad2, Coffee, Palette, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useFavorites } from '../context/FavoritesContext';
import { supabase } from '../lib/supabaseClient';
// 1. IMPORTAMOS LA NUEVA VENTANITA
import QuickAddPopover from '../components/QuickAddPopover'; 

const mockCategoriesGrid = [
  { id: 1, name: "Snacks & Dulces", count: "12 tiendas", Icon: Coffee, color: "bg-pink-100", textColor: "text-pink-600" },
  { id: 2, name: "Gaming Setup", count: "8 tiendas", Icon: Gamepad2, color: "bg-blue-100", textColor: "text-blue-600" },
  { id: 3, name: "Manga & Libros", count: "15 tiendas", Icon: BookOpen, color: "bg-emerald-100", textColor: "text-emerald-600" },
  { id: 4, name: "Moda & Ropa", count: "20 tiendas", Icon: Shirt, color: "bg-purple-100", textColor: "text-purple-600" },
  { id: 5, name: "Coleccionables", count: "10 tiendas", Icon: Store, color: "bg-orange-100", textColor: "text-orange-600" },
  { id: 6, name: "Arte & Papelería", count: "18 tiendas", Icon: Palette, color: "bg-rose-100", textColor: "text-rose-600" },
];

export default function Home() {
  const { getCartCount, toggleCart, addToCart } = useCart();
  const cartCount = getCartCount();
  const { favorites } = useFavorites();
  
  // 2. AHORA GUARDAMOS EL ID DEL PRODUCTO ABIERTO, NO EL OBJETO
  const [openPopoverId, setOpenPopoverId] = useState(null);
  
  const [stores, setStores] = useState([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        let { data: storesData, error: storesError } = await supabase.from('stores').select('*');
        if (storesError) throw storesError;
        setStores(storesData || []); 
        
        let { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);
        if (productsError) throw productsError;
        setFeaturedProducts(productsData || []);

      } catch (err) {
        console.error("Error de conexión:", err);
      } finally {
        setIsLoadingStores(false); 
        setIsLoadingProducts(false);
      }
    }
    fetchData();
  }, []); 

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200">
      
      <header className="bg-[#faf9f8]/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
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
            <Link to="/favoritos" className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            <Link to="/login" className="hidden sm:flex items-center space-x-2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm">
              <User size={16} /><span>Entrar</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        
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
          
          {isLoadingStores ? (
             <div className="text-center py-10 text-slate-400 font-medium">Buscando tiendas en Komorebi... 🌸</div>
          ) : stores.length === 0 ? (
             <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-500">
                Aún no hay tiendas registradas. ¡Ve a Supabase y crea una!
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stores.map(store => (
                <div key={store.id} className="bg-white rounded-[2rem] overflow-hidden flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className={`h-32 ${store.cover_color || 'bg-slate-100'} w-full relative z-20 transition-transform duration-500 group-hover:scale-105`}>
                    <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border-4 border-white">
                      {store.avatar_icon || '🏪'}
                    </div>
                  </div>
                  <div className="pt-10 pb-6 px-6 flex flex-col flex-1 bg-white relative z-10">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{store.name}</h3>
                    <p className="text-sm text-slate-500 mb-6">{store.type}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="flex items-center text-sm font-semibold text-slate-600"><Star size={16} className="text-yellow-400 fill-yellow-400 mr-1.5" /> {store.rating || 5.0}</span>
                      <Link to={`/tienda/${store.slug}`} className="bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">Visitar</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-24">
          <h2 className="text-2xl font-bold text-slate-800 mb-10 flex items-center gap-3">Tesoros del día</h2>
          
          {isLoadingProducts ? (
             <div className="flex items-center justify-center py-10 text-slate-400">
               <Loader2 className="animate-spin mr-2 text-pink-400" size={24} /> Buscando productos...
             </div>
          ) : featuredProducts.length === 0 ? (
             <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-500">
                Aún no hay productos.
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => {
                const productStore = stores.find(s => s.id === product.store_id);

                return (
                  <div key={product.id} className="bg-white rounded-[2rem] p-5 flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                    
                    {product.badge && (
                      <span className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    <button className="absolute top-8 right-8 z-10 p-2 rounded-full bg-white/50 backdrop-blur-sm text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-pink-500 hover:bg-white shadow-sm">
                      <Heart size={18} />
                    </button>
                    
                    <Link to={`/producto/${product.slug}`} className={`${product.bg_color || 'bg-slate-50'} h-48 rounded-[1.5rem] relative overflow-hidden flex items-center justify-center text-7xl mb-5 transition-transform duration-500 group-hover:scale-95`}>
                      {product.icon || '📦'}
                      
                      {productStore && (
                        <div 
                          className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm shadow-sm border border-slate-100" 
                          title={`Vendido por ${productStore.name}`}
                        >
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
                    
                    {/* 3. CONTENEDOR RELATIVE PARA ANCLAR EL POPOVER */}
                    <div className="relative flex items-center justify-between mt-auto">
                      <span className="font-bold text-lg text-slate-800">${product.price}</span>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          // Si ya está abierto lo cerramos, si no lo abrimos
                          setOpenPopoverId(openPopoverId === product.id ? null : product.id);
                        }} 
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-800 hover:text-white transition-colors shadow-sm"
                        title={product.options && Object.keys(product.options).length > 0 ? "Elegir opciones" : "Agregar al carrito"}
                      >
                        <ShoppingBag size={18} />
                      </button>

                      {/* AQUÍ SE RENDERIZA LA VENTANITA SOLO SI ESTE PRODUCTO ESTÁ SELECCIONADO */}
                      {openPopoverId === product.id && (
                        <QuickAddPopover 
                          product={product} 
                          onClose={() => setOpenPopoverId(null)} 
                        />
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

    </div>
  );
}