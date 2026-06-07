import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Store, PaintBucket } from 'lucide-react';

// IMPORTAMOS NUESTRO SISTEMA DE PLANTILLAS
import TemplatePixel from '../templates/TemplatePixel';
import TemplateDefault from '../templates/TemplateDefault';

export default function StoreCatalog() {
  const { storeSlug } = useParams(); 
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados que comparten todas las plantillas
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');
  const [openPopoverId, setOpenPopoverId] = useState(null);

  // BOTÓN MÁGICO TEMPORAL: Para que pruebes las plantillas en vivo
  const [mockTemplate, setMockTemplate] = useState('default');

  useEffect(() => {
    async function fetchStoreAndProducts() {
      try {
        let { data, error } = await supabase
          .from('stores')
          .select('*, products(*)')
          .eq('slug', storeSlug)
          .single();

        if (error) throw error;
        setStore(data);
        
        // ¡Magia aquí! Leemos el tema directamente de la base de datos
        if (data.template_id) {
          setMockTemplate(data.template_id);
        }
      } catch (err) { 
        console.error("Error al cargar la tienda:", err.message); 
      } finally { 
        setIsLoading(false); 
      }
    }
    if (storeSlug) fetchStoreAndProducts();
  }, [storeSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center text-slate-500">
        <Store className="animate-bounce mb-4 text-pink-400" size={32} />
        <p>Cargando datos del servidor...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
      </div>
    );
  }

  let processedProducts = [...(store.products || [])];
  
  if (searchTerm) {
    processedProducts = processedProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  switch (activeFilter) {
    case 'destacados':
      processedProducts = processedProducts.filter(p => p.is_trending === true);
      break;
    case 'ofertas':
      processedProducts = processedProducts.filter(p => p.badge && p.badge.toLowerCase().includes('oferta'));
      break;
    case 'precio-menor':
      processedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'precio-mayor':
      processedProducts.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }

  // Empaquetamos todos los datos y funciones para mandarlos a la plantilla
  const templateProps = {
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
  };

  // ESTE ES EL ORQUESTADOR EN ACCIÓN
  const renderTemplate = () => {
    switch (mockTemplate) {
      case 'pixel':
        return <TemplatePixel {...templateProps} />;
      case 'default':
      default:
        return <TemplateDefault {...templateProps} />;
    }
  };

  return (
    <>
      {/* RENDERIZAMOS LA PLANTILLA ELEGIDA */}
      {renderTemplate()}

      {/* PANEL FLOTANTE DE DEBUG (Solo para ti como desarrollador) */}
      <div className="fixed bottom-6 left-6 z-[100] bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
        <div className="bg-slate-800 text-slate-300 p-2 rounded-xl">
          <PaintBucket size={16} />
        </div>
        <button 
          onClick={() => setMockTemplate('default')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mockTemplate === 'default' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          Moderna
        </button>
        <button 
          onClick={() => setMockTemplate('pixel')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mockTemplate === 'pixel' ? 'bg-pink-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
          8-Bit
        </button>
      </div>
    </>
  );
}