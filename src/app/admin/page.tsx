'use client';

import styles from './admin.module.css';
import { useProducts } from '@/context/ProductContext';

export default function AdminDashboard() {
    const { products } = useProducts();

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter(p => (p.stock || 0) < 500 && (p.stock || 0) > 0).length;

    const recentOrders = [
        { id: 'ORD-1234', customer: 'John Doe', items: 500, total: 125.00, status: 'processing', date: '10 min ago' },
        { id: 'ORD-1235', customer: 'Jane Smith', items: 300, total: 85.50, status: 'pending', date: '25 min ago' },
        { id: 'ORD-1236', customer: 'Bob Johnson', items: 1000, total: 245.00, status: 'delivered', date: '1 hour ago' },
        { id: 'ORD-1237', customer: 'Alice Brown', items: 200, total: 52.00, status: 'processing', date: '2 hours ago' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending</span>;
            case 'processing': return <span className={`${styles.badge} ${styles.badgeInfo}`}>Processing</span>;
            case 'delivered': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Delivered</span>;
            default: return <span className={styles.badge}>{status}</span>;
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
                    <p className={styles.statValue}>156</p>
                    <span className={`${styles.statChange} ${styles.changePositive}`}>▲ 12.5% from last week</span>
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
                    <p className={styles.statValue}>$12,450</p>
                    <span className={`${styles.statChange} ${styles.changePositive}`}>▲ 8.2% from last week</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Products</p>
                        <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{totalProducts}</p>
                    <span className={styles.statChange}>Active in catalog</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Low Stock</p>
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
                    <span className={styles.statChange}>Items need restocking</span>
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Recent Orders */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Recent Orders</h2>
                        <button className={`${styles.btn} ${styles.btnOutline}`} style={{ fontSize: '13px', padding: '6px 12px' }}>
                            View All
                        </button>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: 500, fontFamily: 'monospace' }}>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td style={{ color: '#64748b' }}>{order.items}</td>
                                        <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                                        <td>{getStatusBadge(order.status)}</td>
                                    </tr>
                                ))}
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
                            <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 10 }}>
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add New Product
                            </button>
                            <button className={`${styles.btn} ${styles.btnOutline}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 10 }}>
                                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                    <path d="M3 9h18"></path>
                                </svg>
                                Process Orders
                            </button>
                            <button className={`${styles.btn} ${styles.btnOutline}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 10 }}>
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                                Update Inventory
                            </button>
                            <button className={`${styles.btn} ${styles.btnOutline}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 10 }}>
                                    <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                                    <path d="M16 8h4l3 3v5h-7V8z"></path>
                                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                </svg>
                                Schedule Delivery
                            </button>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader}>
                            <h2 className={styles.tableTitle}>Alerts</h2>
                        </div>
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {lowStockCount > 0 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px',
                                    background: '#fef3c7',
                                    borderRadius: '8px'
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
                            )}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '12px',
                                background: '#dbeafe',
                                borderRadius: '8px'
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#1e40af', margin: 0 }}>Pending Orders</p>
                                    <p style={{ fontSize: '12px', color: '#3b82f6', margin: '4px 0 0' }}>3 orders awaiting processing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
