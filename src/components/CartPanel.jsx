import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPanel() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  // Si el carrito está cerrado, aplicamos una clase para moverlo fuera de la pantalla (translate-x-full)
  const panelClasses = `fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${
    isCartOpen ? 'translate-x-0' : 'translate-x-full'
  }`;

  // El fondo oscuro semitransparente que aparece detrás del panel
  const backdropClasses = `fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
    isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
  }`;

  return (
    <>
      {/* Fondo oscuro al hacer clic cierra el carrito */}
      <div className={backdropClasses} onClick={closeCart} />

      {/* Panel del Carrito */}
      <div className={panelClasses}>
        {/* Cabecera del Carrito */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag size={24} className="text-pink-500" />
            Tu Carrito
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <ShoppingBag size={64} className="text-slate-200" />
              <p className="text-lg font-medium">Tu carrito está vacío</p>
              <button onClick={closeCart} className="text-pink-500 font-semibold hover:underline">
                Seguir comprando
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-slate-50 p-4 rounded-[1.5rem] relative group border border-slate-100">
                {/* Icono/Imagen del producto */}
                <div className={`${item.bgColor || 'bg-white'} w-20 h-20 rounded-xl flex items-center justify-center text-4xl shadow-sm`}>
                  {item.icon || '🛍️'}
                </div>

                {/* Info del producto */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm leading-snug pr-6">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.store || 'Komorebi'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-slate-800">${item.price}</span>
                    
                    {/* Controles de cantidad */}
                    <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Botón eliminar */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-white p-1.5 rounded-full shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Resumen Final */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-slate-800">${getCartTotal()}</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 text-center">
              Los gastos de envío se calcularán en el siguiente paso.
            </p>
            <button className="w-full bg-slate-800 text-white font-bold py-4 rounded-full shadow-md hover:bg-slate-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
}