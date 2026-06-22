import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard';
import MarketplaceLayout from '../components/layout/MarketplaceLayout'; // IMPORTAMOS EL LAYOUT

export default function SearchProducts() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [maxPrice, setMaxPrice] = useState(100);

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      try {
        let { data: storesData } = await supabase.from('stores').select('*');
        setStores(storesData || []);

        let query = supabase.from('products').select('*');
        if (initialQuery) {
          query = query.ilike('name', `%${initialQuery}%`);
        }
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
  }, [initialQuery, maxPrice]);

  return (
    <MarketplaceLayout showSearch={true} initialSearch={initialQuery}>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">
            {initialQuery ? `Resultados para "${initialQuery}"` : "Explorar Productos"}
          </h1>
          <p className="text-slate-500 mt-2">{products.length} productos encontrados</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* PANEL DE FILTROS */}
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
              </div>
            </div>
          </aside>

          {/* RESULTADOS */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin mb-4 text-pink-400" size={40} />
                <p>Buscando magia...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800">No encontramos nada.</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(product => {
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
          </div>
        </div>
      </main>
    </MarketplaceLayout>
  );
}