'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    orders: number;
    totalSpent: number;
    status: 'active' | 'inactive' | 'vip';
}

const Icons = {
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Plus: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    ),
    Edit: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    ),
    Trash: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    ExternalLink: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
    ),
};

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+263 77 123 4567', address: '123 Main St, Harare', orders: 5, totalSpent: 1540.00, status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+263 71 987 6543', address: '456 Oak Ave, Bulawayo', orders: 2, totalSpent: 450.50, status: 'active' },
        { id: 3, name: 'Construction Co.', email: 'supply@construction.co.zw', phone: '+263 24 789 0123', address: '100 Industrial Zone, Harare', orders: 12, totalSpent: 12500.00, status: 'vip' },
        { id: 4, name: 'Bob Wilson', email: 'bob@builder.com', phone: '+263 77 555 1234', address: '789 Builder Lane, Mutare', orders: 1, totalSpent: 120.00, status: 'inactive' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({});
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const getStatusBadge = (status: Customer['status']) => {
        switch (status) {
            case 'active': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>;
            case 'vip': return <span className={styles.badge} style={{ background: '#f3e8ff', color: '#9333ea' }}>VIP</span>;
            case 'inactive': return <span className={styles.badge} style={{ background: '#f1f5f9', color: '#64748b' }}>Inactive</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const handleAdd = () => {
        setCurrentCustomer({ status: 'active' });
        setShowModal(true);
    };

    const handleEdit = (customer: Customer) => {
        setCurrentCustomer({ ...customer });
        setShowModal(true);
    };

    const handleDelete = (customer: Customer) => {
        setCustomerToDelete(customer);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (customerToDelete) {
            setCustomers(customers.filter(c => c.id !== customerToDelete.id));
        }
        setShowDeleteConfirm(false);
        setCustomerToDelete(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentCustomer.id) {
            setCustomers(customers.map(c => c.id === currentCustomer.id ? { ...c, ...currentCustomer } as Customer : c));
        } else {
            const newId = Math.max(...customers.map(c => c.id), 0) + 1;
            setCustomers([...customers, { ...currentCustomer, id: newId, orders: 0, totalSpent: 0 } as Customer]);
        }
        setShowModal(false);
        setCurrentCustomer({});
    };

    // Stats
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const vipCustomers = customers.filter(c => c.status === 'vip').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

    return (
        <div>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Customers</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{totalCustomers}</p>
                    <span className={styles.statChange}>All registered</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Active</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>{activeCustomers}</p>
                    <span className={styles.statChange}>Active</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>VIP</p>
                        <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#9333ea' }}>{vipCustomers}</p>
                    <span className={styles.statChange}>Top clients</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Revenue</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>$</span>
                        </div>
                    </div>
                    <p className={styles.statValue}>${totalRevenue.toLocaleString()}</p>
                    <span className={styles.statChange}>All customers</span>
                </div>
            </div>

            {/* Customers Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Customers</h2>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>
                        <Icons.Plus /> Add Customer
                    </button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{customer.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{customer.address}</div>
                                    </td>
                                    <td>
                                        <div>{customer.email}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{customer.phone}</div>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/admin/orders?customer=${encodeURIComponent(customer.name)}`}
                                            style={{ color: '#0ea5e9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            {customer.orders} <Icons.ExternalLink />
                                        </Link>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>${customer.totalSpent.toLocaleString()}</td>
                                    <td>{getStatusBadge(customer.status)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className={styles.btn}
                                            style={{ padding: '6px', marginRight: '6px', color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                            onClick={() => handleEdit(customer)}
                                            title="Edit"
                                        >
                                            <Icons.Edit />
                                        </button>
                                        <button
                                            className={styles.btn}
                                            style={{ padding: '6px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fee2e2' }}
                                            onClick={() => handleDelete(customer)}
                                            title="Delete"
                                        >
                                            <Icons.Trash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '500px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{currentCustomer.id ? 'Edit Customer' : 'Add Customer'}</h3>
                            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                                    <label className={styles.label}>Name *</label>
                                    <input
                                        className={styles.input}
                                        value={currentCustomer.name || ''}
                                        onChange={e => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                                        placeholder="Customer name or company"
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email *</label>
                                        <input
                                            className={styles.input}
                                            type="email"
                                            value={currentCustomer.email || ''}
                                            onChange={e => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Phone</label>
                                        <input
                                            className={styles.input}
                                            value={currentCustomer.phone || ''}
                                            onChange={e => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                                            placeholder="+263 77 123 4567"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                                    <label className={styles.label}>Address</label>
                                    <input
                                        className={styles.input}
                                        value={currentCustomer.address || ''}
                                        onChange={e => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                                        placeholder="Full address"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Status</label>
                                    <select
                                        className={styles.select}
                                        value={currentCustomer.status || 'active'}
                                        onChange={e => setCurrentCustomer({ ...currentCustomer, status: e.target.value as Customer['status'] })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="vip">VIP</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                                    {currentCustomer.id ? 'Save Changes' : 'Add Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && customerToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Delete Customer</h3>
                            <button className={styles.modalClose} onClick={() => setShowDeleteConfirm(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ color: '#64748b' }}>
                                Are you sure you want to delete <strong>{customerToDelete.name}</strong>?
                            </p>
                            {customerToDelete.orders > 0 && (
                                <p style={{ color: '#d97706', fontSize: '13px', marginTop: '8px', padding: '8px', background: '#fef3c7', borderRadius: '6px' }}>
                                    ⚠️ This customer has {customerToDelete.orders} orders on record.
                                </p>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </button>
                            <button
                                className={styles.btn}
                                style={{ background: '#dc2626', color: 'white' }}
                                onClick={confirmDelete}
                            >
                                Delete Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
