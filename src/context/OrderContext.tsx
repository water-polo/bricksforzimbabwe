'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
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
                    items: [
                        { id: 1, name: 'Common Brick - Red', category: 'bricks', price: 0.15, unit: 'per brick', quantity: 1000, image: '🧱' }
                    ],
                    total: 150.00,
                    status: 'pending',
                    date: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 'ORD-002',
                    customerName: 'Jane Smith',
                    customerEmail: 'jane@example.com',
                    items: [
                        { id: 10, name: 'Interlocking Paver 80mm', category: 'pavers', price: 1.80, unit: 'per piece', quantity: 50, image: '🛤️' }
                    ],
                    total: 90.00,
                    status: 'delivered',
                    date: new Date(Date.now() - 172800000).toISOString()
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
            status: 'pending'
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
