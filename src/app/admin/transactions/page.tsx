'use client';

import styles from '../admin.module.css';

export default function TransactionsPage() {
    const transactions = [
        { id: 'TXN001', type: 'sale', description: 'Order #ORD-1234', amount: 1250.00, status: 'completed', date: '2024-12-30 10:24' },
        { id: 'TXN002', type: 'refund', description: 'Return #RET-001', amount: -150.00, status: 'completed', date: '2024-12-29 14:30' },
        { id: 'TXN003', type: 'sale', description: 'Order #ORD-1235', amount: 850.00, status: 'pending', date: '2024-12-29 09:15' },
        { id: 'TXN004', type: 'sale', description: 'Order #ORD-1236', amount: 2100.00, status: 'completed', date: '2024-12-28 16:45' },
        { id: 'TXN005', type: 'expense', description: 'Fuel for deliveries', amount: -320.00, status: 'completed', date: '2024-12-28 08:00' },
    ];

    const totalRevenue = transactions.filter(t => t.type === 'sale' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const totalRefunds = Math.abs(transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0));
    const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'sale': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Sale</span>;
            case 'refund': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Refund</span>;
            case 'expense': return <span className={`${styles.badge}`} style={{ background: '#f1f5f9', color: '#64748b' }}>Expense</span>;
            default: return <span className={styles.badge}>{type}</span>;
        }
    };

    return (
        <div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Revenue</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>${totalRevenue.toFixed(2)}</p>
                    <span className={styles.statChange}>This month</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Refunds</p>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#d97706' }}>${totalRefunds.toFixed(2)}</p>
                    <span className={styles.statChange}>Returned</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Expenses</p>
                        <div className={styles.statIcon} style={{ background: '#fee2e2', color: '#dc2626' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#dc2626' }}>${totalExpenses.toFixed(2)}</p>
                    <span className={styles.statChange}>Outgoing</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Net Profit</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>${(totalRevenue - totalRefunds - totalExpenses).toFixed(2)}</p>
                    <span className={`${styles.statChange} ${styles.changePositive}`}>+12.5% from last month</span>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Recent Transactions</h2>
                    <button className={`${styles.btn} ${styles.btnOutline}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export
                    </button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(txn => (
                                <tr key={txn.id}>
                                    <td style={{ fontWeight: 500, fontFamily: 'monospace' }}>{txn.id}</td>
                                    <td>{getTypeBadge(txn.type)}</td>
                                    <td style={{ color: '#64748b' }}>{txn.description}</td>
                                    <td style={{
                                        fontWeight: 600,
                                        color: txn.amount >= 0 ? '#16a34a' : '#dc2626'
                                    }}>
                                        {txn.amount >= 0 ? '+' : ''}${txn.amount.toFixed(2)}
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '13px' }}>{txn.date}</td>
                                    <td>
                                        {txn.status === 'completed' ? (
                                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>Completed</span>
                                        ) : (
                                            <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending</span>
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
