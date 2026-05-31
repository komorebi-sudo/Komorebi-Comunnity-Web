import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Store, Star, ShieldCheck, Heart, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';

export default function ProductDetail() {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart, getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        // Pedimos el producto y también los datos de la tienda a la que pertenece
        let { data, error } = await supabase
          .from('products')
          .select('*, stores(*)')
          .eq('slug', productSlug)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Error al cargar producto:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (productSlug) fetchProductDetails();
  }, [productSlug]);

  const handleAddToCart = () => {
    // Agregamos el producto la cantidad de veces seleccionada
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, store: product.stores?.name });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center text-slate-500">
        <div className="animate-bounce mb-4 text-pink-400 text-4xl">📦</div>
        <p>Buscando en el almacén...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center text-slate-700">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <button onClick={() => navigate(-1)} className="bg-pink-100 text-pink-600 px-6 py-2.5 rounded-full font-bold">Regresar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200 pb-24">
      {/* CABECERA */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform"><Store size={22} strokeWidth={2.5} /></div>
            <div className="text-xl font-bold tracking-tight text-slate-800">Komorebi</div>
          </Link>
          <button onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {/* BREADCRUMBS (Navegación) */}
        <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium">
          <Link to="/" className="hover:text-pink-500 transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          {product.stores && (
            <>
              <Link to={`/tienda/${product.stores.slug}`} className="hover:text-pink-500 transition-colors">{product.stores.name}</Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-slate-800 truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-12">
          
          {/* COLUMNA IZQUIERDA: IMAGEN DEL PRODUCTO */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <div className={`w-full aspect-square ${product.bg_color || 'bg-slate-50'} rounded-[2rem] flex items-center justify-center text-9xl relative group`}>
              {product.badge && (
                <span className="absolute top-6 left-6 bg-white text-slate-800 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm tracking-wider">
                  {product.badge}
                </span>
              )}
              <button className="absolute top-6 right-6 p-3 rounded-full bg-white/50 backdrop-blur-sm text-slate-400 hover:text-pink-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100">
                <Heart size={22} />
              </button>
              <div className="transition-transform duration-500 group-hover:scale-110">
                {product.icon || '📦'}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO DEL PRODUCTO */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            {product.stores && (
              <Link to={`/tienda/${product.stores.slug}`} className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors mb-3">
                <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs">{product.stores.avatar_icon}</span>
                <span>{product.stores.name}</span>
              </Link>
            )}
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-slate-100">
              <span className="text-4xl font-black text-slate-800">${product.price}</span>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Descripción</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>

            {/* CONTROLES DE COMPRA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex items-center justify-between bg-slate-50 rounded-full p-1.5 border border-slate-100 w-full sm:w-32">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-white hover:shadow-sm transition-all"><Minus size={18} /></button>
                <span className="w-8 text-center font-bold text-slate-800">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-white hover:shadow-sm transition-all"><Plus size={18} /></button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-pink-500 text-white font-bold py-4 px-8 rounded-full shadow-md hover:bg-pink-600 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Agregar al carrito
              </button>
            </div>

            <div className="mt-6 flex items-center text-xs text-slate-400 font-medium bg-slate-50 px-4 py-3 rounded-2xl w-fit">
              <ShieldCheck size={16} className="mr-2 text-emerald-500" />
              Compra segura. Soporte directo con el vendedor.
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}