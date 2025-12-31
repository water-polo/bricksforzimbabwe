'use client';

import Link from 'next/link';
import styles from './admin.module.css';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';

export default function AdminDashboard() {
    const { products } = useProducts();
    const { orders } = useOrders();

    // Product stats
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => (p.stock || 0) < 500 && (p.stock || 0) > 0).length;
    const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;

    // Order stats (from real context)
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'not_started').length;
    const inProgressOrders = orders.filter(o => ['ready_for_delivery', 'scheduled', 'in_transit'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);

    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'not_started': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Not Started</span>;
            case 'ready_for_delivery': return <span className={`${styles.badge} ${styles.badgeInfo}`}>Ready</span>;
            case 'scheduled': return <span className={`${styles.badge} ${styles.badgeInfo}`}>Scheduled</span>;
            case 'in_transit': return <span className={`${styles.badge} ${styles.badgeInfo}`}>In Transit</span>;
            case 'completed': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Completed</span>;
            case 'cancelled': return <span className={`${styles.badge} ${styles.badgeError}`}>Cancelled</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'online': return '🌐';
            case 'walk-in': return '🚶';
            case 'quote': return '📋';
            default: return '📦';
        }
    };

    return (
        <div>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Orders</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                <path d="M3 9h18"></path>
                                <path d="M9 21V9"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{totalOrders}</p>
                    <span className={styles.statChange}>
                        {pendingOrders > 0 && <span style={{ color: '#d97706' }}>{pendingOrders} pending</span>}
                        {pendingOrders === 0 && 'All up to date'}
                    </span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Revenue</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>${totalRevenue.toLocaleString()}</p>
                    <span className={`${styles.statChange} ${styles.changePositive}`}>From {completedOrders} orders</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>In Progress</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                                <path d="M16 8h4l3 3v5h-7V8z"></path>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#2563eb' }}>{inProgressOrders}</p>
                    <span className={styles.statChange}>Being processed</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Low Stock Alerts</p>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: lowStockCount > 0 ? '#d97706' : undefined }}>
                        {lowStockCount}
                    </p>
                    <span className={styles.statChange}>
                        {outOfStockCount > 0 && <span style={{ color: '#dc2626' }}>{outOfStockCount} out of stock</span>}
                        {outOfStockCount === 0 && 'Items need restocking'}
                    </span>
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Recent Orders */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Recent Orders</h2>
                        <Link href="/admin/orders" className={`${styles.btn} ${styles.btnOutline}`} style={{ fontSize: '13px', padding: '6px 12px' }}>
                            View All
                        </Link>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Source</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                                            No orders yet
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td style={{ fontWeight: 500, fontFamily: 'monospace' }}>{order.id}</td>
                                            <td title={order.source}>{getSourceIcon(order.source)}</td>
                                            <td>{order.customerName}</td>
                                            <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                                            <td>{getStatusBadge(order.status)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions & Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Quick Actions */}
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader}>
                            <h2 className={styles.tableTitle}>Quick Actions</h2>
                        </div>
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Link href="/admin/quotations" className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%', justifyContent: 'flex-start', textDecoration: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 10 }}>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                                Create Quotation
                            </Link>
                            <Link href="/admin/orders" className={`${styles.btn} ${styles.btnOutline}`} style={{ width: '100%', justifyContent: 'flex-start', textDecoration: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 10 }}>
                                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                    <path d="M3 9h18"></path>
                                </svg>
                                Process Orders
                            </Link>
                            <Link href="/admin/inventory" className={`${styles.btn} ${styles.btnOutline}`} style={{ width: '100%', justifyContent: 'flex-start', textDecoration: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 10 }}>
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                                Update Inventory
                            </Link>
                            <Link href="/admin/deliveries" className={`${styles.btn} ${styles.btnOutline}`} style={{ width: '100%', justifyContent: 'flex-start', textDecoration: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 10 }}>
                                    <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                                    <path d="M16 8h4l3 3v5h-7V8z"></path>
                                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                </svg>
                                Schedule Delivery
                            </Link>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader}>
                            <h2 className={styles.tableTitle}>Alerts</h2>
                        </div>
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {lowStockCount > 0 && (
                                <Link href="/admin/inventory" style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        padding: '12px',
                                        background: '#fef3c7',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#92400e', margin: 0 }}>Low Stock Warning</p>
                                            <p style={{ fontSize: '12px', color: '#a16207', margin: '4px 0 0' }}>{lowStockCount} products need restocking</p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                            {pendingOrders > 0 && (
                                <Link href="/admin/orders" style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        padding: '12px',
                                        background: '#dbeafe',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1e40af', margin: 0 }}>Pending Orders</p>
                                            <p style={{ fontSize: '12px', color: '#3b82f6', margin: '4px 0 0' }}>{pendingOrders} orders awaiting processing</p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                            {lowStockCount === 0 && pendingOrders === 0 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px',
                                    background: '#dcfce7',
                                    borderRadius: '8px'
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#166534', margin: 0 }}>All Clear</p>
                                        <p style={{ fontSize: '12px', color: '#22c55e', margin: '4px 0 0' }}>No issues to address</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
