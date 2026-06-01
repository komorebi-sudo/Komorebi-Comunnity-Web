import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Store, Package, Settings, LogOut, Plus, LayoutDashboard, Loader2, Save, X, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('resumen');
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', slug: '', type: 'Papelería & Arte', avatar_icon: '🏪', cover_color: 'bg-pink-100' });

  // ESTADOS DEL PRODUCTO ACTUALIZADOS PARA MANEJAR STOCK
  const [showProductForm, setShowProductForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', icon: '📦', bg_color: 'bg-slate-50', badge: '', stock: 1 });
  const [productOptions, setProductOptions] = useState([]); 
  const [variantStock, setVariantStock] = useState({}); // Guardará el mapa { "S": 5, "M": 0 }

  useEffect(() => {
    async function checkUserAndStore() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) { navigate('/login'); return; }
        setSession(session);

        const { data: storeData, error: storeError } = await supabase
          .from('stores').select('*').eq('user_id', session.user.id).single();

        if (storeError && storeError.code !== 'PGRST116') throw storeError;
        setStore(storeData);

        if (storeData) {
          const { data: productsData } = await supabase
            .from('products').select('*').eq('store_id', storeData.id).order('created_at', { ascending: false });
          setProducts(productsData || []);
        }
      } catch (err) {
        console.error("Error cargando:", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    checkUserAndStore();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('stores').insert([{ user_id: session.user.id, ...newStore }]).select().single();
      if (error) throw error;
      setStore(data);
      setIsCreatingStore(false);
    } catch (err) {
      alert("Error al crear tienda: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOption = () => setProductOptions([...productOptions, { name: '', values: '' }]);
  const handleRemoveOption = (index) => {
    const newOptions = productOptions.filter((_, i) => i !== index);
    setProductOptions(newOptions);
    // Limpiamos el stock de variantes si borran opciones
    if (newOptions.length === 0) setVariantStock({}); 
  };
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...productOptions];
    newOptions[index][field] = value;
    setProductOptions(newOptions);
  };

  // MAGIA MATEMÁTICA: Esta función calcula todas las combinaciones posibles de variantes
  const getCombinations = () => {
    const validOptions = productOptions.filter(o => o.name.trim() && o.values.trim());
    if (validOptions.length === 0) return [];
    
    const arrays = validOptions.map(o => o.values.split(',').map(v => v.trim()).filter(v => v !== ''));
    if (arrays.some(arr => arr.length === 0)) return [];

    return arrays.reduce((acc, curr) => {
      if (acc.length === 0) return curr;
      const newAcc = [];
      acc.forEach(a => {
        curr.forEach(c => {
          newAcc.push(`${a} | ${c}`); // Si hay más de una opción, las une con un palito " | "
        });
      });
      return newAcc;
    }, []);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let optionsJson = null;
    let finalStock = parseInt(newProduct.stock) || 0;
    let finalVariantStock = {};

    // 1. Construimos el JSON de variantes y validamos el stock
    if (productOptions.length > 0) {
      optionsJson = {};
      productOptions.forEach(opt => {
        if (opt.name.trim() && opt.values.trim()) {
          optionsJson[opt.name.trim()] = opt.values.split(',').map(v => v.trim()).filter(v => v);
        }
      });

      // El stock total será la suma del stock de cada variante
      finalStock = 0;
      finalVariantStock = variantStock;
      Object.values(variantStock).forEach(val => {
        finalStock += (parseInt(val) || 0);
      });
    }

    const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    try {
      const { data, error } = await supabase.from('products').insert([{
        store_id: store.id,
        name: newProduct.name,
        slug: slug,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        icon: newProduct.icon,
        bg_color: newProduct.bg_color,
        badge: newProduct.badge,
        options: optionsJson,
        stock: finalStock,                 // ¡Nuevo dato!
        variant_stock: finalVariantStock   // ¡Nuevo dato!
      }]).select().single();

      if (error) throw error;
      
      setProducts([data, ...products]);
      setShowProductForm(false);
      setNewProduct({ name: '', price: '', description: '', icon: '📦', bg_color: 'bg-slate-50', badge: '', stock: 1 });
      setProductOptions([]);
      setVariantStock({});

    } catch (err) {
      alert("Error al guardar producto: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={32}/></div>;
  if (!session) return null;

  const userEmail = session.user?.email || '';
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';
  const combinations = getCombinations(); // Generamos las combinaciones en tiempo real

  return (
    <div className="min-h-screen bg-[#faf9f8] flex font-sans selection:bg-pink-200">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500 mr-3">
            <Store size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Komorebi <span className="text-pink-500">Crea</span></span>
        </div>
        {store && (
          <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => setActiveTab('resumen')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'resumen' ? 'bg-slate-50 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
              <LayoutDashboard size={18} /><span>Resumen</span>
            </button>
            <button onClick={() => setActiveTab('productos')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'productos' ? 'bg-slate-50 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Package size={18} /><span>Mis Productos</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 px-4 py-3 rounded-xl font-medium transition-colors">
              <Settings size={18} /><span>Configuración</span>
            </button>
          </nav>
        )}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-slate-500 hover:text-red-500 px-4 py-3 rounded-xl font-medium transition-colors w-full">
            <LogOut size={18} /><span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto pb-24">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-slate-800">{activeTab === 'productos' ? 'Inventario' : 'Panel de Control'}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-500">{userEmail}</span>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">{initial}</div>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {!store ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center mt-10">
               <h2 className="text-3xl font-extrabold text-slate-800 mb-4">¡Tu tienda fue creada!</h2>
               <p>Recarga la página para ver tu panel.</p>
            </div>
          ) : activeTab === 'resumen' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-4xl shadow-sm border-4 border-white">{store.avatar_icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{store.name}</h2>
                    <p className="text-slate-500">Resumen de actividad</p>
                  </div>
                </div>
                <Link to={`/tienda/${store.slug}`} target="_blank" className="bg-slate-50 text-slate-700 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors whitespace-nowrap text-center">
                  Ver mi tienda pública
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><p className="text-sm font-medium text-slate-500 mb-2">Visitas hoy</p><p className="text-3xl font-black text-slate-800">124</p></div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><p className="text-sm font-medium text-slate-500 mb-2">Pedidos pendientes</p><p className="text-3xl font-black text-slate-800">3</p></div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><p className="text-sm font-medium text-slate-500 mb-2">Ingresos del mes</p><p className="text-3xl font-black text-slate-800">$450</p></div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Tus Productos</h2>
                  <p className="text-slate-500">Gestiona tu catálogo e inventario.</p>
                </div>
                <button onClick={() => setShowProductForm(!showProductForm)} className="bg-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-pink-600 transition-all flex items-center gap-2">
                  {showProductForm ? <X size={20}/> : <Plus size={20}/>}
                  {showProductForm ? 'Cancelar' : 'Nuevo Producto'}
                </button>
              </div>

              {showProductForm && (
                <div className="bg-white rounded-[2rem] p-8 shadow-md border border-slate-200 mb-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-purple-400"></div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-6">Detalles del Producto</h3>
                  
                  <form onSubmit={handleCreateProduct} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del producto</label>
                        <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-[#faf9f8] border border-slate-200 focus:outline-none focus:border-pink-300"/>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Precio ($)</label>
                        <input type="number" step="0.01" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-[#faf9f8] border border-slate-200 focus:outline-none focus:border-pink-300"/>
                      </div>

                      {/* --- NUEVA CASILLA GENERAL DE STOCK --- */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Unidades (Stock General)</label>
                        <input 
                          type="number" min="0" 
                          disabled={productOptions.length > 0} 
                          value={newProduct.stock} 
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
                          className="w-full px-4 py-3 rounded-xl bg-[#faf9f8] border border-slate-200 focus:outline-none focus:border-pink-300 disabled:opacity-50 disabled:bg-slate-100"
                        />
                        {productOptions.length > 0 && <p className="text-xs text-slate-400 mt-1">Bloqueado. Usa el inventario por variante abajo.</p>}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
                        <textarea required value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} rows="3" className="w-full px-4 py-3 rounded-xl bg-[#faf9f8] border border-slate-200 focus:outline-none focus:border-pink-300"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Icono o Emoji</label>
                        <input type="text" required value={newProduct.icon} onChange={(e) => setNewProduct({...newProduct, icon: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-[#faf9f8] border border-slate-200 text-2xl"/>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Color de fondo</label>
                        <select value={newProduct.bg_color} onChange={(e) => setNewProduct({...newProduct, bg_color: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-[#faf9f8] border border-slate-200">
                          <option value="bg-slate-50">Gris Claro</option>
                          <option value="bg-pink-50">Rosa Pastel</option>
                          <option value="bg-blue-50">Azul Pastel</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-800">Opciones y Variantes (Opcional)</h4>
                        <button type="button" onClick={handleAddOption} className="text-sm font-bold text-pink-500 hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-colors flex items-center">
                          <Plus size={16} className="mr-1"/> Agregar opción
                        </button>
                      </div>
                      
                      {productOptions.length === 0 && <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">Este producto no tiene variantes.</p>}

                      <div className="space-y-4">
                        {productOptions.map((opt, index) => (
                          <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex-1 w-full">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre (Ej: Talla)</label>
                              <input type="text" value={opt.name} onChange={(e) => handleOptionChange(index, 'name', e.target.value)} placeholder="Talla, Color..." className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-pink-300 text-sm"/>
                            </div>
                            <div className="flex-[2] w-full">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valores (por coma)</label>
                              <input type="text" value={opt.values} onChange={(e) => handleOptionChange(index, 'values', e.target.value)} placeholder="S, M, L" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-pink-300 text-sm"/>
                            </div>
                            <button type="button" onClick={() => handleRemoveOption(index)} className="mt-5 sm:mt-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* --- NUEVA TABLA DINÁMICA DE INVENTARIO POR VARIANTE --- */}
                      {combinations.length > 0 && (
                        <div className="mt-6 p-5 bg-pink-50/50 rounded-xl border border-pink-100">
                          <h4 className="font-bold text-pink-800 mb-3 text-sm">Inventario por Variante</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {combinations.map(combo => (
                              <div key={combo} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-pink-100 shadow-sm">
                                <span className="text-sm font-bold text-slate-700 truncate mr-2">{combo}</span>
                                <input 
                                  type="number" min="0" placeholder="0"
                                  value={variantStock[combo] || ''}
                                  onChange={(e) => setVariantStock({...variantStock, [combo]: e.target.value})}
                                  className="w-20 px-2 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:border-pink-400 text-sm text-center font-semibold bg-[#faf9f8]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                      <button type="submit" disabled={isSubmitting} className="bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Publicar Producto
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-3xl p-5 flex items-center space-x-4 border border-slate-100 shadow-sm">
                    <div className={`w-16 h-16 ${product.bg_color || 'bg-slate-50'} rounded-2xl flex items-center justify-center text-3xl`}>{product.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{product.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-pink-500 font-black">${product.price}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          {product.stock} disp.
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}