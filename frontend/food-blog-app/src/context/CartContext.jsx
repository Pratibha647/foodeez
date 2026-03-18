import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('foodeez_cart');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('foodeez_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const exists = prev.find(item => item._id === product._id);
            if (exists) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Generate deterministic mock price if price doesn't exist
            const charSum = product._id ? [...product._id].reduce((sum, char) => sum + char.charCodeAt(0), 0) : Math.random() * 1000;
            const mockPrice = parseFloat(((charSum % 15) + 5.99).toFixed(2));

            return [...prev, { ...product, quantity: 1, price: mockPrice }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    const updateQuantity = (id, amount) => {
        setCartItems(prev => prev.map(item => {
            if (item._id === id) {
                const newQuantity = Math.max(1, item.quantity + amount);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const getCartTotal = () => {
        return parseFloat(cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
