import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import StoreCatalog from './pages/StoreCatalog.jsx';
import ExploreStores from './pages/ExploreStores.jsx';
import Checkout from './pages/Checkout.jsx'; // Importamos la nueva página
import { CartProvider } from './context/CartContext.jsx';
import CartPanel from './components/CartPanel.jsx'; 

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <CartPanel /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar-tiendas" element={<ExploreStores />} />
          <Route path="/tienda/:storeId" element={<StoreCatalog />} />
          {/* Añadimos la ruta para el Checkout */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}