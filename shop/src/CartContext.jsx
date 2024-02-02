import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        // Return a new array with the matching item replaced
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, count: cartItem.count + 1 }
            : cartItem
        );
      } else {
        // Item not in cart, so add it
        return [...prevItems, { ...item, count: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === id);

      if (existingItem.count > 1) {
        // If the item count is more than 1, decrement the count
        return prevItems.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, count: cartItem.count - 1 }
            : cartItem
        );
      } else {
        // If the item count is 1, remove the item from the cart
        return prevItems.filter((cartItem) => cartItem.id !== id);
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
