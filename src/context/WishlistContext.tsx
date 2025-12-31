'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useProducts, Product } from './ProductContext';

interface WishlistContextType {
    wishlistItems: number[];
    addToWishlist: (productId: number) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    getWishlistProducts: () => Product[];
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<number[]>([]);
    const { products } = useProducts();

    // Load wishlist from localStorage
    useEffect(() => {
        const savedWishlist = localStorage.getItem('bricks-wishlist');
        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));
            } catch (e) {
                console.error('Failed to parse wishlist from localStorage', e);
            }
        }
    }, []);

    // Save wishlist to localStorage
    useEffect(() => {
        localStorage.setItem('bricks-wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (productId: number) => {
        if (!wishlistItems.includes(productId)) {
            setWishlistItems([...wishlistItems, productId]);
        }
    };

    const removeFromWishlist = (productId: number) => {
        setWishlistItems(wishlistItems.filter(id => id !== productId));
    };

    const isInWishlist = (productId: number) => {
        return wishlistItems.includes(productId);
    };

    const getWishlistProducts = () => {
        return products.filter(p => wishlistItems.includes(p.id));
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            getWishlistProducts,
            wishlistCount: wishlistItems.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
