import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPanel() {
  const { cart, isCartOpen, toggleCart, removeFromCart, getCartTotal } = useCart();

  if (!isCartOpen) return null;

  // LA MISMA MAGIA VISUAL: Agrupamos los productos por su ID original
  const groupedCart = Object.values(cart.reduce((acc, item) => {
    const baseId = item.originalId || item.id;
    
    if (!acc[baseId]) {
      acc[baseId] = {
        ...item,
        id: baseId,
        totalQuantity: 0,
        variantList: [] 
      };
    }
    
    acc[baseId].totalQuantity += item.quantity;

    if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
      const variantString = Object.values(item.selectedOptions).join(' • ');
      // Guardamos el "cartItemId" real para poder eliminar esta variante específica
      acc[baseId].variantList.push({ name: variantString, qty: item.quantity, cartItemId: item.id });
    } else {
      // Si no tiene variantes, lo guardamos como "default"
      acc[baseId].variantList.push({ name: 'default', qty: item.quantity, cartItemId: item.id });
    }

    return acc;
  }, {}));

  return (
    <>
      {/* Overlay oscuro para tapar el fondo */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" 
        onClick={toggleCart} 
      />
      
      {/* Panel Lateral */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header del Carrito */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <ShoppingBag className="mr-3 text-pink-500" size={22} /> 
            Tu Carrito
          </h2>
          <button 
            onClick={toggleCart} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido (Lista de Productos) */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-slate-300" />
              </div>
              <p className="text-xl font-bold text-slate-800 mb-2">Tu carrito está vacío</p>
              <p className="text-slate-500 text-sm mb-8">¡Añade algunos productos para empezar!</p>
              <button 
                onClick={toggleCart} 
                className="bg-pink-100 text-pink-600 px-6 py-3 rounded-full font-bold hover:bg-pink-200 transition-colors"
              >
                Seguir explorando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedCart.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className={`${item.bg_color || 'bg-slate-50'} w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-sm border border-slate-100/50`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                    <p className="text-pink-500 font-black text-sm mb-3">${item.price}</p>
                    
                    {/* ZONA DE VARIANTES */}
                    <div className="space-y-2">
                      {item.variantList.map((variant, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex-1 min-w-0 pr-2">
                            {variant.name !== 'default' && (
                              <span className="text-[11px] font-bold text-slate-600 block truncate mb-0.5">
                                {variant.name}
                              </span>
                            )}
                            <span className="text-xs font-medium text-slate-500">
                              Cant: <span className="font-bold text-slate-700">{variant.qty}</span>
                            </span>
                          </div>
                          
                          {/* BOTÓN ELIMINAR */}
                          {removeFromCart && (
                            <button 
                              onClick={() => removeFromCart(variant.cartItemId)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer del Carrito */}
        {cart.length > 0 && (
          <div className="border-t border-slate-100 p-6 bg-slate-50/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-bold">Subtotal:</span>
              <span className="text-3xl font-black text-slate-800">${getCartTotal()}</span>
            </div>
            <Link 
              to="/checkout" 
              onClick={toggleCart}
              className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-md hover:bg-slate-700 hover:shadow-lg transition-all flex items-center justify-center transform hover:-translate-y-0.5"
            >
              Proceder al Pago
            </Link>
          </div>
        )}
      </div>
    </>
  );
}