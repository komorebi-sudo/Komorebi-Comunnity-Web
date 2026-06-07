import { useState, useEffect, useMemo } from 'react';

export function useVariantManager(product, initialQuantity = 1) {
  const [selections, setSelections] = useState({});
  const [quantity, setQuantity] = useState(initialQuantity);

  // 1. Cuando carga el producto, autoseleccionamos la primera opción de cada variante
  useEffect(() => {
    if (product?.options && Object.keys(product.options).length > 0) {
      const initial = Object.fromEntries(
        Object.entries(product.options).map(([key, vals]) => [key, vals[0]])
      );
      setSelections(initial);
    } else {
      setSelections({});
    }
    setQuantity(initialQuantity);
  }, [product, initialQuantity]);

  // 2. Manejador para cuando el usuario hace clic en una talla/color distinto
  const handleSelectionChange = (optionName, value) => {
    setSelections(prev => ({ ...prev, [optionName]: value }));
    setQuantity(1); // Reseteamos la cantidad a 1 por seguridad al cambiar de variante
  };

  // 3. Calculamos la "Llave" del combo (ej: "M | Rojo" o "default")
  const comboKey = useMemo(() => {
    if (!product?.options || Object.keys(product.options).length === 0) return 'default';
    return Object.values(selections).join(' | ');
  }, [product, selections]);

  // 4. Calculamos el stock exacto disponible para este combo
  const currentStock = useMemo(() => {
    if (!product) return 0;
    if (comboKey !== 'default' && product.variant_stock) {
       return Number(product.variant_stock[comboKey]) || 0;
    }
    return Number(product.stock) || 0;
  }, [product, comboKey]);

  // 5. Controles de cantidad blindados (nunca pedirán más del stock real)
  const increment = () => {
    if (quantity < currentStock) setQuantity(q => q + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const isOutOfStock = currentStock === 0;

  return {
    selections,
    handleSelectionChange,
    comboKey,
    quantity,
    increment,
    decrement,
    currentStock,
    isOutOfStock
  };
}