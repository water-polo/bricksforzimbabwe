'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

// Types
interface Return {
    id: string;
    orderId: string;
    customer: string;
    customerEmail: string;
    productName: string;
    quantity: number;
    reason: 'damaged' | 'wrong_product' | 'quality_issue' | 'customer_change' | 'other';
    reasonDetails: string;
    status: 'pending' | 'approved' | 'rejected' | 'processed_stock' | 'processed_damaged';
    rejectionReason?: string;
    date: string;
}

// Mock Data
const MOCK_RETURNS: Return[] = [
    {
        id: 'RET001', orderId: 'ORD-001', customer: 'John Doe', customerEmail: 'john@example.com',
        productName: 'Common Brick - Red', quantity: 50, reason: 'damaged',
        reasonDetails: 'Bricks arrived with chips and cracks', status: 'pending', date: '2024-12-28'
    },
    {
        id: 'RET002', orderId: 'ORD-002', customer: 'Jane Smith', customerEmail: 'jane@example.com',
        productName: 'Interlocking Paver 80mm', quantity: 20, reason: 'wrong_product',
        reasonDetails: 'Ordered 60mm, received 80mm', status: 'approved', date: '2024-12-27'
    },
    {
        id: 'RET003', orderId: 'ORD-003', customer: 'Bob Johnson', customerEmail: 'bob@example.com',
        productName: 'Face Brick - Grey', quantity: 100, reason: 'quality_issue',
        reasonDetails: 'Color inconsistency across batch', status: 'processed_damaged', date: '2024-12-26'
    },
    {
        id: 'RET004', orderId: 'ORD-004', customer: 'BuildRight Construction', customerEmail: 'orders@buildright.co.zw',
        productName: 'Standard Block 6"', quantity: 30, reason: 'customer_change',
        reasonDetails: 'Project cancelled', status: 'processed_stock', date: '2024-12-25'
    },
];

const REASON_LABELS: Record<Return['reason'], string> = {
    'damaged': 'Damaged in Transit',
    'wrong_product': 'Wrong Product',
    'quality_issue': 'Quality Issue',
    'customer_change': 'Customer Changed Mind',
    'other': 'Other',
};

// Icons
const Icons = {
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    AlertTriangle: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
    Check: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    X: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Package: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
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

export default function ReturnsPage() {
    const [returns, setReturns] = useState<Return[]>(MOCK_RETURNS);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const getStatusBadge = (status: Return['status']) => {
        switch (status) {
            case 'pending': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending Review</span>;
            case 'approved': return <span className={`${styles.badge} ${styles.badgeInfo}`}>Approved</span>;
            case 'rejected': return <span className={`${styles.badge} ${styles.badgeError}`}>Rejected</span>;
            case 'processed_stock': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Returned to Stock</span>;
            case 'processed_damaged': return <span className={styles.badge} style={{ background: '#fce7f3', color: '#be185d' }}>Damaged Inventory</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const handleApprove = (returnId: string) => {
        setReturns(prev => prev.map(r =>
            r.id === returnId ? { ...r, status: 'approved' as const } : r
        ));
    };

    const handleReject = () => {
        if (!selectedReturn) return;
        setReturns(prev => prev.map(r =>
            r.id === selectedReturn.id ? { ...r, status: 'rejected' as const, rejectionReason } : r
        ));
        setShowRejectModal(false);
        setSelectedReturn(null);
        setRejectionReason('');
    };

    const handleProcess = (returnId: string, destination: 'stock' | 'damaged') => {
        setReturns(prev => prev.map(r =>
            r.id === returnId ? {
                ...r,
                status: destination === 'stock' ? 'processed_stock' as const : 'processed_damaged' as const
            } : r
        ));
        setShowApproveModal(false);
        setSelectedReturn(null);
    };

    const pendingCount = returns.filter(r => r.status === 'pending').length;
    const approvedCount = returns.filter(r => r.status === 'approved').length;
    const processedCount = returns.filter(r => r.status.startsWith('processed')).length;
    const damagedCount = returns.filter(r => r.status === 'processed_damaged').length;

    return (
        <div>
            {/* Stats */}
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
                        <p className={styles.statLabel}>Pending Review</p>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#d97706' }}>{pendingCount}</p>
                    <span className={styles.statChange}>Awaiting decision</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Processed</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <Icons.Check />
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>{processedCount}</p>
                    <span className={styles.statChange}>Completed</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Damaged</p>
                        <div className={styles.statIcon} style={{ background: '#fce7f3', color: '#be185d' }}>
                            <Icons.AlertTriangle />
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#be185d' }}>{damagedCount}</p>
                    <span className={styles.statChange}>In damaged inventory</span>
                </div>
            </div>

            {/* Returns Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Return Requests</h2>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Return ID</th>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.map(ret => (
                                <tr key={ret.id}>
                                    <td style={{ fontWeight: 500 }}>{ret.id}</td>
                                    <td>
                                        <a
                                            href={`/admin/orders`}
                                            style={{
                                                color: '#0ea5e9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {ret.orderId}
                                            <Icons.ExternalLink />
                                        </a>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{ret.customer}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{ret.customerEmail}</div>
                                    </td>
                                    <td>{ret.productName}</td>
                                    <td>
                                        <span className={styles.badge} style={{ background: '#f1f5f9', color: '#475569' }}>
                                            {ret.quantity}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px' }}>{REASON_LABELS[ret.reason]}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ret.reasonDetails}>
                                            {ret.reasonDetails}
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(ret.status)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {ret.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                <button
                                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    onClick={() => handleApprove(ret.id)}
                                                >
                                                    <Icons.Check /> Approve
                                                </button>
                                                <button
                                                    className={`${styles.btn} ${styles.btnOutline}`}
                                                    style={{ padding: '6px 12px', fontSize: '12px', color: '#dc2626' }}
                                                    onClick={() => { setSelectedReturn(ret); setShowRejectModal(true); }}
                                                >
                                                    <Icons.X /> Reject
                                                </button>
                                            </div>
                                        )}
                                        {ret.status === 'approved' && (
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                <button
                                                    className={`${styles.btn} ${styles.btnOutline}`}
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    onClick={() => handleProcess(ret.id, 'stock')}
                                                >
                                                    <Icons.Package /> To Stock
                                                </button>
                                                <button
                                                    className={`${styles.btn}`}
                                                    style={{ padding: '6px 12px', fontSize: '12px', background: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8' }}
                                                    onClick={() => handleProcess(ret.id, 'damaged')}
                                                >
                                                    <Icons.AlertTriangle /> To Damaged
                                                </button>
                                            </div>
                                        )}
                                        {ret.status === 'rejected' && ret.rejectionReason && (
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }} title={ret.rejectionReason}>
                                                Reason: {ret.rejectionReason.substring(0, 20)}...
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && selectedReturn && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Reject Return</h3>
                            <button className={styles.modalClose} onClick={() => { setShowRejectModal(false); setSelectedReturn(null); }}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ marginBottom: '16px', color: '#64748b' }}>
                                Return: <strong>{selectedReturn.id}</strong><br />
                                Customer: <strong>{selectedReturn.customer}</strong><br />
                                Product: <strong>{selectedReturn.productName}</strong>
                            </p>
                            <div>
                                <label className={styles.label}>Reason for Rejection *</label>
                                <textarea
                                    className={styles.input}
                                    style={{ minHeight: '100px', resize: 'vertical' }}
                                    placeholder="Enter reason for rejecting this return request..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => { setShowRejectModal(false); setSelectedReturn(null); }}>
                                Cancel
                            </button>
                            <button
                                className={`${styles.btn}`}
                                style={{ background: '#dc2626', color: 'white' }}
                                onClick={handleReject}
                                disabled={!rejectionReason.trim()}
                            >
                                Reject Return
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
