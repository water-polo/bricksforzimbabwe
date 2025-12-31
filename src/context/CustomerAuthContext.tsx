'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

interface CustomerAuthContextType {
    customer: Customer | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (updates: Partial<Customer>) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// Demo customers database (in real app, this would be in a backend)
const DEMO_CUSTOMERS: { [email: string]: { password: string; customer: Customer } } = {
    'john@example.com': {
        password: 'password123',
        customer: { id: 'C001', name: 'John Doe', email: 'john@example.com', phone: '+263 77 123 4567' }
    },
    'jane@example.com': {
        password: 'password123',
        customer: { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', phone: '+263 77 987 6543' }
    }
};

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if customer is already logged in
        const savedCustomer = localStorage.getItem('bricks-customer');
        if (savedCustomer) {
            setCustomer(JSON.parse(savedCustomer));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const storedCustomers = localStorage.getItem('bricks-customers-db');
        let customersDb = storedCustomers ? JSON.parse(storedCustomers) : DEMO_CUSTOMERS;

        const user = customersDb[email.toLowerCase()];
        if (user && user.password === password) {
            setCustomer(user.customer);
            localStorage.setItem('bricks-customer', JSON.stringify(user.customer));
            return true;
        }
        return false;
    };

    const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const storedCustomers = localStorage.getItem('bricks-customers-db');
        let customersDb = storedCustomers ? JSON.parse(storedCustomers) : { ...DEMO_CUSTOMERS };

        // Check if email already exists
        if (customersDb[email.toLowerCase()]) {
            return false;
        }

        const newCustomer: Customer = {
            id: `C${Date.now()}`,
            name,
            email: email.toLowerCase(),
            phone
        };

        customersDb[email.toLowerCase()] = {
            password,
            customer: newCustomer
        };

        localStorage.setItem('bricks-customers-db', JSON.stringify(customersDb));
        setCustomer(newCustomer);
        localStorage.setItem('bricks-customer', JSON.stringify(newCustomer));
        return true;
    };

    const logout = () => {
        setCustomer(null);
        localStorage.removeItem('bricks-customer');
    };

    const updateProfile = (updates: Partial<Customer>) => {
        if (customer) {
            const updated = { ...customer, ...updates };
            setCustomer(updated);
            localStorage.setItem('bricks-customer', JSON.stringify(updated));
        }
    };

    return (
        <CustomerAuthContext.Provider
            value={{
                customer,
                isAuthenticated: !!customer,
                isLoading,
                login,
                register,
                logout,
                updateProfile
            }}
        >
            {children}
        </CustomerAuthContext.Provider>
    );
}

export function useCustomerAuth() {
    const context = useContext(CustomerAuthContext);
    if (context === undefined) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    }
    return context;
}
