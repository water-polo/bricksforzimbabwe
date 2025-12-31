'use client';

import { useState, useRef, useEffect } from 'react';
import { useOrders, Order } from '@/context/OrderContext';
import { useProducts } from '@/context/ProductContext';
import styles from '../admin.module.css';

// Icons
const Icons = {
    Delivery: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13" rx="2"></rect>
            <path d="M16 8h4l3 3v5h-7V8z"></path>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
    ),
    Pickup: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.29 7 12 12 20.71 7"></polyline>
            <line x1="12" y1="22" x2="12" y2="12"></line>
        </svg>
    ),
    Online: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    ),
    Search: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    ),
    Calendar: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    ChevronDown: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    ),
    MoreVertical: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
        </svg>
    ),
    Copy: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    ),
    Plus: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    ),
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Eye: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    ),
    Edit: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    ),
    Truck: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13" rx="2"></rect>
            <path d="M16 8h4l3 3v5h-7V8z"></path>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
    ),
    Trash: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    Alert: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    ),
    Orders: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
    ),
};

interface OrderItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

type TabFilter = 'all' | 'pending' | 'preparing' | 'out' | 'fulfilled';

export default function AdminOrdersPage() {
    const { orders, addOrder, updateOrderStatus } = useOrders();
    const { products } = useProducts();
    const [activeTab, setActiveTab] = useState<TabFilter>('all');
    const [sourceFilter, setSourceFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const menuRef = useRef<HTMLDivElement>(null);

    // New order form state
    const [newOrder, setNewOrder] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        notes: '',
        items: [] as OrderItem[],
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate days since order was created
    const getDaysPending = (dateStr: string): number => {
        const orderDate = new Date(dateStr);
        const today = new Date();
        const diffTime = today.getTime() - orderDate.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    // Filter orders based on tab
    const getTabOrders = () => {
        let filtered = [...orders];

        switch (activeTab) {
            case 'pending':
                filtered = filtered.filter(o => o.status === 'not_started');
                break;
            case 'preparing':
                filtered = filtered.filter(o => o.status === 'ready_for_delivery');
                break;
            case 'out':
                filtered = filtered.filter(o => ['scheduled', 'in_transit'].includes(o.status));
                break;
            case 'fulfilled':
                filtered = filtered.filter(o => o.status === 'completed');
                break;
        }

        // Apply source filter
        if (sourceFilter !== 'all') {
            filtered = filtered.filter(o => o.source === sourceFilter);
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(o =>
                o.id.toLowerCase().includes(query) ||
                o.customerName.toLowerCase().includes(query) ||
                o.customerEmail.toLowerCase().includes(query)
            );
        }

        // Apply date filter
        if (dateFilter) {
            filtered = filtered.filter(o => o.date.startsWith(dateFilter));
        }

        return filtered;
    };

    const filteredOrders = getTabOrders();

    // Count orders per tab
    const tabCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'not_started').length,
        preparing: orders.filter(o => o.status === 'ready_for_delivery').length,
        out: orders.filter(o => ['scheduled', 'in_transit'].includes(o.status)).length,
        fulfilled: orders.filter(o => o.status === 'completed').length,
    };

    // Stats
    const deliveryCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
    const pickupCount = orders.filter(o => o.source === 'walk-in').length;
    const unassignedCount = orders.filter(o => o.status === 'not_started').length;

    // Get status badge
    const getStatusBadge = (status: Order['status']) => {
        const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
            'not_started': { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
            'ready_for_delivery': { bg: '#e0e7ff', color: '#4f46e5', label: 'Preparing' },
            'scheduled': { bg: '#dbeafe', color: '#2563eb', label: 'Scheduled' },
            'in_transit': { bg: '#cffafe', color: '#0891b2', label: 'Out' },
            'completed': { bg: '#dcfce7', color: '#16a34a', label: 'Fulfilled' },
            'cancelled': { bg: '#fee2e2', color: '#dc2626', label: 'Cancelled' },
        };
        const config = statusConfig[status] || { bg: '#f1f5f9', color: '#64748b', label: status || 'Unknown' };
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                background: config.bg,
                color: config.color,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: config.color }}></span>
                {config.label}
            </span>
        );
    };

    // Get customer initials for avatar
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Get avatar color based on name
    const getAvatarColor = (name: string) => {
        const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
        const index = name.length % colors.length;
        return colors[index];
    };

    // Handle checkbox toggle
    const toggleOrder = (orderId: string) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const toggleAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    // Handle add item to order
    const handleAddItem = () => {
        setNewOrder(prev => ({
            ...prev,
            items: [...prev.items, { productId: 0, name: '', price: 0, quantity: 1 }]
        }));
    };

    const handleRemoveItem = (index: number) => {
        setNewOrder(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, productId: number) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setNewOrder(prev => {
                const items = [...prev.items];
                items[index] = {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: items[index].quantity || 1
                };
                return { ...prev, items };
            });
        }
    };

    const handleQuantityChange = (index: number, quantity: number) => {
        setNewOrder(prev => {
            const items = [...prev.items];
            items[index] = { ...items[index], quantity };
            return { ...prev, items };
        });
    };

    const calculateTotal = () => {
        return newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCreateOrder = () => {
        const cartItems = newOrder.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                id: item.productId,
                name: item.name,
                category: product?.category || 'bricks',
                price: item.price,
                unit: product?.unit || 'per unit',
                quantity: item.quantity,
                image: product?.image || ''
            };
        });

        addOrder({
            customerName: newOrder.customerName,
            customerEmail: newOrder.customerEmail,
            customerPhone: newOrder.customerPhone,
            items: cartItems,
            total: calculateTotal(),
            source: 'manual',
            notes: newOrder.notes
        });

        setShowCreateModal(false);
        setNewOrder({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            notes: '',
            items: [],
        });
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Order Management Overview
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                    Real-time monitoring of all orders, pickups, and deliveries.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '32px'
            }}>
                {/* Deliveries */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deliveries</p>
                        <p style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b' }}>{deliveryCount}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Active delivery orders</p>
                    </div>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: '#dcfce7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#16a34a'
                    }}>
                        <Icons.Delivery />
                    </div>
                </div>

                {/* Pickups */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pickups</p>
                        <p style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b' }}>{pickupCount}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Scheduled pickups</p>
                    </div>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: '#dbeafe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563eb'
                    }}>
                        <Icons.Pickup />
                    </div>
                </div>

                {/* Unassigned */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unassigned</p>
                        <p style={{ fontSize: '28px', fontWeight: 600, color: unassignedCount > 0 ? '#d97706' : '#1e293b' }}>{unassignedCount}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Needs assignment</p>
                    </div>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: '#fef3c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d97706'
                    }}>
                        <Icons.Alert />
                    </div>
                </div>

                {/* Total Orders */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</p>
                        <p style={{ fontSize: '28px', fontWeight: 600, color: '#1e293b' }}>{orders.length}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>All-time orders</p>
                    </div>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b'
                    }}>
                        <Icons.Orders />
                    </div>
                </div>
            </div>

            {/* Order Management Section */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
            }}>
                {/* Section Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '2px' }}>Order Management</h2>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Track and oversee all customer transactions</p>
                    </div>
                    <button
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            borderRadius: '8px'
                        }}
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Icons.Plus /> Create Manual Order
                    </button>
                </div>

                {/* Filter Tabs */}
                <div style={{
                    padding: '0 24px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '0' }}>
                        {[
                            { key: 'all', label: 'All Orders' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'preparing', label: 'Preparing' },
                            { key: 'out', label: 'Out' },
                            { key: 'fulfilled', label: 'Fulfilled' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as TabFilter)}
                                style={{
                                    padding: '14px 16px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: activeTab === tab.key ? '2px solid #16a34a' : '2px solid transparent',
                                    color: activeTab === tab.key ? '#16a34a' : '#64748b',
                                    fontWeight: activeTab === tab.key ? 600 : 400,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                                <span style={{
                                    background: activeTab === tab.key ? '#dcfce7' : '#f1f5f9',
                                    color: activeTab === tab.key ? '#16a34a' : '#64748b',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                    fontWeight: 500
                                }}>
                                    {tabCounts[tab.key as TabFilter]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Filter Controls */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {/* Source Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <select
                                value={sourceFilter}
                                onChange={(e) => setSourceFilter(e.target.value)}
                                style={{
                                    appearance: 'none',
                                    padding: '8px 32px 8px 12px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#475569',
                                    background: 'white',
                                    cursor: 'pointer',
                                    minWidth: '100px'
                                }}
                            >
                                <option value="all">Source</option>
                                <option value="online">Online</option>
                                <option value="walk-in">Walk-in</option>
                                <option value="quote">Quote</option>
                                <option value="manual">Manual</option>
                            </select>
                            <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
                                <Icons.ChevronDown />
                            </div>
                        </div>

                        {/* Date Picker */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#475569',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '8px 12px 8px 36px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#475569',
                                    background: 'white',
                                    width: '180px'
                                }}
                            />
                            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <Icons.Search />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#fafbfc' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                        onChange={toggleAll}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase' }}>#</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase' }}>Customer</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase' }}>Type</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase' }}>Items</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase' }}>Cost</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 500, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, index) => {
                                const days = getDaysPending(order.date);
                                const isUrgent = order.status === 'not_started' && days > 3;

                                return (
                                    <tr
                                        key={order.id}
                                        style={{
                                            borderBottom: '1px solid #f1f5f9',
                                            background: isUrgent ? '#fef2f2' : 'white'
                                        }}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => toggleOrder(order.id)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                            />
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '13px' }}>{order.id.replace('ORD-', '')}</span>
                                                {days > 0 && order.status === 'not_started' && (
                                                    <span style={{
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '10px',
                                                        fontWeight: 500,
                                                        background: days > 3 ? '#fee2e2' : '#fef3c7',
                                                        color: days > 3 ? '#dc2626' : '#d97706'
                                                    }}>
                                                        +{days}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    background: getAvatarColor(order.customerName),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 600
                                                }}>
                                                    {getInitials(order.customerName)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500, fontSize: '14px', color: '#1e293b' }}>{order.customerName}</div>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{order.customerEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                background: order.source === 'walk-in' ? '#dbeafe' : '#dcfce7',
                                                color: order.source === 'walk-in' ? '#2563eb' : '#16a34a'
                                            }}>
                                                {order.source === 'walk-in' ? <Icons.Pickup /> : <Icons.Delivery />}
                                                {order.source === 'walk-in' ? 'Pickup' : 'Delivery'}
                                            </span>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase' }}>
                                                {order.source}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '13px', color: '#64748b' }}>
                                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>${order.total.toFixed(2)}</span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                <button
                                                    style={{
                                                        padding: '6px',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '6px',
                                                        background: 'white',
                                                        cursor: 'pointer',
                                                        color: '#64748b'
                                                    }}
                                                    title="Copy Order ID"
                                                >
                                                    <Icons.Copy />
                                                </button>
                                                <div style={{ position: 'relative' }}>
                                                    <button
                                                        style={{
                                                            padding: '6px',
                                                            border: '1px solid #e2e8f0',
                                                            borderRadius: '6px',
                                                            background: openMenuId === order.id ? '#f1f5f9' : 'white',
                                                            cursor: 'pointer',
                                                            color: '#64748b'
                                                        }}
                                                        onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                                                    >
                                                        <Icons.MoreVertical />
                                                    </button>

                                                    {openMenuId === order.id && (
                                                        <div
                                                            ref={menuRef}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '100%',
                                                                right: 0,
                                                                marginTop: '4px',
                                                                background: 'white',
                                                                border: '1px solid #e2e8f0',
                                                                borderRadius: '8px',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                zIndex: 100,
                                                                minWidth: '160px',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <button
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    width: '100%',
                                                                    padding: '10px 14px',
                                                                    border: 'none',
                                                                    background: 'transparent',
                                                                    cursor: 'pointer',
                                                                    fontSize: '13px',
                                                                    color: '#475569',
                                                                    textAlign: 'left'
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                            >
                                                                <Icons.Eye /> View Details
                                                            </button>
                                                            <button
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    width: '100%',
                                                                    padding: '10px 14px',
                                                                    border: 'none',
                                                                    background: 'transparent',
                                                                    cursor: 'pointer',
                                                                    fontSize: '13px',
                                                                    color: '#475569',
                                                                    textAlign: 'left'
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                            >
                                                                <Icons.Edit /> Edit Order
                                                            </button>
                                                            <button
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    width: '100%',
                                                                    padding: '10px 14px',
                                                                    border: 'none',
                                                                    background: 'transparent',
                                                                    cursor: 'pointer',
                                                                    fontSize: '13px',
                                                                    color: '#475569',
                                                                    textAlign: 'left'
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                            >
                                                                <Icons.Truck /> Assign Driver
                                                            </button>
                                                            <div style={{ borderTop: '1px solid #f1f5f9' }}></div>
                                                            <button
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    width: '100%',
                                                                    padding: '10px 14px',
                                                                    border: 'none',
                                                                    background: 'transparent',
                                                                    cursor: 'pointer',
                                                                    fontSize: '13px',
                                                                    color: '#dc2626',
                                                                    textAlign: 'left'
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                                                onClick={() => {
                                                                    updateOrderStatus(order.id, 'cancelled');
                                                                    setOpenMenuId(null);
                                                                }}
                                                            >
                                                                <Icons.Trash /> Cancel Order
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Action color indicator */}
                                                <div style={{
                                                    width: '4px',
                                                    height: '32px',
                                                    borderRadius: '2px',
                                                    background: order.status === 'not_started' ? '#d97706' :
                                                        order.status === 'completed' ? '#16a34a' :
                                                            order.status === 'cancelled' ? '#dc2626' : '#3b82f6'
                                                }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                            <Icons.Orders />
                            <p style={{ marginTop: '12px' }}>No orders found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Order Modal */}
            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '650px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Create Manual Order</h3>
                            <button className={styles.modalClose} onClick={() => setShowCreateModal(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {/* Customer Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Customer Name *</label>
                                    <input
                                        className={styles.input}
                                        value={newOrder.customerName}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, customerName: e.target.value }))}
                                        placeholder="Full name"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email *</label>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        value={newOrder.customerEmail}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, customerEmail: e.target.value }))}
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone</label>
                                    <input
                                        className={styles.input}
                                        value={newOrder.customerPhone}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
                                        placeholder="+263 77 123 4567"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Notes</label>
                                    <input
                                        className={styles.input}
                                        value={newOrder.notes}
                                        onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Order notes..."
                                    />
                                </div>
                            </div>

                            {/* Products */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label className={styles.label} style={{ marginBottom: 0 }}>Products *</label>
                                    <button
                                        className={`${styles.btn} ${styles.btnOutline}`}
                                        onClick={handleAddItem}
                                        style={{ padding: '6px 12px', fontSize: '13px' }}
                                    >
                                        <Icons.Plus /> Add Product
                                    </button>
                                </div>

                                {newOrder.items.length === 0 ? (
                                    <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8' }}>
                                        No products added. Click "Add Product" to add items.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {newOrder.items.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <select
                                                    className={styles.select}
                                                    style={{ flex: 2 }}
                                                    value={item.productId}
                                                    onChange={(e) => handleItemChange(index, parseInt(e.target.value))}
                                                >
                                                    <option value={0}>Select product...</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    className={styles.input}
                                                    type="number"
                                                    min="1"
                                                    style={{ width: '100px' }}
                                                    placeholder="Qty"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                                />
                                                <span style={{ width: '80px', textAlign: 'right', fontWeight: 500 }}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveItem(index)}
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                                                >
                                                    <Icons.Trash />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            {newOrder.items.length > 0 && (
                                <div style={{
                                    padding: '16px',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontWeight: 500 }}>Order Total:</span>
                                    <span style={{ fontSize: '20px', fontWeight: 600, color: '#16a34a' }}>
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    onClick={handleCreateOrder}
                                    disabled={!newOrder.customerName || !newOrder.customerEmail || newOrder.items.length === 0}
                                >
                                    Create Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
