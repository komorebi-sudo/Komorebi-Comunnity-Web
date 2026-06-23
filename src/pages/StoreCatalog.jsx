import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useQuery } from '@tanstack/react-query'; // <-- IMPORTAMOS LA MAGIA DE CACHÉ
import TemplateDefault from '../templates/TemplateDefault';
import TemplatePixel from '../templates/TemplatePixel';

export default function StoreCatalog() {
  const { storeSlug } = useParams();
  const [openPopoverId, setOpenPopoverId] = useState(null);

  // 1. Buscamos la tienda y la guardamos en caché
  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ['store', storeSlug],
    queryFn: async () => {
      const { data, error } = await supabase.from('stores').select('*').eq('slug', storeSlug).single();
      if (error) throw error;
      return data;
    }
  });

  // 2. Buscamos los productos SOLO si ya tenemos el store_id
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', store?.id],
    enabled: !!store?.id, // Solo se ejecuta si store.id existe
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('store_id', store.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Mostramos el spinner general solo para la carga inicial de la página de la tienda
  if (isLoadingStore) {
    return <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={32}/></div>;
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center p-6 text-center">
        <Store size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Tienda no encontrada</h2>
        <p className="text-slate-500 mb-6">Parece que el enlace es incorrecto o la tienda ya no existe.</p>
        <Link to="/explorar-tiendas" className="bg-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-pink-600 transition-colors">Volver a Explorar</Link>
      </div>
    );
  }

  // Rutero inteligente de plantillas: aquí pasamos isLoadingProducts para que la plantilla dibuje los Skeletons
  if (store.template_id === 'pixel') {
    return <TemplatePixel store={store} products={products} isLoading={isLoadingProducts} openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId} />;
  }

  // Por defecto usa la plantilla moderna
  return <TemplateDefault store={store} products={products} isLoading={isLoadingProducts} openPopoverId={openPopoverId} setOpenPopoverId={setOpenPopoverId} />;
}
