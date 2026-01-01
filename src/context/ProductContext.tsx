'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    unit: string;
    colors: string[];
    image: string;
    imageUrl?: string;
    description?: string;
    dimensions?: string;
    stock?: number;
}

export const initialProducts: Product[] = [
    // Bricks
    { id: 1, name: 'Common Brick', category: 'bricks', price: 0.15, unit: 'per brick', colors: ['Grey'], image: '/products/common-brick-aggregate.png', dimensions: '220x105x72mm', stock: 10000 },
    { id: 2, name: 'Load Bearing Brick', category: 'bricks', price: 0.18, unit: 'per brick', colors: ['Grey'], image: '/products/load-bearing-brick.png', dimensions: '220x105x72mm', stock: 6000 },
    { id: 3, name: 'Hollow Maxi Brick', category: 'bricks', price: 0.15, unit: 'per brick', colors: ['Grey'], image: '/products/hollow-maxi-brick.png', dimensions: '220x105x72mm', stock: 4000 },

    // Pavers - 60mm
    { id: 10, name: '60mm Interlocking Grey', category: 'pavers', price: 0.16, unit: 'per piece', colors: ['Grey'], image: '/products/interlocking-paver-new.png', dimensions: '200x100x60mm', stock: 3000 },
    { id: 11, name: '60mm Interlocking Red', category: 'pavers', price: 0.18, unit: 'per piece', colors: ['Red'], image: '/products/interlocking-paver-new.png', dimensions: '200x100x60mm', stock: 2500 },
    { id: 12, name: '60mm Interlocking Black', category: 'pavers', price: 0.18, unit: 'per piece', colors: ['Black'], image: '/products/interlocking-paver-new.png', dimensions: '200x100x60mm', stock: 2000 },
    { id: 13, name: '60mm Rectangular Grey', category: 'pavers', price: 0.16, unit: 'per piece', colors: ['Grey'], image: '/products/rectangular-paver.png', dimensions: '200x100x60mm', stock: 2500 },
    { id: 14, name: '60mm Rectangular Red', category: 'pavers', price: 0.18, unit: 'per piece', colors: ['Red'], image: '/products/rectangular-paver.png', dimensions: '200x100x60mm', stock: 2000 },
    { id: 15, name: '60mm Rectangular Black', category: 'pavers', price: 0.18, unit: 'per piece', colors: ['Black'], image: '/products/rectangular-paver.png', dimensions: '200x100x60mm', stock: 1500 },

    // Pavers - 80mm
    { id: 16, name: '80mm Interlocking Grey', category: 'pavers', price: 0.24, unit: 'per piece', colors: ['Grey'], image: '/products/interlocking-paver-new.png', dimensions: '200x100x80mm', stock: 2000 },
    { id: 17, name: '80mm Interlocking Red', category: 'pavers', price: 0.24, unit: 'per piece', colors: ['Red'], image: '/products/interlocking-paver-new.png', dimensions: '200x100x80mm', stock: 1500 },

    // Pavers - 100mm
    { id: 18, name: '100mm Interlocking Grey', category: 'pavers', price: 0.35, unit: 'per piece', colors: ['Grey'], image: '/products/interlocking-paver-new.png', dimensions: '200x100x80mm', stock: 1000 },

    // Blocks
    { id: 20, name: '4.5" Block', category: 'blocks', price: 1.15, unit: 'per block', colors: ['Grey'], image: '/products/concrete-block-new.png', dimensions: '440x115mm', stock: 1200 },
    { id: 21, name: '6" Block', category: 'blocks', price: 1.40, unit: 'per block', colors: ['Grey'], image: '/products/concrete-block-new.png', dimensions: '440x150mm', stock: 1000 },
    { id: 22, name: '9" Block', category: 'blocks', price: 1.90, unit: 'per block', colors: ['Grey'], image: '/products/concrete-block-new.png', dimensions: '440x225mm', stock: 800 },
    { id: 23, name: 'Breeze Block', category: 'blocks', price: 2.00, unit: 'per block', colors: ['Grey'], image: '/products/breeze-block-new.png', dimensions: '300x300mm', stock: 600 },
    { id: 24, name: 'Hex Wall Retaining Block', category: 'blocks', price: 1.90, unit: 'per block', colors: ['Grey'], image: '/products/retaining-wall-block-new.png', dimensions: '420x420mm', stock: 400 },

    // Curbs & Tarphalts
    { id: 30, name: 'Light Domestic Curb', category: 'curbs', price: 2.00, unit: 'per piece', colors: ['Grey'], image: '/products/kerb-curb-new.png', dimensions: '1000x72x230mm', stock: 500 },
    { id: 31, name: 'Tarphalt Edging', category: 'curbs', price: 2.00, unit: 'per piece', colors: ['Grey'], image: '/products/kerb-curb-new.png', dimensions: '500x50x230mm', stock: 400 },
    { id: 32, name: 'Hollow Mountable Curb', category: 'curbs', price: 10.00, unit: 'per piece', colors: ['Grey'], image: '/products/kerb-curb-new.png', dimensions: '1000x150x300mm', stock: 300 },
    { id: 33, name: 'Heavy Industrial Curb', category: 'curbs', price: 14.00, unit: 'per piece', colors: ['Grey'], image: '/products/kerb-curb-new.png', dimensions: '1000x150x300mm', stock: 200 },
    { id: 34, name: 'Light Industrial Curb', category: 'curbs', price: 7.00, unit: 'per piece', colors: ['Grey'], image: '/products/kerb-curb-new.png', dimensions: '1000x150x300mm', stock: 250 },

    // Copings
    { id: 40, name: '4.5 Inch Coping', category: 'copings', price: 2.00, unit: 'per piece', colors: ['Grey'], image: '/products/wall-coping-new.png', dimensions: '115mm', stock: 600 },
    { id: 41, name: '9 Inch Wall Coping', category: 'copings', price: 3.00, unit: 'per piece', colors: ['Grey'], image: '/products/wall-coping-new.png', dimensions: '230mm', stock: 500 },
    { id: 42, name: 'Corner Coping 400x400mm', category: 'copings', price: 4.00, unit: 'per piece', colors: ['Grey'], image: '/products/wall-coping-new.png', dimensions: '400x400mm', stock: 400 },
    { id: 43, name: 'Corner Coping 600x600mm', category: 'copings', price: 6.00, unit: 'per piece', colors: ['Grey', 'Red'], image: '/products/wall-coping-new.png', dimensions: '600x600mm', stock: 300 },
    { id: 44, name: 'Corner Coping 900x900mm', category: 'copings', price: 8.00, unit: 'per piece', colors: ['Grey'], image: '/products/wall-coping-new.png', dimensions: '900x900mm', stock: 200 },

    // Lintels
    { id: 50, name: 'Lintel 1000x115mm', category: 'lintels', price: 5.00, unit: 'per piece', colors: ['Grey'], image: '/products/paving-slab-new.png', dimensions: '1000x115mm', stock: 300 },
];

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, product: Partial<Product>) => void;
    deleteProduct: (id: number) => void;
    getProduct: (id: number) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        setProducts([...products, { ...product, id: newId }]);
    };

    const updateProduct = (id: number, updates: Partial<Product>) => {
        setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const getProduct = (id: number) => {
        return products.find(p => p.id === id);
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                addProduct,
                updateProduct,
                deleteProduct,
                getProduct,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
