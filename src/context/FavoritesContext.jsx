import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Esta función agrega o quita el producto dependiendo de si ya está en la lista
  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find((item) => item.id === product.id);
      if (exists) {
        return prevFavorites.filter((item) => item.id !== product.id); // Lo quita
      }
      return [...prevFavorites, product]; // Lo agrega
    });
  };

  // Esta función nos dirá si un producto específico está en favoritos (para pintar el corazón de rosa)
  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}