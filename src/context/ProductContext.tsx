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
    { id: 1, name: 'Common Brick - Red', category: 'bricks', price: 0.15, unit: 'per brick', colors: ['Red'], image: '/products/common-brick-red.png', stock: 10000 },
    { id: 2, name: 'Common Brick - Black', category: 'bricks', price: 0.18, unit: 'per brick', colors: ['Black'], image: '/products/common-brick-black.png', stock: 5000 },
    { id: 3, name: 'Common Brick - Yellow', category: 'bricks', price: 0.18, unit: 'per brick', colors: ['Yellow'], image: '/products/common-brick-yellow.png', stock: 5000 },
    { id: 4, name: 'Common Brick - Tan', category: 'bricks', price: 0.18, unit: 'per brick', colors: ['Tan'], image: '/products/common-brick-yellow.png', stock: 5000 },
    { id: 5, name: 'Face Brick - Grey', category: 'bricks', price: 0.35, unit: 'per brick', colors: ['Grey'], image: '/products/face-brick.png', stock: 8000 },
    { id: 6, name: 'Load Bearing Brick', category: 'bricks', price: 0.25, unit: 'per brick', colors: ['Grey'], image: '/products/face-brick.png', stock: 6000 },
    { id: 7, name: 'Hollow Maxi Brick', category: 'bricks', price: 0.40, unit: 'per brick', colors: ['Grey'], image: '/products/hollow-block.png', stock: 4000 },

    // Pavers
    { id: 10, name: 'Interlocking Paver 80mm', category: 'pavers', price: 1.80, unit: 'per piece', colors: ['Grey', 'Red', 'Black'], image: '/products/interlocking-paver.png', stock: 2000 },
    { id: 11, name: 'Interlocking Paver 60mm', category: 'pavers', price: 1.50, unit: 'per piece', colors: ['Grey', 'Red', 'Black'], image: '/products/interlocking-paver.png', stock: 2500 },
    { id: 12, name: 'Rectangular Paver 60mm', category: 'pavers', price: 1.40, unit: 'per piece', colors: ['Grey', 'Red'], image: '/products/interlocking-paver.png', stock: 3000 },
    { id: 13, name: '3D Paver', category: 'pavers', price: 2.00, unit: 'per piece', colors: ['Grey', 'Red', 'Black'], image: '/products/interlocking-paver.png', stock: 1500 },
    { id: 14, name: 'Cobble Paver', category: 'pavers', price: 1.60, unit: 'per piece', colors: ['Grey', 'Red'], image: '/products/cobble-paver.png', stock: 2200 },

    // Blocks
    { id: 20, name: 'Standard Block 4.5"', category: 'blocks', price: 0.80, unit: 'per block', colors: ['Grey'], image: '/products/concrete-block.png', stock: 1200 },
    { id: 21, name: 'Standard Block 6"', category: 'blocks', price: 1.00, unit: 'per block', colors: ['Grey'], image: '/products/concrete-block.png', stock: 1000 },
    { id: 22, name: 'Standard Block 9"', category: 'blocks', price: 1.50, unit: 'per block', colors: ['Grey'], image: '/products/concrete-block.png', stock: 800 },
    { id: 23, name: 'Breeze Block', category: 'blocks', price: 1.20, unit: 'per block', colors: ['Grey', 'Red', 'Black'], image: '/products/breeze-block.png', stock: 600 },
    { id: 24, name: 'D-Shape Retaining Wall Block', category: 'blocks', price: 3.50, unit: 'per block', colors: ['Grey'], image: '/products/retaining-wall-block.png', stock: 400 },

    // Slabs
    { id: 30, name: 'Paving Slab 450x450mm', category: 'slabs', price: 3.00, unit: 'per slab', colors: ['Grey', 'Red'], image: '/products/paving-slab.png', stock: 300 },
    { id: 31, name: 'Paving Slab 500x500mm', category: 'slabs', price: 3.50, unit: 'per slab', colors: ['Grey', 'Red'], image: '/products/paving-slab.png', stock: 250 },
    { id: 32, name: 'Paving Slab 600x600mm', category: 'slabs', price: 4.50, unit: 'per slab', colors: ['Grey', 'Red'], image: '/products/paving-slab.png', stock: 200 },
    { id: 33, name: 'Granite Slab', category: 'slabs', price: 8.00, unit: 'per slab', colors: ['Various'], image: '/products/paving-slab.png', stock: 100 },
    { id: 34, name: 'Polished Slab', category: 'slabs', price: 10.00, unit: 'per slab', colors: ['Various'], image: '/products/paving-slab.png', stock: 80 },

    // Curbs & Copings
    { id: 40, name: 'Domestic Kerb', category: 'curbs', price: 2.50, unit: 'per piece', colors: ['Grey'], image: '/products/kerb-curb.png', stock: 500 },
    { id: 41, name: 'Industrial Kerb', category: 'curbs', price: 4.00, unit: 'per piece', colors: ['Grey'], image: '/products/kerb-curb.png', stock: 300 },
    { id: 42, name: 'Mountable Kerb', category: 'curbs', price: 3.00, unit: 'per piece', colors: ['Grey'], image: '/products/kerb-curb.png', stock: 400 },
    { id: 43, name: 'Wall Coping 115mm', category: 'curbs', price: 2.00, unit: 'per piece', colors: ['Grey'], image: '/products/wall-coping.png', stock: 600 },
    { id: 44, name: 'Wall Coping 230mm', category: 'curbs', price: 3.00, unit: 'per piece', colors: ['Grey'], image: '/products/wall-coping.png', stock: 500 },
    { id: 45, name: 'Corner Coping', category: 'curbs', price: 3.50, unit: 'per piece', colors: ['Grey'], image: '/products/wall-coping.png', stock: 500 },
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
