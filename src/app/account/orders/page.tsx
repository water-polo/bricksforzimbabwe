'use client';

import { useOrders } from '@/context/OrderContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import styles from '../account.module.css';

export default function OrderHistoryPage() {
    const { orders } = useOrders();
    const { customer } = useCustomerAuth();

    // Filter orders for the logged-in customer
    const myOrders = orders.filter(order => order.customerEmail === customer?.email);

    const getStatusBadge = (status: string) => {
        const colors: Record<string, { bg: string; color: string }> = {
            'not_started': { bg: '#fef3c7', color: '#d97706' },
            'ready_for_delivery': { bg: '#dbeafe', color: '#2563eb' },
            'scheduled': { bg: '#dbeafe', color: '#2563eb' },
            'in_transit': { bg: '#f3e8ff', color: '#9333ea' },
            'completed': { bg: '#dcfce7', color: '#16a34a' },
            'cancelled': { bg: '#fee2e2', color: '#dc2626' },
        };
        const style = colors[status] || { bg: '#f1f5f9', color: '#64748b' };

        return (
            <span style={{
                background: style.bg,
                color: style.color,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize'
            }}>
                {status}
            </span>
        );
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>My Orders</h1>
                <p className={styles.pageSubtitle}>View and track your past purchases</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                        </svg>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Orders</span>
                        <span className={styles.statValue}>{myOrders.length}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Delivered</span>
                        <span className={styles.statValue}>{myOrders.filter(o => o.status === 'completed').length}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Pending</span>
                        <span className={styles.statValue}>{myOrders.filter(o => o.status === 'not_started' || o.status === 'ready_for_delivery').length}</span>
                    </div>
                </div>
            </div>

            {myOrders.length === 0 ? (
                <div className={styles.card} style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div style={{
                        width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                        color: '#94a3b8'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>No orders yet</h3>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>Looks like you haven't placed any orders yet.</p>
                    <a href="/products" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Browse Products
                    </a>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myOrders.map(order => (
                        <div key={order.id} className={styles.card} style={{ padding: '0', marginBottom: '0', overflow: 'hidden' }}>
                            <div style={{
                                padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
                            }}>
                                <div style={{ display: 'flex', gap: '24px' }}>
                                    <div>
                                        <span className={styles.label} style={{ fontSize: '11px', textTransform: 'uppercase' }}>Order Placed</span>
                                        <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                                            {new Date(order.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <span className={styles.label} style={{ fontSize: '11px', textTransform: 'uppercase' }}>Total</span>
                                        <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                                            ${order.total.toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className={styles.label} style={{ fontSize: '11px', textTransform: 'uppercase' }}>Order #</span>
                                        <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                                            {order.id}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {getStatusBadge(order.status)}
                                </div>
                            </div>

                            <div style={{ padding: '24px' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', gap: '16px', marginBottom: idx !== order.items.length - 1 ? '16px' : '0',
                                        paddingBottom: idx !== order.items.length - 1 ? '16px' : '0',
                                        borderBottom: idx !== order.items.length - 1 ? '1px solid #f1f5f9' : 'none'
                                    }}>
                                        <div style={{
                                            width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                                        }}>
                                            {item.image.startsWith('/') || item.image.startsWith('http') ? (
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                            ) : (
                                                item.image
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{item.name}</h4>
                                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
