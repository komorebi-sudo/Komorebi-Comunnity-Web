import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star, Store, Loader2, Heart, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function ProductDetail() {
  const { productSlug } = useParams();
  const { cart, addToCart, toggleCart, getCartCount } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const cartCount = getCartCount();

  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selections, setSelections] = useState({});
  const [stagedItems, setStagedItems] = useState({});

  useEffect(() => {
    async function fetchProductData() {
      try {
        const { data: prodData, error: prodError } = await supabase
          .from('products').select('*').eq('slug', productSlug).single();
        if (prodError) throw prodError;
        setProduct(prodData);

        if (prodData.options) {
          const initialSelections = {};
          Object.entries(prodData.options).forEach(([key, values]) => {
            if (values && values.length > 0) initialSelections[key] = values[0];
          });
          setSelections(initialSelections);
          // ELIMINADO: Ya no auto-preparamos la unidad inicial
        }

        const { data: storeData } = await supabase
          .from('stores').select('*').eq('id', prodData.store_id).single();
        setStore(storeData);
      } catch (err) {
        console.error("Error al cargar producto:", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductData();
  }, [productSlug]);

  const currentCombo = product?.options && Object.keys(product.options).length > 0
    ? Object.values(selections).join(' | ')
    : 'default';

  let currentStock = product?.stock || 0;
  if (currentCombo !== 'default' && product?.variant_stock) {
    currentStock = parseInt(product.variant_stock[currentCombo]) || 0;
  }

  const currentQty = stagedItems[currentCombo]?.quantity || 0;
  const totalStaged = Object.values(stagedItems).reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectVariant = (optionName, val) => {
    const newSelections = { ...selections, [optionName]: val };
    setSelections(newSelections);
    // ELIMINADO: Ya no auto-preparamos la unidad al cambiar de pestaña
  };

  const handleIncrement = () => {
    if (currentQty < currentStock) {
      setStagedItems(prev => ({
        ...prev,
        [currentCombo]: { quantity: currentQty + 1, selections }
      }));
    }
  };

  const handleDecrement = () => {
    if (currentQty > 0) {
      setStagedItems(prev => ({
        ...prev,
        [currentCombo]: { quantity: currentQty - 1, selections }
      }));
    }
  };

  const handleAddToCart = () => {
    if (totalStaged === 0) return;

    Object.entries(stagedItems).forEach(([comboKey, data]) => {
      if (data.quantity > 0) {
        const cartItemId = comboKey === 'default' ? product.id : `${product.id}-${comboKey}`;

        for (let i = 0; i < data.quantity; i++) {
          addToCart({
            ...product,
            id: cartItemId,
            originalId: product.id,
            selectedOptions: data.selections
          });
        }
      }
    });

    setStagedItems({}); // Limpiamos y lo dejamos en 0 absoluto para la próxima vez
    toggleCart();
  };

  if (isLoading) return <div className="min-h-screen bg-[#faf9f8] flex justify-center items-center"><Loader2 className="animate-spin text-pink-500" size={32} /></div>;
  if (!product) return <div className="min-h-screen bg-[#faf9f8] flex flex-col justify-center items-center"><h2 className="text-2xl font-bold text-slate-800">Producto no encontrado</h2></div>;

  const isFav = isFavorite(product.id);

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200 pb-24">
      {/* HEADER */}
      <header className="bg-[#faf9f8]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-pink-100 rounded-[1rem] flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform"><Store size={22} strokeWidth={2.5} /></div>
            <div className="text-xl font-bold tracking-tight text-slate-800">Komorebi</div>
          </Link>
          <div className="flex items-center space-x-3">
            <Link to="/favoritos" className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <Heart size={20} />
              {favorites.length > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{favorites.length}</span>}
            </Link>
            <button onClick={toggleCart} className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative text-slate-600">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <Link to={store ? `/tienda/${store.slug}` : "/explorar-tiendas"} className="text-pink-500 font-semibold flex items-center text-sm mb-8 hover:underline w-max">
          <ArrowLeft size={16} className="mr-1" /> Volver a la tienda
        </Link>

        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className={`${product.bg_color || 'bg-slate-50'} rounded-[2rem] aspect-square flex items-center justify-center relative overflow-hidden group`}>
            {product.badge && <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">{product.badge}</span>}
            <button onClick={() => toggleFavorite(product)} className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full z-10 shadow-sm hover:scale-110 transition-transform">
              <Heart size={20} className={isFav ? "fill-pink-500 text-pink-500" : "text-slate-400"} />
            </button>
            <div className="text-9xl transform group-hover:scale-110 transition-transform duration-500">{product.icon || '📦'}</div>
          </div>

          <div className="flex flex-col justify-center">
            {store && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs">{store.avatar_icon}</div>
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
              {currentStock > 0 ? (
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">{currentStock} en stock de esta opción</span>
              ) : (
                <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-100">Agotado</span>
              )}
            </div>
            
            <p className="text-slate-500 leading-relaxed mb-8">{product.description}</p>

            {/* VARIANTES Y BURBUJAS */}
            {product.options && Object.keys(product.options).length > 0 && (
              <div className="mb-8 space-y-6">
                {Object.entries(product.options).map(([optionName, optionValues]) => (
                  <div key={optionName}>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">{optionName}</h3>
                    <div className="flex flex-wrap gap-4">
                      {optionValues.map((val) => {
                        const countStaged = Object.entries(stagedItems).reduce((total, [combo, data]) => {
                          if (combo.includes(val)) return total + data.quantity;
                          return total;
                        }, 0);

                        return (
                          <div key={val} className="relative inline-block">
                            <button
                              onClick={() => handleSelectVariant(optionName, val)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                                selections[optionName] === val
                                  ? 'border-pink-500 bg-pink-50 text-pink-600'
                                  : 'border-slate-100 bg-white text-slate-600 hover:border-pink-200 hover:bg-pink-50/50'
                              }`}
                            >
                              {val}
                            </button>
                            
                            {countStaged > 0 && (
                              <span className="absolute -top-2.5 -right-2.5 bg-pink-500 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center shadow-md border-2 border-white pointer-events-none transform animate-in zoom-in duration-200 z-10">
                                {countStaged}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SELECTOR DE CANTIDAD DINÁMICO */}
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-sm font-bold text-slate-700">Cantidad a preparar:</span>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={handleDecrement} disabled={currentQty <= 0} className="p-3 text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"><Minus size={16} /></button>
                <span className="w-12 text-center font-bold text-slate-800">{currentQty}</span>
                <button onClick={handleIncrement} disabled={currentQty >= currentStock || currentStock === 0} className="p-3 text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"><Plus size={16} /></button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={totalStaged === 0}
              className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              <ShoppingBag size={20} />
              {totalStaged === 0 
                ? 'Selecciona una cantidad' 
                : `Agregar ${totalStaged} artículo${totalStaged > 1 ? 's' : ''} al carrito`
              }
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}