import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star, Store, Loader2, Heart, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useVariantManager } from '../hooks/useVariantManager';

export default function ProductDetail() {
  const { productSlug } = useParams();
  const { addToCart, toggleCart, getCartCount } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const cartCount = getCartCount();

  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ¡MAGIA! Toda la lógica compleja de variantes importada en una sola línea
  const { 
    selections, 
    handleSelectionChange, 
    comboKey, 
    quantity, 
    increment, 
    decrement, 
    currentStock, 
    isOutOfStock 
  } = useVariantManager(product);

  useEffect(() => {
    async function fetchProductData() {
      try {
        const { data: prodData } = await supabase.from('products').select('*').eq('slug', productSlug).single();
        setProduct(prodData);
        if (prodData) {
          const { data: storeData } = await supabase.from('stores').select('*').eq('id', prodData.store_id).single();
          setStore(storeData);
        }
      } catch (err) { 
        console.error("Error:", err.message); 
      } finally { 
        setIsLoading(false); 
      }
    }
    fetchProductData();
  }, [productSlug]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selections, comboKey);
    toggleCart(); // Abre el carrito para confirmar que se agregó exitosamente
  };

  if (isLoading) return <div className="min-h-screen bg-[#faf9f8] flex justify-center items-center"><Loader2 className="animate-spin text-pink-500" size={32} /></div>;
  if (!product) return <div className="min-h-screen bg-[#faf9f8] flex justify-center items-center"><h2 className="text-2xl font-bold">Producto no encontrado</h2></div>;

  const isFav = isFavorite(product.id);

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200 pb-24">
      <header className="bg-[#faf9f8]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500">
              <Store size={22} strokeWidth={2.5} />
            </div>
            <div className="text-xl font-bold text-slate-800">Komorebi</div>
          </Link>
          <div className="flex items-center space-x-3">
            <Link to="/favoritos" className="p-2.5 bg-white rounded-full shadow-sm relative text-slate-600">
              <Heart size={20} />
              {favorites.length > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{favorites.length}</span>}
            </Link>
            <button onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm relative text-slate-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <Link to={store ? `/tienda/${store.slug}` : "/"} className="text-pink-500 font-semibold flex items-center text-sm mb-8 hover:underline w-max">
          <ArrowLeft size={16} className="mr-1" /> Volver a la tienda
        </Link>

        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* IMAGEN DEL PRODUCTO */}
          <div className={`${product.image_url ? 'bg-slate-100' : 'bg-slate-50 border-2 border-dashed border-slate-200'} rounded-[2rem] aspect-square flex items-center justify-center relative overflow-hidden group`}>
            {product.badge && <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">{product.badge}</span>}
            <button onClick={() => toggleFavorite(product)} className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full z-10 shadow-sm hover:scale-110 transition-transform">
              <Heart size={20} className={isFav ? "fill-pink-500 text-pink-500" : "text-slate-400"} />
            </button>
            
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center w-full h-full">
                <span className="text-sm font-bold text-slate-400 mb-2 leading-tight">Ups aqui deberia haber una foto hermosa...</span>
                <span className="text-xs text-slate-400/80 font-medium">alguien sera despedido hoy</span>
              </div>
            )}
          </div>

          {/* DETALLES DEL PRODUCTO */}
          <div className="flex flex-col justify-center">
            {store && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs overflow-hidden shadow-sm font-bold text-slate-400">
                  {store.avatar_url ? <img src={store.avatar_url} alt={store.name} className="w-full h-full object-cover" /> : store.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-slate-500">{store.name}</span>
              </div>
            )}
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-black text-pink-500">${product.price}</span>
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-sm font-bold text-yellow-700">5.0</span>
              </div>
            </div>

            <div className="mb-6 flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-500">Disponibilidad:</span>
              {!isOutOfStock ? (
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{currentStock} en stock</span>
              ) : (
                <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">Agotado</span>
              )}
            </div>
            
            <p className="text-slate-500 leading-relaxed mb-8">{product.description}</p>

            {/* VARIANTES */}
            {product.options && Object.keys(product.options).length > 0 && (
              <div className="mb-8 space-y-6">
                {Object.entries(product.options).map(([optionName, optionValues]) => (
                  <div key={optionName}>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">{optionName}</h3>
                    <div className="flex flex-wrap gap-4">
                      {optionValues.map((val) => (
                        <button 
                          key={val}
                          onClick={() => handleSelectionChange(optionName, val)} 
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${selections[optionName] === val ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 bg-white text-slate-600 hover:border-pink-200'}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONTROLES DE CARRITO */}
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-sm font-bold text-slate-700">Cantidad a preparar:</span>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={decrement} disabled={quantity <= 1 || isOutOfStock} className="p-3 text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"><Minus size={16} /></button>
                <span className="w-12 text-center font-bold text-slate-800">{quantity}</span>
                <button onClick={increment} disabled={quantity >= currentStock || isOutOfStock} className="p-3 text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"><Plus size={16} /></button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart} 
              disabled={isOutOfStock} 
              className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
            >
              <ShoppingBag size={20} />
              {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}