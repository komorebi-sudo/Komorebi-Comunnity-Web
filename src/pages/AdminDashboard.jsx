import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, Settings, Plus, Loader2, Edit, Trash2, Save, LayoutDashboard, UploadCloud, ShoppingBag, Truck, MapPin, Phone, Mail, Clock, CheckCircle, X, FileText, Palette, TrendingUp } from 'lucide-react';

// LIBRERÍA DE GRÁFICAS
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// IMPORTAMOS EL CUSTOM HOOK RECIÉN CREADO
import { useAdmin } from '../hooks/useAdmin';

// --- COMPONENTES AUXILIARES PARA DECORAR LA INTERFAZ ---

const StatCard = ({ title, value, icon: Icon, color, textColor }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">{title}</p>
      <p className="text-4xl font-black text-slate-800">{value}</p>
    </div>
    <div className={`w-14 h-14 ${color} ${textColor} rounded-2xl flex items-center justify-center`}>
      <Icon size={24} strokeWidth={2.5}/>
    </div>
  </div>
);

const AdminSidebar = ({ store, activeTab, navigate, handleLogout, pendingOrdersCount }) => (
  <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10 shadow-sm">
    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white overflow-hidden font-bold shadow-inner">
        {store?.avatar_url ? <img src={store.avatar_url} className="w-full h-full object-cover" /> : store?.name?.charAt(0).toUpperCase() || 'K'}
      </div>
      <span className="font-bold text-slate-800 truncate">{store ? store.name : 'Creador'}</span>
    </div>
    {store && (
      <nav className="flex-1 p-4 space-y-1">
        <button onClick={() => navigate('/admin/resumen')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${activeTab === 'resumen' ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutDashboard size={18} /> Resumen</button>
        <button onClick={() => navigate('/admin/productos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${activeTab === 'productos' ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50'}`}><Package size={18} /> Mis Productos</button>
        <button onClick={() => navigate('/admin/ventas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${activeTab === 'ventas' ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50'}`}>
          <ShoppingBag size={18} /> Mis Ventas 
          {pendingOrdersCount > 0 && <span className="ml-auto bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{pendingOrdersCount}</span>}
        </button>
        <button onClick={() => navigate('/admin/configuracion')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${activeTab === 'configuracion' ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50'}`}><Settings size={18} /> Configuración</button>
      </nav>
    )}
    <div className="p-4 border-t border-slate-100 space-y-1">
      <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"><Home size={18} /> Ir de compras</Link>
      <Link to="/perfil" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"><UserIcon size={18} /> Mi Perfil</Link>
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all mt-2"><LogOut size={18} /> Salir</button>
    </div>
  </aside>
);

// --- VIEW COMPONENT ---

export default function AdminDashboard() {
  // Consumimos todo el cerebro unificado del hook
  const {
    navigate, activeTab, session, store, products, orders, isLoading, isSubmitting,
    newStore, setNewStore, storeSettings, setStoreSettings, editingProductId,
    productImagePreview, setProductImageFile, setProductImagePreview,
    setStoreAvatarFile, setStoreBannerFile,
    newProduct, setNewProduct, optionName, setOptionName, optionValues, setOptionValues,
    fileInputRef, isReceiptModalOpen, handleAddOption, handleRemoveOption, handleLogout,
    handleCreateStore, handleSaveSettings, handleSaveProduct, handleDeleteProduct,
    handleEditClick, handleCancelEdit, handleOpenReceiptModal, handleCloseReceiptModal,
    handleConfirmShipment, pendingOrdersCount, totalRevenue, hasVariants, salesData,
    receiptPreview, receiptInputRef, setReceiptFile, setReceiptPreview, defaultProductState
  } = useAdmin();

  if (isLoading) return <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={32}/></div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 flex">
      <AdminSidebar store={store} activeTab={activeTab} navigate={navigate} handleLogout={handleLogout} pendingOrdersCount={pendingOrdersCount} />

      <main className="ml-64 flex-1 p-8 md:p-12">
        {!store ? (
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 max-w-lg mx-auto shadow-sm border border-slate-100 mt-10 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-pink-100 rounded-[1.5rem] flex items-center justify-center text-pink-500 mb-6 mx-auto shadow-inner"><Store size={36} strokeWidth={2.5} /></div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center tracking-tight">Abre tu Tienda</h2>
            <form onSubmit={handleCreateStore} className="space-y-5 mt-8">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Tienda</label><input type="text" required value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full px-4 py-3.5 rounded-2xl bg-[#faf9f8] border border-slate-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium text-slate-700" placeholder="Ej. El Rincón del Otaku"/></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Categoría principal</label><input type="text" required value={newStore.type} onChange={e => setNewStore({...newStore, type: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-[#faf9f8] border border-slate-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium text-slate-700" placeholder="Ej. Papelería & Arte"/></div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-colors mt-6 flex justify-center gap-2">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Crear mi Tienda'}</button>
            </form>
          </div>
        ) : activeTab === 'resumen' ? (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
              <TrendingUp className="text-pink-500" size={32} /> Resumen de {store.name}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Productos" value={products.length} icon={Package} color="bg-blue-50" textColor="text-blue-500" />
              <StatCard title="Por Enviar" value={pendingOrdersCount} icon={Truck} color="bg-amber-50" textColor="text-amber-500" />
              <StatCard title="Ingresos Totales" value={`$${totalRevenue.toFixed(2)}`} icon={LayoutDashboard} color="bg-emerald-50" textColor="text-emerald-500" />
            </div>

            {/* DASHBOARD VISUAL */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Top 5 Productos más vendidos</h3>
              <div className="h-72 w-full">
                {salesData.length > 0 && salesData.some(d => d.ventas > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="ventas" fill="#f472b6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <ShoppingBag size={48} className="mb-4 text-slate-300" />
                    <p className="font-bold">Aún no hay suficientes ventas</p>
                    <p className="text-sm">Tus métricas aparecerán aquí pronto.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'ventas' ? (
          <div className="animate-in fade-in duration-300 max-w-4xl">
            
            {/* CABECERA CON FILTROS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <ShoppingBag size={28} className="text-pink-500" /> Gestión de Pedidos
              </h1>
              
              <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex items-center">
                <button 
                  onClick={() => { setOrdersFilter('todos'); setOrdersLimit(10); }} 
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${ordersFilter === 'todos' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Todos
                </button>
                <button 
                  onClick={() => { setOrdersFilter('pendiente'); setOrdersLimit(10); }} 
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${ordersFilter === 'pendiente' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Pendientes {ordersFilter === 'pendiente' && totalOrderCount > 0 && `(${totalOrderCount})`}
                </button>
                <button 
                  onClick={() => { setOrdersFilter('enviado'); setOrdersLimit(10); }} 
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${ordersFilter === 'enviado' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Enviados {ordersFilter === 'enviado' && totalOrderCount > 0 && `(${totalOrderCount})`}
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                <Package size={64} className="text-slate-200 mb-4" />
                <h2 className="text-xl font-bold text-slate-800 mb-2">No hay pedidos</h2>
                <p className="text-slate-500">
                  {ordersFilter === 'todos' ? 'Tus pedidos aparecerán aquí cuando los clientes empiecen a comprar.' : `Aún no tienes ningún pedido marcado como ${ordersFilter}.`}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => {
                  const storeItems = order.items.filter(i => i.store_id === store.id);
                  const storeTotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  return (
                    <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                      {order.status === 'enviado' && <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400"></div>}
                      {order.status === 'pendiente' && <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>}
                      
                      <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                        <div>
                          <span className="text-xs font-bold text-slate-400">PEDIDO #{order.id.split('-')[0].toUpperCase()}</span>
                          <h3 className="font-bold text-lg text-slate-800 mt-1">{new Date(order.created_at).toLocaleDateString()} a las {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h3>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${order.status === 'enviado' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                           {order.status === 'enviado' ? <CheckCircle size={16}/> : <Clock size={16}/>}
                           {order.status === 'enviado' ? 'Enviado' : 'Pendiente'}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                           <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><MapPin size={16} className="text-pink-500" /> Logística de Envío</h4>
                           <div className="bg-[#faf9f8] p-5 rounded-2xl space-y-3 text-sm font-medium text-slate-600 border border-slate-100">
                             <p className="flex items-center gap-3 text-slate-800"><UserIcon size={16} className="text-slate-400"/> {order.customer_info?.name}</p>
                             <p className="flex items-center gap-3"><Phone size={16} className="text-slate-400"/> {order.customer_info?.phone}</p>
                             <p className="flex items-center gap-3"><Mail size={16} className="text-slate-400"/> {order.customer_info?.email}</p>
                             <p className="flex items-start gap-3 pt-2 border-t border-slate-200 mt-2"><MapPin size={16} className="text-slate-400 mt-0.5 shrink-0"/> <span className="flex-1 leading-snug">{order.customer_info?.address}</span></p>
                           </div>
                         </div>
                         <div className="space-y-4">
                           <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Package size={16} className="text-pink-500" /> Productos a preparar</h4>
                           <div className="space-y-3">
                             {storeItems.map((item, idx) => {
                               const originalProduct = products.find(p => p.id === item.product_id);
                               return (
                                 <div key={idx} className="flex justify-between items-center bg-[#faf9f8] p-3 rounded-2xl text-sm border border-slate-100">
                                   <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                                       {originalProduct?.image_url ? <img src={originalProduct.image_url} className="w-full h-full object-cover" /> : '📦'}
                                     </div>
                                     <div>
                                       <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                                       {item.combo !== 'default' && <p className="text-[10px] text-white bg-slate-800 px-2 py-0.5 rounded-md mt-0.5 font-bold inline-block">{item.combo}</p>}
                                     </div>
                                   </div>
                                   <div className="text-right">
                                     <p className="font-black text-slate-800">x{item.quantity}</p>
                                     <p className="text-[10px] font-bold text-slate-400">${item.price}</p>
                                   </div>
                                 </div>
                               );
                             })}
                           </div>
                           <div className="flex justify-between items-center pt-2 px-1">
                             <span className="text-sm font-bold text-slate-400">Total de esta orden:</span>
                             <span className="text-lg font-black text-pink-500">${storeTotal.toFixed(2)}</span>
                           </div>
                         </div>
                      </div>
                      <div className="pt-4 border-t border-slate-50 flex justify-end items-center">
                        {order.status === 'enviado' && order.shipping_receipt_url ? (
                          <a href={order.shipping_receipt_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-pink-500 hover:underline flex items-center gap-2 bg-pink-50 px-4 py-2.5 rounded-xl">
                            <FileText size={16} /> Ver guía de envío subida
                          </a>
                        ) : (
                          <button onClick={() => handleOpenReceiptModal(order.id)} className="bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-md hover:-translate-y-0.5">
                            <UploadCloud size={18} /> Subir Guía y Enviar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* BOTÓN DE CARGAR MÁS */}
                {orders.length > 0 && orders.length < totalOrderCount && (
                  <div className="pt-6 flex justify-center pb-8">
                    <button 
                      onClick={() => setOrdersLimit(prev => prev + 10)} 
                      className="bg-white border-2 border-slate-200 text-slate-600 font-bold px-8 py-3.5 rounded-2xl shadow-sm hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50 transition-all flex items-center gap-2"
                    >
                      <Loader2 size={18} className={isLoading ? "animate-spin" : "hidden"} />
                      Cargar más pedidos ({orders.length} de {totalOrderCount})
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        ) : activeTab === 'productos' ? (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800">Tus Productos</h1>
              <button onClick={() => { navigate('/admin/nuevo-producto'); }} className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-md hover:-translate-y-0.5"><Plus size={20} /> Crear Producto</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-[2rem] p-5 flex flex-col group shadow-sm border border-slate-100 relative hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="absolute top-8 right-8 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(p)} className="p-2.5 bg-white text-blue-500 rounded-full shadow-md hover:bg-blue-50 transition-colors" title="Editar"><Edit size={16}/></button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2.5 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors" title="Eliminar"><Trash2 size={16}/></button>
                  </div>
                  
                  {p.image_url ? (
                    <div className="h-40 w-full mb-4 rounded-[1.5rem] overflow-hidden bg-slate-100">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-40 w-full mb-4 rounded-[1.5rem] overflow-hidden bg-slate-50 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 mb-1 leading-tight">Ups aqui deberia haber una foto hermosa...</span>
                      <span className="text-[9px] text-slate-400/80 font-medium">alguien sera despedido hoy</span>
                    </div>
                  )}

                  <h4 className="font-bold text-slate-800 mb-1 line-clamp-1">{p.name}</h4>
                  <div className="flex justify-between items-center mt-auto pt-4">
                    <span className="font-black text-slate-800">${p.price}</span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">{p.stock} u.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'nuevo-producto' ? (
          <div className="max-w-3xl animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800">{editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h1>
              {editingProductId && <button type="button" onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">Cancelar</button>}
            </div>
            <form onSubmit={handleSaveProduct} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">Fotografía del Producto</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-48 rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${productImagePreview ? 'border-transparent bg-slate-100' : 'border-slate-300 bg-slate-50 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-500 text-slate-400'}`}
                >
                  {productImagePreview ? (
                    <img src={productImagePreview} className="w-full h-full object-contain" alt="Preview" />
                  ) : (
                    <>
                      <UploadCloud size={36} className="mb-2" />
                      <span className="font-medium text-sm">Haz clic para subir una imagen JPG o PNG</span>
                    </>
                  )}
                  <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) { setProductImageFile(e.target.files[0]); setProductImagePreview(URL.createObjectURL(e.target.files[0])); } }} />
                </div>
              </div>

              {/* FORMULARIO BLINDADO */}
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del producto</label>
                  <input type="text" required value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Descripción breve</label>
                  <input type="text" value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Precio ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required 
                    value={newProduct.price || ''} 
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{hasVariants ? 'Stock (Automático)' : 'Stock General'}</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={newProduct.stock || 0} 
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})} 
                    disabled={hasVariants} 
                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all font-medium ${hasVariants ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70' : 'bg-slate-50 focus:border-pink-300 focus:bg-white'}`} 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18}/> Opciones y Variantes</h3>
                
                <div className="flex gap-3 mb-6">
                  <input type="text" placeholder="Opción (ej. Talla)" value={optionName} onChange={e => setOptionName(e.target.value)} className="w-1/3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none focus:border-pink-300" />
                  <input type="text" placeholder="Valores (S, M, L)" value={optionValues} onChange={e => setOptionValues(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none focus:border-pink-300" />
                  <button type="button" onClick={handleAddOption} className="bg-slate-800 text-white px-4 rounded-xl font-bold hover:bg-slate-700 text-sm">Agregar</button>
                </div>

                {Object.keys(newProduct.options || {}).length > 0 && (
                  <div className="mb-6 space-y-2">
                    {Object.entries(newProduct.options || {}).map(([optName, optVals]) => (
                      <div key={optName} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="font-bold text-slate-700 text-sm mr-2">{optName}:</span>
                          <span className="text-slate-500 text-sm">{Array.isArray(optVals) ? optVals.join(', ') : ''}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveOption(optName)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {Object.keys(newProduct.variant_stock || {}).length > 0 && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-4">Inventario por Variante</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(newProduct.variant_stock || {}).map(([comboKey, stockVal]) => (
                        <div key={comboKey} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-xs font-bold text-slate-600 w-1/2 line-clamp-1" title={comboKey}>{comboKey}</span>
                          <input type="number" min="0" placeholder="0" value={stockVal || ''} onChange={e => setNewProduct(prev => ({...prev, variant_stock: {...(prev.variant_stock || {}), [comboKey]: e.target.value}}))} className="w-1/2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium outline-none focus:border-pink-300 shadow-sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="bg-pink-500 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-pink-600 transition-all flex items-center gap-2 shadow-md disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {editingProductId ? 'Guardar Cambios' : 'Publicar Producto'}
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === 'configuracion' ? (
          <div className="max-w-2xl animate-in slide-in-from-bottom-8 duration-300">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Identidad de la Tienda</h1>
            <form onSubmit={handleSaveSettings} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
              
              <div className="mb-8 border border-slate-200 rounded-[2rem] overflow-hidden relative">
                 <div className="h-32 bg-slate-100 relative group flex items-center justify-center">
                    {storeSettings.banner_url || storeBannerFile ? (
                      <img src={storeBannerFile ? URL.createObjectURL(storeBannerFile) : storeSettings.banner_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400 w-full h-full border-2 border-dashed border-slate-200 bg-slate-50">
                        <span className="text-sm font-bold leading-tight mb-1">Ups aqui deberia haber una foto hermosa...</span>
                        <span className="text-xs font-medium">alguien sera despedido hoy</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <label className="text-white font-bold text-sm flex items-center gap-2 cursor-pointer"><UploadCloud size={18} /> Cambiar Banner
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files[0] && setStoreBannerFile(e.target.files[0])} />
                      </label>
                    </div>
                 </div>

                 <div className="absolute top-20 left-6 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white overflow-hidden group font-black text-2xl text-slate-300">
                    {storeSettings.avatar_url || storeAvatarFile ? (
                      <img src={storeAvatarFile ? URL.createObjectURL(storeAvatarFile) : storeSettings.avatar_url} className="w-full h-full object-cover" />
                    ) : storeSettings.name?.charAt(0).toUpperCase() || 'S'}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <label className="cursor-pointer text-white"><UploadCloud size={20} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files[0] && setStoreAvatarFile(e.target.files[0])} />
                      </label>
                    </div>
                 </div>
                 
                 <div className="pt-12 pb-4 px-6 bg-white">
                    <h3 className="font-bold text-lg text-slate-800">{storeSettings.name || 'Tu Tienda'}</h3>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Tienda</label><input type="text" required value={storeSettings.name} onChange={e => setStoreSettings({...storeSettings, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300" /></div>
                <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Categoría</label><input type="text" required value={storeSettings.type} onChange={e => setStoreSettings({...storeSettings, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300" /></div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Palette size={18} className="text-pink-500" /> Tema de la Tienda</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setStoreSettings({ ...storeSettings, template_id: 'default' })}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex flex-col items-center gap-2 ${storeSettings.template_id === 'default' ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-pink-300 bg-white'}`}
                  >
                    <div className="w-full h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                      <div className="w-full h-4 bg-slate-100 mb-1"></div>
                      <div className="w-full flex-1 flex gap-1 p-1">
                        <div className="w-1/3 h-full bg-slate-50 rounded-md"></div>
                        <div className="flex-1 h-full bg-slate-50 rounded-md"></div>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${storeSettings.template_id === 'default' ? 'text-pink-600' : 'text-slate-600'}`}>Moderna</span>
                  </div>

                  <div 
                    onClick={() => setStoreSettings({ ...storeSettings, template_id: 'pixel' })}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex flex-col items-center gap-2 ${storeSettings.template_id === 'pixel' ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-pink-300 bg-white'}`}
                  >
                    <div className="w-full h-16 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] flex flex-col overflow-hidden">
                      <div className="w-full h-4 bg-[#87CEEB] border-b-2 border-black"></div>
                      <div className="w-full flex-1 flex p-1">
                        <div className="flex-1 h-full border-2 border-black"></div>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${storeSettings.template_id === 'pixel' ? 'text-pink-600' : 'text-slate-600'}`}>Retro 8-Bit</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2 shadow-md hover:-translate-y-0.5">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {isReceiptModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button onClick={handleCloseReceiptModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors">
                <X size={24} />
              </button>
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Truck size={32} />
              </div>
              
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Confirmar Envío</h2>
              <p className="text-sm text-slate-500 mb-6">Sube una foto de la guía o recibo de la agencia de envíos. El cliente podrá verla desde su perfil y sentirá paz mental.</p>

              <div 
                onClick={() => receiptInputRef.current?.click()}
                className={`w-full h-40 rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden mb-6 ${receiptPreview ? 'border-transparent bg-slate-100' : 'border-slate-300 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 text-slate-400'}`}
              >
                {receiptPreview ? (
                  <img src={receiptPreview} className="w-full h-full object-contain" alt="Preview" />
                ) : (
                  <>
                    <FileText size={32} className="mb-2" />
                    <span className="font-medium text-sm px-4 text-center">Haz clic para subir la foto de la guía</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  ref={receiptInputRef} 
                  accept="image/*" 
                  onChange={(e) => { 
                    if (e.target.files && e.target.files[0]) { 
                      setReceiptFile(e.target.files[0]); 
                      setReceiptPreview(URL.createObjectURL(e.target.files[0])); 
                    } 
                  }} 
                />
              </div>

              <button 
                onClick={handleConfirmShipment}
                disabled={isSubmitting || !receiptFile}
                className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />} 
                Confirmar y Notificar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}