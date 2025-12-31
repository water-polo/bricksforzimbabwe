'use client';

import styles from '../admin.module.css';

export default function DeliveriesPage() {
    const deliveries = [
        { id: 'DEL001', customer: 'John Doe', address: '123 Main St, Harare', items: 500, status: 'pending', date: '2024-12-30' },
        { id: 'DEL002', customer: 'Jane Smith', address: '456 Oak Ave, Bulawayo', items: 300, status: 'in_transit', date: '2024-12-29' },
        { id: 'DEL003', customer: 'Bob Johnson', address: '789 Pine Rd, Mutare', items: 1000, status: 'delivered', date: '2024-12-28' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending</span>;
            case 'in_transit': return <span className={`${styles.badge} ${styles.badgeInfo}`}>In Transit</span>;
            case 'delivered': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Delivered</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    return (
        <div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Deliveries</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                                <path d="M16 8h4l3 3v5h-7V8z"></path>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{deliveries.length}</p>
                    <span className={styles.statChange}>This month</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Pending</p>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#d97706' }}>
                        {deliveries.filter(d => d.status === 'pending').length}
                    </p>
                    <span className={styles.statChange}>Awaiting dispatch</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>In Transit</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 8 12 12 14 14"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#2563eb' }}>
                        {deliveries.filter(d => d.status === 'in_transit').length}
                    </p>
                    <span className={styles.statChange}>On the way</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Delivered</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>
                        {deliveries.filter(d => d.status === 'delivered').length}
                    </p>
                    <span className={styles.statChange}>Completed</span>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Delivery Schedule</h2>
                    <button className={`${styles.btn} ${styles.btnPrimary}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Schedule Delivery
                    </button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Delivery ID</th>
                                <th>Customer</th>
                                <th>Address</th>
                                <th>Items</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map(delivery => (
                                <tr key={delivery.id}>
                                    <td style={{ fontWeight: 500 }}>{delivery.id}</td>
                                    <td>{delivery.customer}</td>
                                    <td style={{ color: '#64748b' }}>{delivery.address}</td>
                                    <td>{delivery.items}</td>
                                    <td>{delivery.date}</td>
                                    <td>{getStatusBadge(delivery.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
