import React from 'react';
import { ShoppingBag, X, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useVariantManager } from '../hooks/useVariantManager';

export default function QuickAddPopover({ product, onClose }) {
  const { addToCart } = useCart();
  
  // ¡MAGIA! Toda la lógica compleja ahora se resume en esta sola línea:
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

  const handleConfirmAdd = () => {
    addToCart(product, quantity, selections, comboKey);
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-200 cursor-default">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
        <X size={16} />
      </button>

      <div className="mb-5 pr-8">
        <h4 className="font-extrabold text-lg text-slate-800 leading-tight mb-1">{product.name}</h4>
        <div className="flex items-center gap-2">
          <span className="font-black text-pink-500">${product.price}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isOutOfStock ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
            {isOutOfStock ? 'Agotado' : `${currentStock} disp.`}
          </span>
        </div>
      </div>

      {product.options && Object.keys(product.options).length > 0 && (
        <div className="space-y-4 mb-6">
          {Object.entries(product.options).map(([optName, optValues]) => (
            <div key={optName}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{optName}</p>
              <div className="flex flex-wrap gap-2">
                {optValues.map(val => (
                  <button
                    key={val}
                    onClick={() => handleSelectionChange(optName, val)}
                    className={`px-3 py-1.5 text-sm font-bold rounded-xl border-2 transition-all ${selections[optName] === val ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 bg-white text-slate-600 hover:border-pink-200'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
        <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-1">
          <button onClick={decrement} disabled={isOutOfStock} className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-50">-</button>
          <span className="w-8 text-center font-black text-sm">{quantity}</span>
          <button onClick={increment} disabled={isOutOfStock || quantity >= currentStock} className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-50">+</button>
        </div>

        <button 
          onClick={handleConfirmAdd}
          disabled={isOutOfStock}
          className="bg-slate-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Agotado' : <><CheckCircle size={18} /> Agregar</>}
        </button>
      </div>
    </div>
  );
}