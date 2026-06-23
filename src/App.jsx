import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StoreCatalog from './pages/StoreCatalog';
import ExploreStores from './pages/ExploreStores';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Favorites from './pages/Favorites';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import CartPanel from './components/CartPanel'; 
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SearchProducts from './pages/SearchProducts';
import UserProfile from './pages/UserProfile';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. IMPORTAMOS EL HORNO DE TOASTS
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
       <AuthProvider>
         <FavoritesProvider>
           <CartProvider>
            <BrowserRouter>
             <ErrorBoundary>
               {/* 2. INSTALAMOS EL HORNO (Estilizado para verse premium) */}
               <Toaster 
                 position="bottom-center" 
                 toastOptions={{
                   duration: 4000,
                   style: {
                     background: '#1e293b',
                     color: '#fff',
                     borderRadius: '1rem',
                     fontWeight: '600',
                     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                   },
                   success: { iconTheme: { primary: '#ec4899', secondary: '#fff' } }
                 }} 
               />
               
               <CartPanel /> 
                 <Routes>
                   <Route path="/" element={<Home />} />
                   <Route path="/explorar-tiendas" element={<ExploreStores />} />
                   <Route path="/tienda/:storeSlug" element={<StoreCatalog />} />
                   <Route path="/producto/:productSlug" element={<ProductDetail />} />
                   <Route path="/checkout" element={<Checkout />} />
                   <Route path="/favoritos" element={<Favorites />} />
                   <Route path="/login" element={<Login />} />
                   <Route path="/admin" element={<AdminDashboard />} />
                   <Route path="/buscar" element={<SearchProducts />} />
                   <Route path="/perfil" element={<UserProfile />} />
                   <Route path="/admin/:tab?" element={<AdminDashboard />} />
                 </Routes>
             </ErrorBoundary>
            </BrowserRouter>
           </CartProvider>
         </FavoritesProvider>
       </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}