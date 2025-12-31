'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

// Mock Data
const MOCK_QUOTATIONS = [
    {
        id: 'QT-2045',
        customer: 'BuildRight Construction',
        email: 'procurement@buildright.co.zw',
        items: 4,
        totalValue: 4500.00,
        status: 'pending',
        date: '2024-12-30',
        project: 'Highlands Office Park'
    },
    {
        id: 'QT-2044',
        customer: 'Sarah Mahlangu',
        email: 's.mahlangu@gmail.com',
        items: 2,
        totalValue: 850.00,
        status: 'sent',
        date: '2024-12-29',
        project: 'Home Renovation'
    },
    {
        id: 'QT-2043',
        customer: 'Devon Engineering',
        email: 'accounts@devon.co.zw',
        items: 12,
        totalValue: 12500.00,
        status: 'accepted',
        date: '2024-12-28',
        project: 'Road Construction Phase 2'
    },
    {
        id: 'QT-2042',
        customer: 'Private Client',
        email: 'client@example.com',
        items: 1,
        totalValue: 150.00,
        status: 'rejected',
        date: '2024-12-27',
        project: 'Driveway'
    },
    {
        id: 'QT-2041',
        customer: 'Apex Developers',
        email: 'info@apexdev.co.zw',
        items: 8,
        totalValue: 6200.00,
        status: 'pending',
        date: '2024-12-27',
        project: 'Housing Complex'
    }
];

export default function QuotationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending Review</span>;
            case 'sent': return <span className={`${styles.badge} ${styles.badgeInfo}`}>Quote Sent</span>;
            case 'accepted': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Accepted</span>;
            case 'rejected': return <span className={`${styles.badge} ${styles.badgeError}`}>Rejected</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const filteredQuotes = MOCK_QUOTATIONS.filter(quote => {
        const matchesSearch =
            quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statLabel}>Pending Requests</h3>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>8</p>
                    <span className={styles.statChange}>Requires attention</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statLabel}>Quotes Sent</h3>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13"></path>
                                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>24</p>
                    <span className={styles.statChange} style={{ color: '#16a34a' }}>+12% this week</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statLabel}>Accepted</h3>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>$45.2k</p>
                    <span className={styles.statChange}>Total value</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statLabel}>Conversion Rate</h3>
                        <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>68%</p>
                    <span className={styles.statChange} style={{ color: '#16a34a' }}>+5% from last month</span>
                </div>
            </div>

            {/* Quotes Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Recent Quotations</h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select
                            className={styles.select}
                            style={{ width: '150px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="sent">Sent</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search quotes..."
                            className={styles.input}
                            style={{ width: '250px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className={`${styles.btn} ${styles.btnPrimary}`}>
                            Create Quote
                        </button>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ref ID</th>
                                <th>Customer</th>
                                <th>Project</th>
                                <th>Items</th>
                                <th>Est. Value</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuotes.map((quote) => (
                                <tr key={quote.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{quote.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{quote.customer}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{quote.email}</div>
                                    </td>
                                    <td>{quote.project}</td>
                                    <td>{quote.items} items</td>
                                    <td style={{ fontWeight: 600 }}>${quote.totalValue.toLocaleString()}</td>
                                    <td>{quote.date}</td>
                                    <td>{getStatusBadge(quote.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className={styles.btn} style={{ padding: '6px', border: '1px solid #e2e8f0' }} title="View Details">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </button>
                                            <button className={styles.btn} style={{ padding: '6px', border: '1px solid #e2e8f0' }} title="Edit">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                        </div>
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
