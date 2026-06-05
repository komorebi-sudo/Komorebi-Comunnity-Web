import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Store, Package, Settings, Plus, LogOut, Loader2, Home, User as UserIcon, Edit, Trash2, Save, LayoutDashboard, Search, UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumen');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newStore, setNewStore] = useState({ name: '', type: '', slug: '' });
  const [storeSettings, setStoreSettings] = useState({ name: '', type: '', slug: '', avatar_url: '', banner_url: '' });
  const [editingProductId, setEditingProductId] = useState(null);
  
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [storeAvatarFile, setStoreAvatarFile] = useState(null);
  const [storeBannerFile, setStoreBannerFile] = useState(null);

  // ELIMINADOS LOS EMOJIS DEL ESTADO INICIAL
  const defaultProductState = {
    name: '', description: '', price: '', stock: '', category: '', badge: '', image_url: '', options: {}, variant_stock: {}
  };
  const [newProduct, setNewProduct] = useState(defaultProductState);
  const [optionName, setOptionName] = useState('');
  const [optionValues, setOptionValues] = useState('');

  const fileInputRef = useRef(null);

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
          setStoreSettings(storeData);
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
  }, [newProduct.options]);

  useEffect(() => {
    const hasVariants = newProduct.variant_stock && Object.keys(newProduct.variant_stock).length > 0;
    if (hasVariants) {
      const totalStock = Object.values(newProduct.variant_stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
      setNewProduct(prev => {
        if (prev.stock === totalStock) return prev;
        return { ...prev, stock: totalStock };
      });
    }
  }, [newProduct.variant_stock]);

  const uploadImage = async (file, pathPrefix) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}-${Date.now()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('stores').insert([{
        user_id: session.user.id, name: newStore.name, type: newStore.type, slug: newStore.slug
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
      let finalAvatarUrl = storeSettings.avatar_url;
      let finalBannerUrl = storeSettings.banner_url;

      if (storeAvatarFile) finalAvatarUrl = await uploadImage(storeAvatarFile, 'avatar');
      if (storeBannerFile) finalBannerUrl = await uploadImage(storeBannerFile, 'banner');

      const updates = { name: storeSettings.name, type: storeSettings.type, avatar_url: finalAvatarUrl, banner_url: finalBannerUrl };

      const { error } = await supabase.from('stores').update(updates).eq('id', store.id);
      if (error) throw error;
      
      setStore({ ...store, ...updates });
      setStoreSettings({ ...storeSettings, ...updates });
      setStoreAvatarFile(null);
      setStoreBannerFile(null);
      alert("¡Configuración actualizada con éxito!");
    } catch (err) { 
      console.error(err);
      alert("Error al guardar configuración"); 
    } finally { setIsSubmitting(false); }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = newProduct.image_url;
      if (productImageFile) {
        finalImageUrl = await uploadImage(productImageFile, 'product');
      }

      const productData = {
        store_id: store.id, name: newProduct.name, slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newProduct.description, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) || 0,
        category: newProduct.category, badge: newProduct.badge, image_url: finalImageUrl, options: newProduct.options, variant_stock: newProduct.variant_stock
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
      setProductImageFile(null);
      setProductImagePreview(null);
      setActiveTab('productos');
    } catch (err) { 
      console.error(err);
      alert("Error al guardar producto. Revisa los permisos de Storage."); 
    } finally { setIsSubmitting(false); }
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
    setProductImagePreview(product.image_url || null);
    setProductImageFile(null);
    setActiveTab('nuevo-producto');
  };

  const handleCancelEdit = () => {
    setNewProduct(defaultProductState);
    setEditingProductId(null);
    setProductImageFile(null);
    setProductImagePreview(null);
    setActiveTab('productos');
  };

  if (isLoading) return <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={32}/></div>;
  if (!session) return null;

  const hasVariants = Object.keys(newProduct.variant_stock || {}).length > 0;

  return (
    <div className="min-h-screen bg-[#faf9f8] text-slate-700 flex">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white overflow-hidden font-bold">
            {store?.avatar_url ? <img src={store.avatar_url} className="w-full h-full object-cover" /> : store?.name?.charAt(0).toUpperCase() || 'K'}
          </div>
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
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Resumen de {store.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
                <div><p className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-wider">Productos</p><p className="text-4xl font-black text-slate-800">{products.length}</p></div>
                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500"><Package size={24} strokeWidth={2.5}/></div>
              </div>
            </div>
          </div>
        ) : activeTab === 'productos' ? (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800">Tus Productos</h1>
              <button onClick={() => { setEditingProductId(null); setNewProduct(defaultProductState); setProductImagePreview(null); setActiveTab('nuevo-producto'); }} className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-md hover:-translate-y-0.5"><Plus size={20} /> Crear Producto</button>
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
              {editingProductId && <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">Cancelar</button>}
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

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Nombre del producto</label><input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" /></div>
                <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Descripción breve</label><input type="text" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Precio ($)</label><input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-pink-300 focus:bg-white transition-all font-medium" /></div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{hasVariants ? 'Stock (Automático)' : 'Stock General'}</label>
                  <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} disabled={hasVariants} className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all font-medium ${hasVariants ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-70' : 'bg-slate-50 focus:border-pink-300 focus:bg-white'}`} />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18}/> Opciones y Variantes</h3>
                <div className="flex gap-3 mb-6">
                  <input type="text" placeholder="Opción (ej. Talla)" value={optionName} onChange={e => setOptionName(e.target.value)} className="w-1/3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none" />
                  <input type="text" placeholder="Valores (S, M, L)" value={optionValues} onChange={e => setOptionValues(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium outline-none" />
                  <button onClick={handleAddOption} className="bg-slate-800 text-white px-4 rounded-xl font-bold hover:bg-slate-700 text-sm">Agregar</button>
                </div>
                {Object.keys(newProduct.variant_stock || {}).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Inventario por Variante</h4>
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
              <button type="submit" disabled={isSubmitting} className="bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Guardar Identidad
              </button>
            </form>
          </div>
        ) : null}
      </main>
    </div>
  );
}