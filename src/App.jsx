import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StoreCatalog from './pages/StoreCatalog';
import ExploreStores from './pages/ExploreStores';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Favorites from './pages/Favorites'; // 1. Importamos la página
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext'; // 2. Importamos el contexto
import CartPanel from './components/CartPanel'; 
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard'; // Pon esto arriba con los imports
import SearchProducts from './pages/SearchProducts';
import UserProfile from './pages/UserProfile';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
     <AuthProvider>
       <FavoritesProvider> {/* 3. Envolvemos la app en el FavoritesProvider */}
         <CartProvider>
          <BrowserRouter>
           <CartPanel /> 
             <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/explorar-tiendas" element={<ExploreStores />} />
             <Route path="/tienda/:storeSlug" element={<StoreCatalog />} />
             <Route path="/producto/:productSlug" element={<ProductDetail />} />
             <Route path="/checkout" element={<Checkout />} />
             <Route path="/favoritos" element={<Favorites />} /> {/* 4. Añadimos la ruta */}
             <Route path="/login" element={<Login />} />
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/buscar" element={<SearchProducts />} />
             <Route path="/perfil" element={<UserProfile />} />
             <Route path="/admin/:tab?" element={<AdminDashboard />} />
             </Routes>
           </BrowserRouter>
         </CartProvider>
       </FavoritesProvider>
     </AuthProvider>
    </HelmetProvider>
  );
}