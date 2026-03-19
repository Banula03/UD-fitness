import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, {
                id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image_url: product.image_url
            }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
