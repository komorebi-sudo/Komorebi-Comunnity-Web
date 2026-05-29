import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Asegúrate de que estos archivos existan en la carpeta src/pages
import Home from './pages/Home';
import StoreCatalog from './pages/StoreCatalog';
import ExploreStores from './pages/ExploreStores';
// Asegúrate de que estos archivos existan en src/context y src/components
import { CartProvider } from './context/CartContext';
import CartPanel from './components/CartPanel'; 

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* El panel del carrito vive aquí, por encima de todas las rutas */}
        <CartPanel /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar-tiendas" element={<ExploreStores />} />
          <Route path="/tienda/:storeId" element={<StoreCatalog />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}