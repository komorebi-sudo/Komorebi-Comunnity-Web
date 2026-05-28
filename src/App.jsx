import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StoreCatalog from './pages/StoreCatalog';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tienda/:storeId" element={<StoreCatalog />} />
      </Routes>
    </BrowserRouter>
  );
}