import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // MAGIA DE ESCALABILIDAD: Al iniciar, intentamos leer el carrito guardado en el navegador
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem('komorebi_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  // MAGIA DE ESCALABILIDAD: Cada vez que el carrito cambie, lo guardamos automáticamente en el navegador
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
        return newCart;
      }

      return [...prevCart, { 
        ...product, 
        quantity, 
        selectedOptions, 
        combo,
        originalId: product.id,
        id: `${product.id}-${combo}` 
      }];
    });
    // ¡ELIMINADO! setIsCartOpen(true); para no interrumpir la navegación del cliente
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

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, isCartOpen, toggleCart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};