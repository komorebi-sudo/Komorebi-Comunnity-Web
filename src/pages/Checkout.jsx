import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, CreditCard, ShieldCheck, Loader2, ShoppingBag, User, Mail, Phone, MapPin } from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [session, setSession] = useState(null);

  // Formulario del Cliente
  const [customerInfo, setCustomerInfo] = useState({
    name: '', email: '', phone: '', address: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setSession(data.session);
        setCustomerInfo(prev => ({ ...prev, email: data.session.user.email }));
      }
    });
  }, []);

  // ¡CORRECCIÓN MAESTRA! Ya no agrupamos a la fuerza, usamos el carrito real
  const orderItems = cart;
  const totalAmount = getCartTotal();

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert("Por favor, completa todos tus datos de envío antes de pagar.");
      return;
    }

    setIsProcessing(true);

    try {
      const userId = session?.user?.id || null;

      const itemsToSave = orderItems.map(item => {
        const comboKey = item.selectedOptions && Object.keys(item.selectedOptions).length > 0
          ? Object.values(item.selectedOptions).join(' | ')
          : 'default';

        return {
          product_id: item.originalId || item.id,
          name: item.name,
          combo: comboKey,
          quantity: item.quantity, // ¡Aquí lee la cantidad real (ej: 5, 10, etc)!
          price: item.price,
          store_id: item.store_id
        };
      });

      // DEDUCIR INVENTARIO MATEMÁTICO
      for (const item of itemsToSave) {
        const { data: product } = await supabase
          .from('products')
          .select('stock, variant_stock')
          .eq('id', item.product_id)
          .single();

        if (product) {
          let newStock = Number(product.stock) || 0;
          let newVariantStock = { ...product.variant_stock };

          if (item.combo !== 'default' && newVariantStock[item.combo] !== undefined) {
            newVariantStock[item.combo] = Math.max(0, Number(newVariantStock[item.combo]) - item.quantity);
          } else {
            newStock = Math.max(0, newStock - item.quantity);
          }

          await supabase
            .from('products')
            .update({ stock: newStock, variant_stock: newVariantStock })
            .eq('id', item.product_id);
        }
      }

      // CREAR EL RECIBO DE LA ORDEN
      const { error: orderError } = await supabase.from('orders').insert([{
        user_id: userId,
        total: totalAmount,
        items: itemsToSave,
        customer_info: customerInfo,
        status: 'pagado'
      }]);

      if (orderError) throw orderError;

      clearCart();
      alert(`¡Gracias por tu compra, ${customerInfo.name}! Tu pedido está en camino.`);
      
      if (userId) navigate('/perfil');
      else navigate('/');

    } catch (err) {
      console.error("Error procesando pago:", err);
      alert("Ocurrió un error al procesar tu orden.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Tu carrito está vacío</h2>
        <Link to="/" className="mt-8 bg-slate-800 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-700 transition-colors shadow-md">
          Explorar Tiendas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200 pb-12">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100 mb-8">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center font-medium text-sm transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Volver
          </button>
          <div className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" /> Pago Seguro
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* FORMULARIO Y RESUMEN */}
          <div className="flex-1 space-y-8">
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Datos de Envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={18} className="text-slate-400"/></div>
                    <input type="text" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium" placeholder="Ej. Juan Pérez" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-slate-400"/></div>
                    <input type="email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium" placeholder="tu@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-slate-400"/></div>
                    <input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium" placeholder="Ej. 0412 1234567" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Dirección de Entrega</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-4 pointer-events-none"><MapPin size={18} className="text-slate-400"/></div>
                    <textarea value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} rows="3" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium resize-none" placeholder="Ej. Calle Principal..."></textarea>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Tu Pedido</h2>
              <div className="space-y-6">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className={`w-16 h-16 ${item.bg_color || 'bg-slate-50'} rounded-2xl flex items-center justify-center text-3xl border border-slate-100`}>
                      {item.icon || '📦'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 leading-snug">{item.name}</h4>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <p className="text-xs font-medium text-pink-500 mt-0.5 bg-pink-50 inline-block px-2 py-0.5 rounded-md">
                          {Object.values(item.selectedOptions).join(' | ')}
                        </p>
                      )}
                      <p className="text-sm font-bold text-slate-500 mt-1">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="font-black text-lg text-slate-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* PANEL DE PAGO */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-slate-800 rounded-[2rem] p-8 text-white shadow-xl sticky top-28">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-pink-400" /> Total a Pagar
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Subtotal</span>
                  <span>${totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Envío</span>
                  <span className="text-emerald-400 font-bold">¡Gratis!</span>
                </div>
                <div className="border-t border-slate-700 pt-4 flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-4xl font-black text-pink-400">${totalAmount}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 transform hover:-translate-y-0.5"
              >
                {isProcessing ? <><Loader2 className="animate-spin" size={20} /> Procesando...</> : <>Pagar Ahora</>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}