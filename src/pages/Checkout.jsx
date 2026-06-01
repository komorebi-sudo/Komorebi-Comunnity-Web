import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, getCartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center text-slate-700 p-6 text-center">
        <ShoppingBag size={64} className="text-slate-200 mb-4" />
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Tu carrito está vacío</h1>
        <p className="text-slate-500 mb-8">Parece que no tienes nada que pagar aún.</p>
        <Link to="/explorar-tiendas" className="bg-pink-100 text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-pink-200 transition-colors">
          Explorar tiendas
        </Link>
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      alert("¡Simulación de pago exitosa!");
      setIsProcessing(false);
    }, 2000);
  };

  // ----------------------------------------------------------------------
  // LA MAGIA VISUAL: Agrupamos los productos del carrito por su ID original
  // ----------------------------------------------------------------------
  const groupedCart = Object.values(cart.reduce((acc, item) => {
    // Usamos el originalId (el de la base de datos) o el id normal si no tiene variantes
    const baseId = item.originalId || item.id;
    
    if (!acc[baseId]) {
      // Si es la primera vez que vemos este producto, creamos su "caja"
      acc[baseId] = {
        ...item,
        id: baseId,
        totalQuantity: 0,
        variantList: [] // Aquí guardaremos: [{ name: '40x40cm', qty: 2 }]
      };
    }
    
    // Sumamos la cantidad al total general de este producto
    acc[baseId].totalQuantity += item.quantity;

    // Si este ítem específico tiene variantes, lo añadimos a la sub-lista
    if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
      const variantString = Object.values(item.selectedOptions).join(' • ');
      acc[baseId].variantList.push({ name: variantString, qty: item.quantity });
    }

    return acc;
  }, {}));

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200 pb-24">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-slate-500 hover:text-slate-800 flex items-center font-medium text-sm transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Volver al inicio
          </Link>
          <div className="text-xl font-bold tracking-tight text-slate-800">
            Komorebi <span className="text-slate-300 font-normal">| Checkout</span>
          </div>
          <div className="w-24"></div> 
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
              <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Información de Envío
            </h2>
            
            <form onSubmit={handlePayment} className="space-y-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre completo</label>
                  <input type="text" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all" placeholder="Ej. Ana Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono</label>
                  <input type="tel" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all" placeholder="Ej. 0412 1234567" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dirección de entrega</label>
                <input type="text" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all mb-4" placeholder="Calle, Avenida, Edificio..." />
                <div className="grid grid-cols-2 gap-6">
                  <input type="text" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all" placeholder="Ciudad" />
                  <input type="text" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:bg-white transition-all" placeholder="Estado" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                 <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                    Método de Pago
                  </h2>
                  <p className="text-sm text-slate-500 mb-4">Por ahora, solo aceptamos pagos simulados para esta demo.</p>
                  <button type="submit" disabled={isProcessing} className={`w-full text-white font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 hover:shadow-md'}`}>
                    {isProcessing ? (
                       <span className="flex items-center">
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         Procesando...
                       </span>
                    ) : (
                      <>Pagar ${getCartTotal()}</>
                    )}
                  </button>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-28">
              <h3 className="font-bold text-lg text-slate-800 mb-6">Resumen del Pedido</h3>
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                
                {/* AHORA ITERAMOS SOBRE EL CARRITO AGRUPADO (groupedCart) */}
                {groupedCart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className={`${item.bg_color || 'bg-slate-100'} w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{item.name}</h4>
                      
                      {/* Si NO tiene variantes, mostramos la cantidad normal */}
                      {item.variantList.length === 0 ? (
                        <p className="text-xs text-slate-500 mt-0.5">Cant: {item.totalQuantity}</p>
                      ) : (
                        /* Si SÍ tiene variantes, mostramos la lista detallada */
                        <div className="mt-1 space-y-1">
                          {item.variantList.map((variant, index) => (
                            <p key={index} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md inline-block mr-1 mb-1">
                              <span className="font-semibold text-slate-700">{variant.name}:</span> {variant.qty}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-sm text-slate-800 flex-shrink-0">
                      ${item.price * item.totalQuantity}
                    </span>
                  </div>
                ))}
                
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>${getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Envío estimado</span>
                  <span>$5</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-slate-800 pt-2 border-t border-slate-100 mt-2">
                  <span>Total</span>
                  <span className="text-pink-600">${getCartTotal() + 5}</span>
                </div>
              </div>
              <div className="mt-8 bg-emerald-50 rounded-xl p-4 flex items-start">
                <CheckCircle2 className="text-emerald-500 mr-3 mt-0.5 flex-shrink-0" size={18} />
                <p className="text-xs text-emerald-700">Tu pago está protegido. Al hacer clic en "Pagar", aceptas nuestros términos y condiciones.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}