import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Store, Package, Settings, Plus, LogOut, Loader2, Home, User as UserIcon, Edit, Trash2, Save, LayoutDashboard, Search } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumen');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para la Creación/Edición de Tienda
  const [newStore, setNewStore] = useState({ name: '', type: '', slug: '' });
  const [storeSettings, setStoreSettings] = useState({ name: '', type: '', cover_color: '', avatar_icon: '', slug: '' });

  // Estados para Productos y Variantes
  const [editingProductId, setEditingProductId] = useState(null);
  const defaultProductState = {
    name: '', description: '', price: '', stock: '', category: '',
    icon: '📦', bg_color: 'bg-slate-50', badge: '',
    options: {}, variant_stock: {}
  };
  const [newProduct, setNewProduct] = useState(defaultProductState);
  const [optionName, setOptionName] = useState('');
  const [optionValues, setOptionValues] = useState('');

  // 1. CARGA INICIAL DE DATOS
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) { navigate('/login'); return; }
        setSession(session);

        const { data: storeData } = await supabase.from('stores').select('*').eq('user_id', session.user.id).single();
        if (storeData) {
          setStore(storeData);
          setStoreSettings(storeData); // Cargamos datos en configuración
          const { data: productsData } = await supabase.from('products').select('*').eq('store_id', storeData.id).order('created_at', { ascending: false });
          setProducts(productsData || []);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  // 2. LÓGICA DE VARIANTES (Matemática de combinaciones)
  const handleAddOption = (e) => {
    e.preventDefault();
    if (!optionName || !optionValues) return;
    const valuesArray = optionValues.split(',').map(v => v.trim()).filter(v => v);
    setNewProduct(prev => ({ ...prev, options: { ...prev.options, [optionName]: valuesArray } }));
    setOptionName('');
    setOptionValues('');
  };

  const handleRemoveOption = (name) => {
    const newOptions = { ...newProduct.options };
    delete newOptions[name];
    setNewProduct(prev => ({ ...prev, options: newOptions }));
  };

  useEffect(() => {
    if (!newProduct.options || Object.keys(newProduct.options).length === 0) return;
    const keys = Object.keys(newProduct.options);
    const combinations = keys.reduce((acc, key) => {
      const values = newProduct.options[key];
      if (acc.length === 0) return values.map(v => ({ [key]: v }));
      const newAcc = [];
      acc.forEach(combo => { values.forEach(v => { newAcc.push({ ...combo, [key]: v }); }); });
      return newAcc;
    }, []);

    const newVariantStock = {};
    combinations.forEach(combo => {
      const comboKey = Object.values(combo).join(' | ');
      newVariantStock[comboKey] = newProduct.variant_stock?.[comboKey] || '';
    });
    setNewProduct(prev => ({ ...prev, variant_stock: newVariantStock }));
  }, [newProduct.options]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. ACCIONES DE BASE DE DATOS
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('stores').insert([{
        user_id: session.user.id, name: newStore.name, type: newStore.type,
        slug: newStore.slug, avatar_icon: '🏪', cover_color: 'bg-pink-100'
      }]).select();
      if (error) throw error;
      setStore(data[0]);
      setStoreSettings(data[0]);
    } catch (err) { alert("Error al crear la tienda"); } finally { setIsSubmitting(false); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('stores').update({
        name: storeSettings.name, type: storeSettings.type,
        cover_color: storeSettings.cover_color, avatar_icon: storeSettings.avatar_icon
      }).eq('id', store.id);
      if (error) throw error;
      setStore({ ...store, ...storeSettings });
      alert("¡Configuración actualizada con éxito!");
    } catch (err) { alert("Error al guardar configuración"); } finally { setIsSubmitting(false); }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const productData = {
        store_id: store.id, name: newProduct.name, slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newProduct.description, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) || 0,
        category: newProduct.category, icon: newProduct.icon, bg_color: newProduct.bg_color,
        badge: newProduct.badge, options: newProduct.options, variant_stock: newProduct.variant_stock
      };

      if (editingProductId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProductId);
        if (error) throw error;
        setProducts(products.map(p => p.id === editingProductId ? { ...p, ...productData } : p));
      } else {
        const { data, error } = await supabase.from('products').insert([productData]).select();
        if (error) throw error;
        setProducts([data[0], ...products]);
      }

      setNewProduct(defaultProductState);
      setEditingProductId(null);
      setActiveTab('productos');
    } catch (err) { alert("Error al guardar producto"); } finally { setIsSubmitting(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto permanentemente?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { alert("Error al eliminar"); }
  };

  const handleEditClick = (product) => {
    setNewProduct(product);
    setEditingProductId(product.id);
    setActiveTab('nuevo-producto');
  };

  const handleCancelEdit = () => {
    setNewProduct(defaultProductState);
    setEditingProductId(null);
    setActiveTab('productos');
  };

  // 4. RENDERIZADO
  if (isLoading) return <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={32}/></div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white"><Store size={16} /></div>
          <span className="font-bold text-slate-800 truncate">{store ? store.name : 'Creador'}</span>
        </div>
        
        {store && (
          <nav className="flex-1 p-4 space-y-1">
            <button onClick={() => { setActiveTab('resumen'); setEditingProductId(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${activeTab === 'resumen' ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><LayoutDashboard size={18} /> Resumen</button>
            <button onClick={() => { setActiveTab('productos'); setEditingProductId(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${activeTab === 'productos' ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Package size={18} /> Mis Productos</button>
            <button onClick={() => { setActiveTab('configuracion'); setEditingProductId(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${activeTab === 'configuracion' ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Settings size={18} /> Configuración</button>
          </nav>
        )}

        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"><Home size={18} /> Ir de compras</Link>
          <Link to="/perfil" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"><UserIcon size={18} /> Mi Perfil</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all mt-2"><LogOut size={18} /> Salir</button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="ml-64 flex-1 p-8 md:p-12">
        {!store ? (
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 max-w-lg mx-auto shadow-sm border border-slate-100 mt-10 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-pink-100 rounded-[1.5rem] flex items-center justify-center text-pink-500 mb-6 mx-auto shadow-inner"><Store size={36} strokeWidth={2.5} /></div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-center tracking-tight">Abre tu Tienda</h2>
            <p className="text-slate-500 text-center mb-8 font-medium">Estás a un paso de empezar a vender tus productos en Komorebi.</p>
            <form onSubmit={handleCreateStore} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Tienda</label>
                <input type="text" required value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full px-4 py-3.5 rounded-2xl bg-[#faf9f8] border border-slate-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium text-slate-700" placeholder="Ej. El Rincón del Otaku"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Categoría principal</label>
                <input type="text" required value={newStore.type} onChange={e => setNewStore({...newStore, type: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-[#faf9f8] border border-slate-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium text-slate-700" placeholder="Ej. Papelería & Arte"/>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-colors shadow-md mt-6 disabled:bg-slate-300 flex justify-center items-center gap-2 transform hover:-translate-y-0.5">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Crear mi Tienda'}
              </button>
            </form>
          </div>
        ) : activeTab === 'resumen' ? (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Resumen de {store.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
                <div><p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Productos</p><p className="text-4xl font-black text-slate-800">{products.length}</p></div>
                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500"><Package size={24} strokeWidth={2.5}/></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
                <div><p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Pedidos Pendientes</p><p className="text-4xl font-black text-slate-800">0</p></div>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500"><Search size={24} strokeWidth={2.5}/></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
                <div><p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Visitas del Mes</p><p className="text-4xl font-black text-slate-800">0</p></div>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500"><UserIcon size={24} strokeWidth={2.5}/></div>
              </div>
            </div>
          </div>
        ) : activeTab === 'productos' ? (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800">Tus Productos</h1>
              <button onClick={() => { setEditingProductId(null); setNewProduct(defaultProductState); setActiveTab('nuevo-producto'); }} className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <Plus size={20} /> Crear Producto
              </button>
            </div>
            {products.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm"><Package size={48} className="mx-auto text-slate-300 mb-4" /><h3 className="text-xl font-bold text-slate-800 mb-2">Tu catálogo está vacío</h3><p className="text-slate-500">Agrega tu primer producto para empezar a vender.</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-white rounded-[2rem] p-5 flex flex-col group shadow-sm border border-slate-100 relative hover:shadow-xl transition-all hover:-translate-y-1">
                    
                    {/* BOTONES MÁGICOS DE EDICIÓN Y ELIMINACIÓN */}
                    <div className="absolute top-8 right-8 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(p)} className="p-2.5 bg-white text-blue-500 rounded-full shadow-md hover:bg-blue-50 transition-colors" title="Editar"><Edit size={16}/></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-2.5 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors" title="Eliminar"><Trash2 size={16}/></button>
                    </div>

                    <div className={`${p.bg_color || 'bg-slate-50'} h-40 rounded-[1.5rem] flex items-center justify-center text-6xl mb-4`}>{p.icon || '📦'}</div>
                    <h4 className="font-bold text-slate-800 mb-1 line-clamp-1">{p.name}</h4>
                    <div className="flex justify-between items-center mt-auto pt-4">
                      <span className="font-black text-slate-800">${p.price}</span>
                      <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">{p.stock} u.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'nuevo-producto' ? (
          <div className="max-w-3xl animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800">{editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h1>
              {editingProductId && (
                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">Cancelar Edición</button>
              )}
            </div>
            <form onSubmit={handleSaveProduct} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Nombre del producto</label><input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" /></div>
                <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Descripción breve</label><input type="text" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Precio ($)</label><input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Stock General (Si no usas variantes)</label><input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Icono (Emoji)</label><input type="text" value={newProduct.icon} onChange={e => setNewProduct({...newProduct, icon: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all text-2xl text-center" /></div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Color de fondo</label>
                  <select value={newProduct.bg_color} onChange={e => setNewProduct({...newProduct, bg_color: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium">
                    <option value="bg-slate-50">Gris</option><option value="bg-pink-50">Rosa</option><option value="bg-blue-50">Azul</option><option value="bg-emerald-50">Verde</option>
                  </select>
                </div>
              </div>

              {/* SECCIÓN VARIANTES */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18}/> Opciones y Variantes</h3>
                <div className="flex gap-3 mb-6">
                  <input type="text" placeholder="Opción (ej. Talla)" value={optionName} onChange={e => setOptionName(e.target.value)} className="w-1/3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none" />
                  <input type="text" placeholder="Valores separados por coma (S, M, L)" value={optionValues} onChange={e => setOptionValues(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none" />
                  <button onClick={handleAddOption} className="bg-slate-800 text-white px-4 rounded-xl font-bold hover:bg-slate-700 text-sm">Agregar</button>
                </div>
                
                {Object.keys(newProduct.options).length > 0 && (
                  <div className="mb-6 space-y-3">
                    {Object.entries(newProduct.options).map(([key, values]) => (
                      <div key={key} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div><span className="font-bold text-sm mr-2">{key}:</span><span className="text-slate-500 text-sm">{values.join(', ')}</span></div>
                        <button type="button" onClick={() => handleRemoveOption(key)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                )}

                {Object.keys(newProduct.variant_stock || {}).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Stock por Variante</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(newProduct.variant_stock).map(([comboKey, stockVal]) => (
                        <div key={comboKey} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500 w-1/2 text-right">{comboKey}</span>
                          <input type="number" placeholder="Cantidad" value={stockVal} onChange={e => setNewProduct(prev => ({...prev, variant_stock: {...prev.variant_stock, [comboKey]: e.target.value}}))} className="w-1/2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium outline-none focus:border-pink-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="bg-pink-500 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-pink-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                  {editingProductId ? 'Guardar Cambios' : 'Publicar Producto'}
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === 'configuracion' ? (
          <div className="max-w-2xl animate-in slide-in-from-bottom-8 duration-300">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Configuración de Tienda</h1>
            <form onSubmit={handleSaveSettings} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
              
              {/* VISTA PREVIA */}
              <div className="mb-8 border border-slate-200 rounded-[2rem] overflow-hidden">
                 <div className={`h-24 ${storeSettings.cover_color || 'bg-slate-100'} relative`}>
                    <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border-4 border-white">
                      {storeSettings.avatar_icon || '🏪'}
                    </div>
                 </div>
                 <div className="pt-8 pb-4 px-6 bg-white">
                    <h3 className="font-bold text-lg text-slate-800">{storeSettings.name || 'Nombre de tu Tienda'}</h3>
                    <p className="text-sm text-slate-500">{storeSettings.type || 'Categoría'}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Tienda</label>
                  <input type="text" required value={storeSettings.name} onChange={e => setStoreSettings({...storeSettings, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Categoría Principal</label>
                  <input type="text" required value={storeSettings.type} onChange={e => setStoreSettings({...storeSettings, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Avatar (Emoji)</label>
                  <input type="text" value={storeSettings.avatar_icon} onChange={e => setStoreSettings({...storeSettings, avatar_icon: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all text-2xl text-center" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Color de Portada</label>
                  <select value={storeSettings.cover_color} onChange={e => setStoreSettings({...storeSettings, cover_color: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium">
                    <option value="bg-slate-100">Gris</option><option value="bg-pink-100">Rosa</option><option value="bg-blue-100">Azul</option>
                    <option value="bg-emerald-100">Verde</option><option value="bg-purple-100">Morado</option><option value="bg-orange-100">Naranja</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
    </div>
  );
}