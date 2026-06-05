import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function QuickAddPopover({ product, onClose }) {
  const { cart, addToCart } = useCart();
  const popoverRef = useRef(null);

  const [selections, setSelections] = useState({});
  const [stagedItems, setStagedItems] = useState({});

  useEffect(() => {
    if (product?.options) {
      const initialSelections = {};
      Object.entries(product.options).forEach(([key, values]) => {
        if (values && values.length > 0) initialSelections[key] = values[0];
      });
      setSelections(initialSelections);
    }
  }, [product]);

  const currentCombo = product?.options && Object.keys(product.options).length > 0
    ? Object.values(selections).join(' | ')
    : 'default';

  let currentStock = product?.stock || 0;
  if (currentCombo !== 'default' && product?.variant_stock) {
    currentStock = parseInt(product.variant_stock[currentCombo]) || 0;
  }

  const currentQty = stagedItems[currentCombo]?.quantity || 0;
  const totalStaged = Object.values(stagedItems).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = (product.price * totalStaged).toFixed(2);

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentQty < currentStock) {
      setStagedItems(prev => ({
        ...prev,
        [currentCombo]: { quantity: currentQty + 1, selections }
      }));
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentQty > 0) {
      setStagedItems(prev => ({
        ...prev,
        [currentCombo]: { quantity: currentQty - 1, selections }
      }));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

    onClose();

    // LA MAGIA ACTUALIZADA: Volar desde la imagen original
    const targetCart = document.getElementById('cart-header-icon');
    const sourceImage = document.getElementById(`product-image-${product.id}`); 
    
    if (targetCart && sourceImage) {
      const targetRect = targetCart.getBoundingClientRect();
      const sourceRect = sourceImage.getBoundingClientRect();
      
      const flyingItem = document.createElement('div');
      
      // RENDEREIZADO CONDICIONAL PARA LA ANIMACIÓN
      if (product.image_url) {
        flyingItem.innerHTML = `<img src="${product.image_url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 1.5rem;" />`;
        flyingItem.className = 'fixed z-[99999] transition-all duration-[800ms] ease-in-out pointer-events-none drop-shadow-2xl';
      } else {
        flyingItem.innerHTML = product.icon || '📦';
        flyingItem.className = 'fixed z-[99999] flex items-center justify-center text-7xl transition-all duration-[800ms] ease-in-out pointer-events-none drop-shadow-2xl';
      }
      
      // Nace EXACTAMENTE en las coordenadas de la foto original
      flyingItem.style.left = `${sourceRect.left}px`;
      flyingItem.style.top = `${sourceRect.top}px`;
      flyingItem.style.width = `${sourceRect.width}px`;
      flyingItem.style.height = `${sourceRect.height}px`;

      document.body.appendChild(flyingItem);

      // Usamos los frames del navegador para activar la animación CSS
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Destino: el botón del carrito arriba a la derecha, encogiéndose
          flyingItem.style.left = `${targetRect.left}px`;
          flyingItem.style.top = `${targetRect.top}px`;
          flyingItem.style.width = `${targetRect.width}px`;
          flyingItem.style.height = `${targetRect.height}px`;
          flyingItem.style.transform = 'scale(0.2)';
          flyingItem.style.opacity = '0.2';
        });
      });

      // Al terminar el vuelo (800ms) desaparece la caja y salta la bolsa
      setTimeout(() => {
        if (document.body.contains(flyingItem)) {
          document.body.removeChild(flyingItem);
        }
        
        targetCart.classList.add('scale-125', 'text-pink-500');
        setTimeout(() => {
          targetCart.classList.remove('scale-125', 'text-pink-500');
        }, 300);
        
      }, 800);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={popoverRef} 
      className="absolute top-[calc(100%+0.5rem)] right-0 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 cursor-default transform origin-top-right animate-in zoom-in-95 duration-200"
      onClick={e => e.stopPropagation()} 
    >
      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
      
      <div className="relative z-10 flex flex-col space-y-3">
        
        {product.options && Object.entries(product.options).map(([optionName, optionValues]) => (
          <div key={optionName}>
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{optionName}</h5>
            
            <div className="flex flex-wrap gap-2.5">
              {optionValues.map((val) => {
                
                const countStaged = Object.entries(stagedItems).reduce((total, [combo, data]) => {
                  if (combo.includes(val)) return total + data.quantity;
                  return total;
                }, 0);

                return (
                  <div key={val} className="relative inline-block">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelections({ ...selections, [optionName]: val }); }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all ${
                        selections[optionName] === val
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-slate-100 bg-white text-slate-600 hover:border-pink-200'
                      }`}
                    >
                      {val}
                    </button>
                    
                    {countStaged > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-sm border border-white pointer-events-none transform animate-in zoom-in duration-200 z-10">
                        {countStaged}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
          <span className="text-xs font-bold text-slate-700">Cantidad:</span>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <button onClick={handleDecrement} disabled={currentQty <= 0} className="p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"><Minus size={14} /></button>
            <span className="w-6 text-center font-bold text-slate-800 text-xs">{currentQty}</span>
            <button onClick={handleIncrement} disabled={currentQty >= currentStock || currentStock === 0} className="p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"><Plus size={14} /></button>
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={totalStaged === 0}
          className="w-full mt-2 bg-slate-800 text-white font-bold py-2.5 rounded-xl hover:bg-slate-700 transition-all shadow-md flex items-center justify-between px-4 text-sm disabled:bg-slate-300 transform hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-1.5">
            <ShoppingBag size={14} />
            {totalStaged === 0 ? 'Selecciona' : `Agregar ${totalStaged}`}
          </span>
          {totalStaged > 0 && (
            <span className="bg-slate-700/50 px-2 py-0.5 rounded-lg">${totalPrice}</span>
          )}
        </button>
      </div>
    </div>
  );
}