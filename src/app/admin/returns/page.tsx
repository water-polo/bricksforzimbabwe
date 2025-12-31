'use client';

import styles from '../admin.module.css';

export default function ReturnsPage() {
    const returns = [
        { id: 'RET001', orderId: 'ORD-1234', customer: 'John Doe', items: 50, reason: 'Damaged in transit', status: 'pending', date: '2024-12-28' },
        { id: 'RET002', orderId: 'ORD-1235', customer: 'Jane Smith', items: 20, reason: 'Wrong product', status: 'approved', date: '2024-12-27' },
        { id: 'RET003', orderId: 'ORD-1236', customer: 'Bob Johnson', items: 100, reason: 'Quality issue', status: 'processed', date: '2024-12-26' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending Review</span>;
            case 'approved': return <span className={`${styles.badge} ${styles.badgeInfo}`}>Approved</span>;
            case 'processed': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Processed</span>;
            case 'rejected': return <span className={`${styles.badge} ${styles.badgeError}`}>Rejected</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    return (
        <div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Returns</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{returns.length}</p>
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
                        {returns.filter(r => r.status === 'pending').length}
                    </p>
                    <span className={styles.statChange}>Awaiting review</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Approved</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{returns.filter(r => r.status === 'approved').length}</p>
                    <span className={styles.statChange}>Ready to process</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Processed</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>
                        {returns.filter(r => r.status === 'processed').length}
                    </p>
                    <span className={styles.statChange}>Completed</span>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Return Requests</h2>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Return ID</th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.map(ret => (
                                <tr key={ret.id}>
                                    <td style={{ fontWeight: 500 }}>{ret.id}</td>
                                    <td style={{ color: '#64748b' }}>{ret.orderId}</td>
                                    <td>{ret.customer}</td>
                                    <td>{ret.items}</td>
                                    <td style={{ color: '#64748b', fontSize: '13px' }}>{ret.reason}</td>
                                    <td>{getStatusBadge(ret.status)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {ret.status === 'pending' && (
                                            <>
                                                <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '6px 12px', fontSize: '12px', marginRight: '6px' }}>
                                                    Approve
                                                </button>
                                                <button className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: '6px 12px', fontSize: '12px', color: '#dc2626' }}>
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
