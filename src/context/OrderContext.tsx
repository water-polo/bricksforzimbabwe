'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: CartItem[];
    total: number;
    status: 'not_started' | 'ready_for_delivery' | 'scheduled' | 'in_transit' | 'completed' | 'cancelled';
    source: 'online' | 'walk-in' | 'quote' | 'manual';
    date: string;
    notes?: string;
}

interface OrderContextType {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
    updateOrderStatus: (id: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);

    // Load orders from localStorage
    useEffect(() => {
        const savedOrders = localStorage.getItem('bricks-orders');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        } else {
            // Add some dummy orders for demonstration
            setOrders([
                {
                    id: 'ORD-001',
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                    customerPhone: '+263 77 123 4567',
                    items: [
                        { id: 1, name: 'Common Brick - Red', category: 'bricks', price: 0.15, unit: 'per brick', quantity: 1000, image: '🧱' }
                    ],
                    total: 150.00,
                    status: 'not_started',
                    source: 'online',
                    date: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 'ORD-002',
                    customerName: 'Jane Smith',
                    customerEmail: 'jane@example.com',
                    customerPhone: '+263 71 987 6543',
                    items: [
                        { id: 10, name: 'Interlocking Paver 80mm', category: 'pavers', price: 1.80, unit: 'per piece', quantity: 50, image: '🛤️' }
                    ],
                    total: 90.00,
                    status: 'completed',
                    source: 'walk-in',
                    date: new Date(Date.now() - 172800000).toISOString()
                },
                {
                    id: 'ORD-003',
                    customerName: 'BuildRight Construction',
                    customerEmail: 'orders@buildright.co.zw',
                    customerPhone: '+263 24 123 4567',
                    items: [
                        { id: 5, name: 'Face Brick - Grey', category: 'bricks', price: 0.35, unit: 'per brick', quantity: 5000, image: '🧱' }
                    ],
                    total: 1750.00,
                    status: 'ready_for_delivery',
                    source: 'quote',
                    date: new Date(Date.now() - 43200000).toISOString()
                },
                {
                    id: 'ORD-004',
                    customerName: 'Mike Johnson',
                    customerEmail: 'mike.j@email.com',
                    customerPhone: '+263 77 555 1234',
                    items: [
                        { id: 20, name: 'Standard Block 4.5"', category: 'blocks', price: 0.80, unit: 'per block', quantity: 200, image: '🧱' }
                    ],
                    total: 160.00,
                    status: 'in_transit',
                    source: 'online',
                    date: new Date(Date.now() - 7200000).toISOString()
                }
            ]);
        }
    }, []);

    // Save orders to localStorage
    useEffect(() => {
        if (orders.length > 0) {
            localStorage.setItem('bricks-orders', JSON.stringify(orders));
        }
    }, [orders]);

    const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
        const newOrder: Order = {
            ...orderData,
            id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            date: new Date().toISOString(),
            status: 'not_started'
        };
        setOrders(prev => [newOrder, ...prev]);
    };

    const updateOrderStatus = (id: string, status: Order['status']) => {
        setOrders(prev => prev.map(order =>
            order.id === id ? { ...order, status } : order
        ));
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
