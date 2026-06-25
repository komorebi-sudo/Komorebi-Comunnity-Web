import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, CreditCard, ShieldCheck, Loader2, ShoppingBag, User, Mail, Phone, MapPin, Smartphone, Wallet, Heart, Copy, MessageCircle, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, clearSelectedItems, getSelectedTotal } = useCart();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [session, setSession] = useState(null);
  
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('pago_movil');
  const [paymentReference, setPaymentReference] = useState('');

  // NUEVO: Estado para controlar el Modal de Triunfo
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setSession(data.session);
        setCustomerInfo(prev => ({ ...prev, email: data.session.user.email }));
      }
    });
  }, []);

  const orderItems = cart.filter(item => item.isSelected !== false);
const totalAmount = getSelectedTotal();

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error("Por favor, completa todos tus datos de envío."); 
      return;
    }

    if (paymentMethod === 'pago_movil' && paymentReference.trim().length < 4) {
      toast.error("Ingresa un número de referencia válido para el Pago Móvil."); 
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Procesando tu orden de forma segura...'); 

    try {
      const userId = session?.user?.id || null;
      
      const itemsToSave = orderItems.map(item => {
        const comboKey = item.selectedOptions && Object.keys(item.selectedOptions).length > 0
          ? Object.values(item.selectedOptions).join(' | ') : 'default';
        return { product_id: item.originalId || item.id, name: item.name, combo: comboKey, quantity: item.quantity, store_id: item.store_id };
      });

      const { data: orderId, error: rpcError } = await supabase.rpc('process_checkout', {
        p_user_id: userId, p_customer_info: customerInfo, p_items: itemsToSave, p_payment_method: paymentMethod, p_payment_reference: paymentReference
      });

      if (rpcError) throw new Error(rpcError.message || "Error al procesar el checkout");

      toast.dismiss(loadingToast); // Ocultamos el toast de carga
      
      // ACTIVAMOS EL MODAL DE TRIUNFO
      setSuccessData({
        orderId: orderId,
        customerName: customerInfo.name
      });
      
      clearSelectedItems(); // Solo borra los comprados, deja los desmarcados

    } catch (err) {
      console.error("Error procesando pago:", err);
      toast.error(err.message || "Ocurrió un error al procesar tu orden.", { id: loadingToast }); 
    } finally {
      setIsProcessing(false);
    }
  };

  // TRUCO UX: Evitamos que muestre "Carrito vacío" si el modal de éxito está abierto
  if (orderItems.length === 0 && !successData) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6"><ShoppingBag size={40} /></div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">No has seleccionado productos</h2>
        <p className="text-slate-500 mb-6">Marca al menos un producto en tu carrito para proceder con la compra.</p>
        <button onClick={() => navigate(-1)} className="mt-2 bg-slate-800 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-700 transition-colors shadow-md">
          Volver al carrito
        </button>
      </div>
    );
}

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 font-sans selection:bg-pink-200 pb-12 relative">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100 mb-8">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center font-medium text-sm transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Volver
          </button>
          <div className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" /> Checkout Seguro
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 space-y-8">
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Datos de Envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={18} className="text-slate-400"/></div><input type="text" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium" placeholder="Ej. Juan Pérez" /></div></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-slate-400"/></div><input type="email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium" placeholder="tu@email.com" /></div></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Teléfono</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-slate-400"/></div><input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium" placeholder="Ej. 0412 1234567" /></div></div>
                <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Dirección de Entrega</label><div className="relative"><div className="absolute top-3.5 left-4 pointer-events-none"><MapPin size={18} className="text-slate-400"/></div><textarea value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} rows="3" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium resize-none" placeholder="Ej. Calle Principal..."></textarea></div></div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Método de Pago</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button type="button" onClick={() => setPaymentMethod('pago_movil')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'pago_movil' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 bg-white text-slate-500 hover:border-pink-200'}`}><Smartphone size={28} className="mb-2" /><span className="font-bold text-sm">Pago Móvil</span></button>
                <button type="button" onClick={() => setPaymentMethod('zinli')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'zinli' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-slate-100 bg-white text-slate-500 hover:border-purple-200'}`}><Wallet size={28} className="mb-2" /><span className="font-bold text-sm">Zinli</span></button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                {paymentMethod === 'pago_movil' && (
                  <div className="animate-in fade-in duration-300">
                    <p className="text-sm font-bold text-slate-700 mb-3">Transfiere el monto exacto a:</p>
                    <div className="space-y-2 mb-5 text-sm font-medium text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
                      <p>Banco: <strong className="text-slate-800">BNC (Banco Nacional de Crédito - 0104)</strong></p>
                      <p>Teléfono: <strong className="text-slate-800">0414-XXXXXXX</strong></p>
                      <p>RIF: <strong className="text-slate-800">J-XXXXXXXX-X</strong></p>
                    </div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Número de Referencia</label>
                    <input type="text" required value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Últimos 6 dígitos" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-pink-300 outline-none transition-all font-medium text-slate-700" />
                  </div>
                )}
                {paymentMethod === 'zinli' && (
                  <div className="animate-in fade-in duration-300">
                    <p className="text-sm font-bold text-slate-700 mb-3">Envía el pago a nuestro correo Zinli:</p>
                    <div className="text-center bg-white p-4 rounded-xl border border-slate-200 mb-5"><strong className="text-purple-600 text-lg">pagos@kuramachi.com</strong></div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Correo Zinli emisor</label>
                    <input type="email" required value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="tucorreo@zinli.com" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-purple-300 outline-none transition-all font-medium text-slate-700" />
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-slate-800 rounded-[2rem] p-8 text-white shadow-xl sticky top-28">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard className="text-pink-400" /> Resumen</h3>
              <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-slate-300">
                    <span className="truncate pr-4">{item.quantity}x {item.name}</span>
                    <span className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 mb-8 border-t border-slate-700 pt-6">
                <div className="flex justify-between text-slate-300 font-medium"><span>Subtotal</span><span>${totalAmount}</span></div>
                <div className="flex justify-between text-slate-300 font-medium"><span>Envío</span><span className="text-emerald-400 font-bold">¡Gratis!</span></div>
                <div className="border-t border-slate-700 pt-4 flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">Total a Pagar</span>
                  <span className="text-4xl font-black text-pink-400">${totalAmount}</span>
                </div>
              </div>
              <button onClick={handlePayment} disabled={isProcessing} className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 transform hover:-translate-y-0.5">
                {isProcessing ? <><Loader2 className="animate-spin" size={20} /> Verificando...</> : <>Procesar Orden</>}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================= */}
      {/* EL NUEVO MODAL DE TRIUNFO (PÁGINA DE GRACIAS) */}
      {/* ========================================= */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            
            {/* Icono de Corazón Animado */}
            <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner border border-pink-200">
              <Heart size={40} fill="currentColor" className="animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">¡Muchísimas gracias!</h2>
            <p className="text-slate-500 font-medium mb-6">
              Apreciamos enormemente tu compra, {successData.customerName.split(' ')[0]}. Tu pedido ha sido procesado y los vendedores ya están preparando todo con cariño.
            </p>

            {/* Tarjeta de Número de Guía */}
            <div className="w-full bg-[#faf9f8] border border-slate-100 rounded-2xl p-5 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-pink-400"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tu Número de Guía</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-black text-slate-800 tracking-widest">{successData.orderId.split('-')[0].toUpperCase()}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(successData.orderId.split('-')[0].toUpperCase());
                    toast.success('¡Número de guía copiado!');
                  }} 
                  className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                  title="Copiar guía completa"
                >
                   <Copy size={20} />
                </button>
              </div>
            </div>

            {/* Contacto de la Tienda */}
            <div className="w-full text-left bg-white rounded-2xl p-5 mb-8 border border-slate-100 shadow-sm">
              <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Store size={16} className="text-pink-400"/> Contacto de Tienda</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">¿Tienes dudas o quieres ajustar algo? Escríbele a la tienda por WhatsApp o Instagram indicando tu número de guía:</p>
              <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                 {/* NOTA PARA TI: Aquí usamos datos de ejemplo. Cuando agregues columnas de redes sociales a tu tabla de tiendas, puedes ponerlas dinámicamente aquí */}
                 <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700">@kuramachi_store</span>
                    <a href="#" className="text-pink-500 font-bold hover:underline flex items-center gap-1"><MessageCircle size={14}/> +58 414-0000000</a>
                 </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="w-full flex flex-col gap-3">
              {session ? (
                <>
                  <button onClick={() => navigate('/perfil')} className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-700 transition-colors shadow-md">
                    Ver estado de mi pedido
                  </button>
                  <button onClick={() => navigate('/')} className="w-full bg-pink-50 text-pink-600 font-bold py-3.5 rounded-xl hover:bg-pink-100 transition-colors">
                    Seguir comprando
                  </button>
                </>
              ) : (
                <button onClick={() => navigate('/')} className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-700 transition-colors shadow-md">
                  Volver al Inicio
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}