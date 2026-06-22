import React, { useEffect, useState } from 'react';
import { Store, ArrowRight, Star, BookOpen, Shirt, Sparkles, Gamepad2, Coffee, Palette, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom'; 

// IMPORTACIONES ARQUITECTÓNICAS
import MarketplaceLayout from '../components/layout/MarketplaceLayout';
import ProductCard from '../components/ProductCard';
import OptimizedImage from '../components/ui/OptimizedImage';

const mockCategoriesGrid = [
  { id: 1, name: "Snacks & Dulces", count: "12 tiendas", Icon: Coffee, color: "bg-pink-100", textColor: "text-pink-600" },
  { id: 2, name: "Gaming Setup", count: "8 tiendas", Icon: Gamepad2, color: "bg-blue-100", textColor: "text-blue-600" },
  { id: 3, name: "Manga & Libros", count: "15 tiendas", Icon: BookOpen, color: "bg-emerald-100", textColor: "text-emerald-600" },
  { id: 4, name: "Moda & Ropa", count: "20 tiendas", Icon: Shirt, color: "bg-purple-100", textColor: "text-purple-600" },
  { id: 5, name: "Coleccionables", count: "10 tiendas", Icon: Store, color: "bg-orange-100", textColor: "text-orange-600" },
  { id: 6, name: "Arte & Papelería", count: "18 tiendas", Icon: Palette, color: "bg-rose-100", textColor: "text-rose-600" },
];

export default function Home() {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [stores, setStores] = useState([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        let { data: storesData } = await supabase.from('stores').select('*');
        setStores(storesData || []); 
        let { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8);
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
    <MarketplaceLayout showSearch={true}>
      <main className="max-w-6xl mx-auto px-6 pb-24">
        
        {/* HERO SECTION */}
        <section className="mt-16 mb-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-600 shadow-sm border border-slate-100 mb-8">
            <span className="text-pink-400"><Sparkles size={16} /></span><span>Descubre tiendas locales increíbles</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-800 leading-tight">
            Tu nuevo lugar favorito <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">para encontrar magia.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl">Un espacio acogedor donde creadores y marcas independientes comparten sus mejores productos contigo.</p>
        </section>

        {/* CATEGORÍAS */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10"><h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">Explora por Categorías</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockCategoriesGrid.map(cat => {
              const IconComponent = cat.Icon;
              return (
                <Link key={cat.id} to="/explorar-tiendas" className="bg-white rounded-3xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all border border-slate-100 group">
                  <div className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}><IconComponent size={28} className={cat.textColor} strokeWidth={2} /></div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{cat.count}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* TIENDAS QUE AMAMOS (Optimizadas) */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">Tiendas que amamos</h2>
            <Link to="/explorar-tiendas" className="text-sm font-semibold text-pink-500 hover:text-pink-600 flex items-center">Explorar todas <ArrowRight size={16} className="ml-1" /></Link>
          </div>
          {isLoadingStores ? (<div className="text-center py-10 text-slate-400 font-medium">Buscando tiendas en Komorebi... 🌸</div>) : stores.length === 0 ? (<div className="text-center py-10 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-500">Aún no hay tiendas registradas.</div>) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stores.map(store => (
                <div key={store.id} className="bg-white rounded-[2rem] overflow-hidden flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative">
                  <div className="h-32 bg-slate-100 w-full relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <OptimizedImage src={store.banner_url} alt={`Banner de ${store.name}`} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-24 left-6 z-20 w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-black text-slate-300 shadow-sm border-4 border-white overflow-hidden">
                    {store.avatar_url ? <OptimizedImage src={store.avatar_url} alt={store.name} className="w-full h-full object-cover" /> : store.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="pt-10 pb-6 px-6 flex flex-col flex-1 bg-white relative z-10 mt-2">
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

        {/* TESOROS DEL DÍA (Con ProductCard) */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold text-slate-800 mb-10 flex items-center gap-3">Tesoros del día</h2>
          {isLoadingProducts ? (<div className="flex items-center justify-center py-10 text-slate-400"><Loader2 className="animate-spin mr-2 text-pink-400" size={24} /> Buscando productos...</div>) : featuredProducts.length === 0 ? (<div className="text-center py-10 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-500">Aún no hay productos.</div>) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => {
                const productStore = stores.find(s => s.id === product.store_id);
                return (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    store={productStore} 
                    openPopoverId={openPopoverId} 
                    setOpenPopoverId={setOpenPopoverId} 
                  />
                );
              })}
            </div>
          )}
        </section>

      </main>
    </MarketplaceLayout>
  );
}