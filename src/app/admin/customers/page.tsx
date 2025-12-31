'use client';

import styles from '../admin.module.css';

const MOCK_CUSTOMERS = [
    { id: 1, name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: 1540.00, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 2, totalSpent: 450.50, status: 'Active' },
    { id: 3, name: 'Construction Co.', email: 'supply@construction.co.zw', orders: 12, totalSpent: 12500.00, status: 'VIP' },
    { id: 4, name: 'Bob Wilson', email: 'bob@builder.com', orders: 1, totalSpent: 120.00, status: 'Inactive' },
];

export default function AdminCustomersPage() {
    return (
        <div>
            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Total Orders</th>
                                <th>Total Spent</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_CUSTOMERS.map(customer => (
                                <tr key={customer.id}>
                                    <td style={{ fontWeight: 500 }}>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.orders}</td>
                                    <td>${customer.totalSpent.toFixed(2)}</td>
                                    <td>
                                        <span className={`${styles.badge} ${customer.status === 'Active' || customer.status === 'VIP' ? styles.badgeSuccess : styles.badgeError}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className={styles.btn} style={{ color: 'var(--primary)' }}>View Details</button>
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
