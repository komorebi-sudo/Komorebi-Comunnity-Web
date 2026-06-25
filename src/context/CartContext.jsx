import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem('komorebi_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('komorebi_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product, quantity = 1, selectedOptions = {}, combo = 'default') => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.combo === combo
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        newCart[existingItemIndex].isSelected = true; // Si lo vuelve a agregar, lo seleccionamos
        return newCart;
      }

      return [...prevCart, { 
        ...product, 
        quantity, 
        selectedOptions, 
        combo,
        originalId: product.id,
        id: `${product.id}-${combo}`,
        isSelected: true // NUEVO: Por defecto viene seleccionado
      }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prevCart) => 
      prevCart.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // --- NUEVAS FUNCIONES DE SELECCIÓN ---
  
  const toggleItemSelection = (itemId) => {
    setCart((prevCart) => prevCart.map(item => 
      item.id === itemId ? { ...item, isSelected: item.isSelected === false ? true : false } : item
    ));
  };

  const toggleAllSelection = (selectAll) => {
    setCart(prevCart => prevCart.map(item => ({ ...item, isSelected: selectAll })));
  };

  const getSelectedTotal = () => {
    return cart
      .filter(item => item.isSelected !== false) // Asumimos true por defecto por si hay carritos viejos
      .reduce((total, item) => total + (item.price * item.quantity), 0)
      .toFixed(2);
  };

  const getSelectedItemsCount = () => {
    return cart.filter(item => item.isSelected !== false).reduce((count, item) => count + item.quantity, 0);
  };

  const clearSelectedItems = () => {
    // Borramos solo los seleccionados, MANTENEMOS los deseleccionados
    setCart(prevCart => prevCart.filter(item => item.isSelected === false));
  };

  // -------------------------------------

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, isCartOpen, toggleCart, addToCart, removeFromCart, updateQuantity, getCartCount,
      toggleItemSelection, toggleAllSelection, getSelectedTotal, getSelectedItemsCount, clearSelectedItems
    }}>
      {children}
    </CartContext.Provider>
  );
};