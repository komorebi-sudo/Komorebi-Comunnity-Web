import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import { useQueryClient, useQuery } from '@tanstack/react-query';

export function useAdmin() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || 'resumen';
  const queryClient = useQueryClient();

  const [session, setSession] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  
  // NUEVO: Estados para la Paginación y Filtros de Pedidos
  const [ordersFilter, setOrdersFilter] = useState('todos'); 
  const [ordersLimit, setOrdersLimit] = useState(10);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [statsOrders, setStatsOrders] = useState([]); // Pedidos ligeros solo para la gráfica

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newStore, setNewStore] = useState({ name: '', type: '', slug: '' });
  const [storeSettings, setStoreSettings] = useState({ name: '', type: '', slug: '', avatar_url: '', banner_url: '', template_id: 'default' });
  const [editingProductId, setEditingProductId] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [storeAvatarFile, setStoreAvatarFile] = useState(null);
  const [storeBannerFile, setStoreBannerFile] = useState(null);

  const defaultProductState = { name: '', description: '', price: '', stock: '', category: '', badge: '', image_url: '', options: {}, variant_stock: {} };
  const [newProduct, setNewProduct] = useState(defaultProductState);
  const [optionName, setOptionName] = useState('');
  const [optionValues, setOptionValues] = useState('');

  const fileInputRef = useRef(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const receiptInputRef = useRef(null);

  useEffect(() => { if (!tab) navigate('/admin/resumen', { replace: true }); }, [tab, navigate]);

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
          setStoreSettings({ name: storeData.name || '', type: storeData.type || '', slug: storeData.slug || '', avatar_url: storeData.avatar_url || '', banner_url: storeData.banner_url || '', template_id: storeData.template_id || 'default' });
          
          const { data: productsData } = await supabase.from('products').select('*').eq('store_id', storeData.id).order('created_at', { ascending: false });
          setProducts(productsData || []);

          // MAGIA 1: Pedimos SOLO el 'status' e 'items' para calcular las gráficas rápido (Ahorra el 90% de RAM)
          const { data: allStoreOrders } = await supabase.from('orders')
            .select('id, status, items')
            .contains('items', [{ store_id: storeData.id }]);
          setStatsOrders(allStoreOrders || []);
        }
      } catch (err) { console.error("Error al cargar datos:", err.message); } 
      finally { setIsLoading(false); }
    }
    fetchData();
  }, [navigate]);

  // MAGIA 2: Paginación Real con TanStack Query
  const { data: paginatedOrders = [] } = useQuery({
    queryKey: ['paginatedOrders', store?.id, ordersFilter, ordersLimit],
    enabled: !!store?.id,
    queryFn: async () => {
      // Le decimos a Postgres: "Busca dentro del JSON 'items' aquellos que tengan mi store_id"
      let query = supabase.from('orders').select('*', { count: 'exact' })
        .contains('items', [{ store_id: store.id }])
        .order('created_at', { ascending: false });

      if (ordersFilter !== 'todos') query = query.eq('status', ordersFilter);
      
      query = query.limit(ordersLimit); // Trae solo los que caben en la página

      const { data, count, error } = await query;
      if (error) throw error;
      setTotalOrderCount(count || 0);
      return data || [];
    }
  });

  const orders = paginatedOrders; // Usamos los pedidos paginados para la vista

  // --- LAS FUNCIONES DE OPCIONES Y COMPRESIÓN SE MANTIENEN INTACTAS ---
  const handleAddOption = (e) => { e.preventDefault(); if (!optionName || !optionValues) return; const valuesArray = optionValues.split(',').map(v => v.trim()).filter(v => v); setNewProduct(prev => ({ ...prev, options: { ...(prev.options || {}), [optionName]: valuesArray } })); setOptionName(''); setOptionValues(''); };
  const handleRemoveOption = (name) => { const newOptions = { ...newProduct.options }; delete newOptions[name]; setNewProduct(prev => ({ ...prev, options: newOptions })); };

  useEffect(() => {
    if (!newProduct.options || Object.keys(newProduct.options).length === 0) return;
    const keys = Object.keys(newProduct.options);
    const combinations = keys.reduce((acc, key) => { const values = Array.isArray(newProduct.options[key]) ? newProduct.options[key] : []; if (values.length === 0) return acc; if (acc.length === 0) return values.map(v => ({ [key]: v })); const newAcc = []; acc.forEach(combo => { values.forEach(v => { newAcc.push({ ...combo, [key]: v }); }); }); return newAcc; }, []);
    const newVariantStock = {};
    combinations.forEach(combo => { const comboKey = Object.values(combo).join(' | '); newVariantStock[comboKey] = newProduct.variant_stock?.[comboKey] || ''; });
    setNewProduct(prev => { const isDifferent = JSON.stringify(prev.variant_stock) !== JSON.stringify(newVariantStock); if (isDifferent) return { ...prev, variant_stock: newVariantStock }; return prev; });
  }, [newProduct.options]);

  useEffect(() => {
    const hasVariants = newProduct.variant_stock && Object.keys(newProduct.variant_stock).length > 0;
    if (hasVariants) {
      const totalStock = Object.values(newProduct.variant_stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
      setNewProduct(prev => { if (prev.stock === totalStock) return prev; return { ...prev, stock: totalStock }; });
    }
  }, [newProduct.variant_stock]);

  const uploadImage = async (file, pathPrefix) => {
    if (!file) return null;
    const options = { maxSizeMB: 0.1, maxWidthOrHeight: 1024, useWebWorker: true };
    let fileToUpload = file;
    try { fileToUpload = await imageCompression(file, options); } catch (error) { console.warn(error); }
    const fileExt = fileToUpload.name.split('.').pop() || 'jpeg';
    const fileName = `${pathPrefix}-${Date.now()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, fileToUpload);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const handleCreateStore = async (e) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('stores').insert([{ user_id: session.user.id, name: newStore.name, type: newStore.type, slug: newStore.slug, template_id: 'default' }]).select();
      if (error) throw error;
      setStore(data[0]); setStoreSettings({ ...data[0], template_id: 'default' });
      toast.success('¡Tienda creada con éxito!');
      queryClient.invalidateQueries({ queryKey: ['stores'] }); 
    } catch (err) { toast.error("Hubo un problema al crear la tienda"); } finally { setIsSubmitting(false); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault(); setIsSubmitting(true); const loadingToast = toast.loading('Guardando configuración...');
    try {
      let finalAvatarUrl = storeSettings.avatar_url; let finalBannerUrl = storeSettings.banner_url;
      if (storeAvatarFile) finalAvatarUrl = await uploadImage(storeAvatarFile, 'avatar');
      if (storeBannerFile) finalBannerUrl = await uploadImage(storeBannerFile, 'banner');
      const updates = { name: storeSettings.name, type: storeSettings.type, avatar_url: finalAvatarUrl, banner_url: finalBannerUrl, template_id: storeSettings.template_id };
      const { error } = await supabase.from('stores').update(updates).eq('id', store.id);
      if (error) throw error;
      setStore({ ...store, ...updates }); setStoreSettings({ ...storeSettings, ...updates });
      setStoreAvatarFile(null); setStoreBannerFile(null);
      toast.success('¡Configuración actualizada!', { id: loadingToast });
      queryClient.invalidateQueries({ queryKey: ['stores'] }); queryClient.invalidateQueries({ queryKey: ['store', storeSettings.slug] });
    } catch (err) { toast.error("Error al guardar la configuración", { id: loadingToast }); } finally { setIsSubmitting(false); }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault(); setIsSubmitting(true); const loadingToast = toast.loading('Publicando producto...');
    try {
      let finalImageUrl = newProduct.image_url;
      if (productImageFile) finalImageUrl = await uploadImage(productImageFile, 'product');
      const productData = { name: newProduct.name, slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description: newProduct.description || null, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) || 0, image_url: finalImageUrl || null, options: newProduct.options || {}, variant_stock: newProduct.variant_stock || {} };
      if (editingProductId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProductId);
        if (error) throw error;
        setProducts(products.map(p => p.id === editingProductId ? { ...p, ...productData } : p));
        toast.success('¡Producto actualizado!', { id: loadingToast });
      } else {
        productData.store_id = store.id;
        const { data, error } = await supabase.from('products').insert([productData]).select();
        if (error) throw error;
        setProducts([data[0], ...products]);
        toast.success('¡Producto creado exitosamente!', { id: loadingToast });
      }
      queryClient.invalidateQueries({ queryKey: ['products', store.id] }); queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      setNewProduct(defaultProductState); setEditingProductId(null); setProductImageFile(null); setProductImagePreview(null); navigate('/admin/productos');
    } catch (err) { toast.error(`Error: ${err.message || 'Desconocido'}`, { id: loadingToast }); } finally { setIsSubmitting(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto permanentemente?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      toast.success('Producto eliminado');
      queryClient.invalidateQueries({ queryKey: ['products', store.id] }); queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
    } catch (err) { toast.error("Error al eliminar el producto"); }
  };

  const handleEditClick = (product) => { setNewProduct({ name: product.name || '', description: product.description || '', price: product.price || '', stock: product.stock || 0, category: product.category || '', badge: product.badge || '', image_url: product.image_url || '', options: product.options || {}, variant_stock: product.variant_stock || {} }); setEditingProductId(product.id); setProductImagePreview(product.image_url || null); setProductImageFile(null); navigate('/admin/nuevo-producto'); };
  const handleCancelEdit = () => { setNewProduct(defaultProductState); setEditingProductId(null); setProductImageFile(null); setProductImagePreview(null); navigate('/admin/productos'); };
  const handleOpenReceiptModal = (orderId) => { setOrderToShip(orderId); setIsReceiptModalOpen(true); };
  const handleCloseReceiptModal = () => { setIsReceiptModalOpen(false); setOrderToShip(null); setReceiptFile(null); setReceiptPreview(null); };

  const handleConfirmShipment = async () => {
    if (!receiptFile) { toast.error("Adjunta la foto de la guía de envío para el cliente."); return; }
    setIsSubmitting(true); const loadingToast = toast.loading('Subiendo guía y notificando...');
    try {
      const receiptUrl = await uploadImage(receiptFile, 'receipt');
      const { error } = await supabase.from('orders').update({ status: 'enviado', shipping_receipt_url: receiptUrl }).eq('id', orderToShip);
      if (error) throw error;
      
      // Invalidamos para que la lista visible de 10 pedidos se refresque
      queryClient.invalidateQueries({ queryKey: ['paginatedOrders'] });
      // Actualizamos las estadísticas internas para el Resumen
      setStatsOrders(prev => prev.map(o => o.id === orderToShip ? { ...o, status: 'enviado' } : o));
      
      handleCloseReceiptModal();
      toast.success('¡Envío confirmado!', { id: loadingToast });
    } catch (err) { toast.error("Error al confirmar el envío.", { id: loadingToast }); } finally { setIsSubmitting(false); }
  };

  // MAGIA 3: Usamos statsOrders (Los pedidos ligeros) para que las estadísticas y gráficas no se rompan por la paginación
  const pendingOrdersCount = statsOrders.filter(o => o.status === 'pendiente').length;
  const totalRevenue = statsOrders.reduce((total, order) => {
    const storeItems = order.items.filter(i => i.store_id === store?.id);
    const orderTotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total + orderTotal;
  }, 0);
  const hasVariants = Object.keys(newProduct.variant_stock || {}).length > 0;

  const salesData = products.map(p => {
    const totalSold = statsOrders.reduce((sum, order) => {
      const item = order.items?.find(i => i.product_id === p.id);
      return sum + (item ? item.quantity : 0);
    }, 0);
    return { name: p.name.substring(0, 15) + (p.name.length > 15 ? '...' : ''), ventas: totalSold };
  }).sort((a, b) => b.ventas - a.ventas).slice(0, 5);

  return {
    navigate, activeTab, session, store, products, orders, isLoading, isSubmitting,
    newStore, setNewStore, storeSettings, setStoreSettings, editingProductId,
    productImageFile, setProductImageFile, productImagePreview, setProductImagePreview,
    storeAvatarFile, setStoreAvatarFile, storeBannerFile, setStoreBannerFile,
    newProduct, setNewProduct, optionName, setOptionName, optionValues, setOptionValues,
    fileInputRef, isReceiptModalOpen, handleAddOption, handleRemoveOption, handleLogout,
    handleCreateStore, handleSaveSettings, handleSaveProduct, handleDeleteProduct,
    handleEditClick, handleCancelEdit, handleOpenReceiptModal, handleCloseReceiptModal,
    handleConfirmShipment, pendingOrdersCount, totalRevenue, hasVariants, salesData,
    receiptPreview, receiptInputRef, setReceiptFile, setReceiptPreview, defaultProductState,
    
    // Devolvemos los nuevos superpoderes a la interfaz
    ordersFilter, setOrdersFilter, setOrdersLimit, totalOrderCount
  };
}