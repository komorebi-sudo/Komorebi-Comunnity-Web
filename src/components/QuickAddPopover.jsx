import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function QuickAddPopover({ product, onClose }) {
  // 1. IMPORTAMOS EL CART PARA PODER LEERLO
  const { cart, addToCart, toggleCart } = useCart();
  
  const [selections, setSelections] = useState({});
  const [quantity, setQuantity] = useState(1);
  const popoverRef = useRef(null);

  // Pre-seleccionar la primera variante
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

  // Ajustar cantidad si el stock cambia
  useEffect(() => {
    if (currentStock === 0) setQuantity(0);
    else if (quantity > currentStock) setQuantity(currentStock);
    else if (quantity === 0 && currentStock > 0) setQuantity(1);
  }, [selections, currentStock]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 0) return;
    
    const cartItemId = currentCombo === 'default' ? product.id : `${product.id}-${currentCombo}`;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        id: cartItemId,
        originalId: product.id, // Súper importante para agrupar luego
        selectedOptions: selections
      });
    }
    
    onClose();
    toggleCart(); 
  };

  // Cerrar la ventanita si hacen clic afuera de ella
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div 
      ref={popoverRef} 
      className="absolute top-[calc(100%+0.5rem)] right-0 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 cursor-default transform origin-top-right animate-in zoom-in-95 duration-200"
      onClick={e => e.stopPropagation()} 
    >
      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
      
      <div className="relative z-10 flex flex-col space-y-3">
        
        {/* Variantes en formato mini con BURBUJAS */}
        {product.options && Object.entries(product.options).map(([optionName, optionValues]) => (
          <div key={optionName}>
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{optionName}</h5>
            
            {/* Aumentamos el gap-2.5 para que las burbujas respiren */}
            <div className="flex flex-wrap gap-2.5">
              {optionValues.map((val) => {
                
                // 2. MAGIA: Calculamos cuántos de esta variante específica ya están en el carrito
                const countInCart = cart.reduce((total, item) => {
                  const baseId = item.originalId || item.id;
                  if (
                    baseId === product.id && 
                    item.selectedOptions && 
                    item.selectedOptions[optionName] === val
                  ) {
                    return total + (item.quantity || 1);
                  }
                  return total;
                }, 0);

                return (
                  // Posición relativa para anclar la burbuja al botón
                  <div key={val} className="relative inline-block">
                    <button
                      onClick={(e) => { e.preventDefault(); setSelections({ ...selections, [optionName]: val }); }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all ${
                        selections[optionName] === val
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-slate-100 bg-white text-slate-600 hover:border-pink-200'
                      }`}
                    >
                      {val}
                    </button>
                    
                    {/* DIBUJAMOS LA BURBUJA SI YA TIENE EN EL CARRITO */}
                    {countInCart > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-sm border border-white pointer-events-none transform animate-in zoom-in duration-200 z-10">
                        {countInCart}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Control de Cantidad Mini */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
          <span className="text-xs font-bold text-slate-700">Cantidad:</span>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <button onClick={(e) => { e.preventDefault(); quantity > 1 && setQuantity(q => q - 1); }} disabled={quantity <= 1 || currentStock === 0} className="p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"><Minus size={14} /></button>
            <span className="w-6 text-center font-bold text-slate-800 text-xs">{quantity}</span>
            <button onClick={(e) => { e.preventDefault(); quantity < currentStock && setQuantity(q => q + 1); }} disabled={quantity >= currentStock || currentStock === 0} className="p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-50 transition-colors"><Plus size={14} /></button>
          </div>
        </div>

        {/* Botón de Agregar con Precio Integrado */}
        <button 
          onClick={handleAddToCart}
          disabled={currentStock === 0}
          className="w-full mt-2 bg-slate-800 text-white font-bold py-2.5 rounded-xl hover:bg-slate-700 transition-all shadow-md flex items-center justify-between px-4 text-sm disabled:bg-slate-300 transform hover:-translate-y-0.5"
        >
          <span>{currentStock === 0 ? 'Agotado' : `Agregar ${quantity}`}</span>
          <span className="bg-slate-700/50 px-2 py-0.5 rounded-lg">${totalPrice}</span>
        </button>
      </div>
    </div>
  );
}