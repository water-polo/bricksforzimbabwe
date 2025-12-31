'use client';

import { useOrders } from '@/context/OrderContext';
import styles from '../admin.module.css';

export default function AdminOrdersPage() {
    const { orders, updateOrderStatus } = useOrders();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return styles.badgeWarning;
            case 'processing': return styles.badgeInfo;
            case 'shipped': return styles.badgeInfo;
            case 'delivered': return styles.badgeSuccess;
            case 'cancelled': return styles.badgeError;
            default: return styles.badgeInfo;
        }
    };

    return (
        <div>
            <div className={styles.tableCard}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td style={{ fontWeight: 500 }}>{order.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{order.customerEmail}</div>
                                    </td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`${styles.badge} ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className={styles.select}
                                            style={{ width: 'auto', padding: '6px' }}
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
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
