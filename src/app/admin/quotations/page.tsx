'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../admin.module.css';
import { useProducts, Product } from '@/context/ProductContext';

// Types
interface QuotationItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
}

interface Quotation {
    id: string;
    customer: string;
    email: string;
    phone: string;
    items: QuotationItem[];
    pickupPrice: number;
    deliveryPrice: number;
    discount: number;
    status: 'draft' | 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired';
    preferredContact: 'email' | 'whatsapp' | 'sms' | 'phone';
    date: string;
    expiryDate: string;
    project: string;
}

// Mock Data
const MOCK_QUOTATIONS: Quotation[] = [
    {
        id: 'QT-2045',
        customer: 'BuildRight Construction',
        email: 'procurement@buildright.co.zw',
        phone: '+263 77 123 4567',
        items: [],
        pickupPrice: 4200.00,
        deliveryPrice: 4500.00,
        discount: 5,
        status: 'pending',
        preferredContact: 'email',
        date: '2024-12-30',
        expiryDate: '2025-01-14',
        project: 'Highlands Office Park'
    },
    {
        id: 'QT-2044',
        customer: 'Sarah Mahlangu',
        email: 's.mahlangu@gmail.com',
        phone: '+263 71 987 6543',
        items: [],
        pickupPrice: 800.00,
        deliveryPrice: 850.00,
        discount: 0,
        status: 'sent',
        preferredContact: 'whatsapp',
        date: '2024-12-29',
        expiryDate: '2025-01-13',
        project: 'Home Renovation'
    },
    {
        id: 'QT-2043',
        customer: 'Devon Engineering',
        email: 'accounts@devon.co.zw',
        phone: '+263 24 789 0123',
        items: [],
        pickupPrice: 11800.00,
        deliveryPrice: 12500.00,
        discount: 10,
        status: 'accepted',
        preferredContact: 'email',
        date: '2024-12-28',
        expiryDate: '2025-01-12',
        project: 'Road Construction Phase 2'
    },
];

// Icons
const Icons = {
    Settings: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    ),
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Send: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 2L11 13"></path>
            <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
    ),
    Eye: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    ),
    Edit: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    ),
    PDF: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
    ),
    WhatsApp: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
    ),
    Email: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
    ),
    Plus: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    ),
    Trash: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
};

interface QuotationSettings {
    defaultExpiryDays: number;
    defaultTerms: string;
    deliveryFeePercent: number;
}

export default function QuotationsPage() {
    const { products } = useProducts();
    const [quotations, setQuotations] = useState<Quotation[]>(MOCK_QUOTATIONS);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [settings, setSettings] = useState<QuotationSettings>({
        defaultExpiryDays: 14,
        defaultTerms: 'Prices valid for 14 days. Delivery within 3-5 business days.',
        deliveryFeePercent: 8,
    });

    // New quotation form state
    const [newQuotation, setNewQuotation] = useState({
        customer: '',
        email: '',
        phone: '',
        project: '',
        preferredContact: 'email' as 'email' | 'whatsapp' | 'sms' | 'phone',
        items: [] as QuotationItem[],
        discount: 0,
    });

    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatusBadge = (status: Quotation['status']) => {
        switch (status) {
            case 'draft': return <span className={styles.badge} style={{ background: '#f1f5f9', color: '#475569' }}>Draft</span>;
            case 'pending': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending Review</span>;
            case 'sent': return <span className={`${styles.badge} ${styles.badgeInfo}`}>Quote Sent</span>;
            case 'accepted': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Accepted</span>;
            case 'rejected': return <span className={`${styles.badge} ${styles.badgeError}`}>Rejected</span>;
            case 'expired': return <span className={styles.badge} style={{ background: '#f1f5f9', color: '#94a3b8' }}>Expired</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const filteredQuotes = quotations.filter(quote => {
        const matchesSearch =
            quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const calculateTotals = (items: QuotationItem[], discount: number) => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const discountAmount = subtotal * (discount / 100);
        const pickupPrice = subtotal - discountAmount;
        const deliveryFee = subtotal * (settings.deliveryFeePercent / 100);
        const deliveryPrice = pickupPrice + deliveryFee;
        return { subtotal, discountAmount, pickupPrice, deliveryPrice };
    };

    const handleAddItem = () => {
        setNewQuotation(prev => ({
            ...prev,
            items: [...prev.items, { productId: 0, productName: '', quantity: 1, unitPrice: 0 }]
        }));
    };

    const handleRemoveItem = (index: number) => {
        setNewQuotation(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
        setNewQuotation(prev => {
            const newItems = [...prev.items];
            if (field === 'productId') {
                const product = products.find(p => p.id === parseInt(value));
                if (product) {
                    newItems[index] = {
                        ...newItems[index],
                        productId: product.id,
                        productName: product.name,
                        unitPrice: product.price
                    };
                }
            } else {
                newItems[index] = { ...newItems[index], [field]: value };
            }
            return { ...prev, items: newItems };
        });
    };

    const handleCreateQuotation = () => {
        const totals = calculateTotals(newQuotation.items, newQuotation.discount);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + settings.defaultExpiryDays);

        const quotation: Quotation = {
            id: `QT-${Math.floor(Math.random() * 9000) + 1000}`,
            customer: newQuotation.customer,
            email: newQuotation.email,
            phone: newQuotation.phone,
            project: newQuotation.project,
            preferredContact: newQuotation.preferredContact,
            items: newQuotation.items,
            discount: newQuotation.discount,
            pickupPrice: totals.pickupPrice,
            deliveryPrice: totals.deliveryPrice,
            status: 'draft',
            date: new Date().toISOString().split('T')[0],
            expiryDate: expiryDate.toISOString().split('T')[0],
        };

        setQuotations(prev => [quotation, ...prev]);
        setShowCreateModal(false);
        setNewQuotation({
            customer: '',
            email: '',
            phone: '',
            project: '',
            preferredContact: 'email',
            items: [],
            discount: 0,
        });
    };

    const handleSendQuote = (method: 'email' | 'whatsapp' | 'sms' | 'pdf') => {
        if (selectedQuotation) {
            // Update status to sent
            setQuotations(prev => prev.map(q =>
                q.id === selectedQuotation.id ? { ...q, status: 'sent' as const } : q
            ));

            // In real implementation, this would trigger API calls
            console.log(`Sending quote ${selectedQuotation.id} via ${method}`);
            alert(`Quote ${selectedQuotation.id} sent via ${method}!`);

            setShowSendModal(false);
            setSelectedQuotation(null);
        }
    };

    // Stats
    const pendingCount = quotations.filter(q => q.status === 'pending' || q.status === 'draft').length;
    const sentCount = quotations.filter(q => q.status === 'sent').length;
    const acceptedValue = quotations.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.deliveryPrice, 0);
    const conversionRate = quotations.length > 0
        ? Math.round((quotations.filter(q => q.status === 'accepted').length / quotations.length) * 100)
        : 0;

    return (
        <div>
            {/* Header with Settings */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }} ref={settingsRef}>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`${styles.btn} ${styles.btnOutline}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Icons.Settings />
                        Settings
                    </button>

                    {showSettings && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                            zIndex: 100,
                            width: '320px',
                            overflow: 'hidden'
                        }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Quotation Settings</h3>
                                <button onClick={() => setShowSettings(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                    <Icons.Close />
                                </button>
                            </div>
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>Default Expiry (days)</label>
                                    <input
                                        type="number"
                                        value={settings.defaultExpiryDays}
                                        onChange={(e) => setSettings(s => ({ ...s, defaultExpiryDays: parseInt(e.target.value) || 14 }))}
                                        className={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>Delivery Fee (%)</label>
                                    <input
                                        type="number"
                                        value={settings.deliveryFeePercent}
                                        onChange={(e) => setSettings(s => ({ ...s, deliveryFeePercent: parseInt(e.target.value) || 0 }))}
                                        className={styles.input}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>Default Terms</label>
                                    <textarea
                                        value={settings.defaultTerms}
                                        onChange={(e) => setSettings(s => ({ ...s, defaultTerms: e.target.value }))}
                                        className={styles.input}
                                        style={{ minHeight: '80px', resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                            <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', background: '#fafbfc' }}>
                                <button onClick={() => setShowSettings(false)} className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%' }}>
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statLabel}>Pending</h3>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{pendingCount}</p>
                    <span className={styles.statChange}>Requires attention</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statLabel}>Quotes Sent</h3>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <Icons.Send />
                        </div>
                    </div>
                    <p className={styles.statValue}>{sentCount}</p>
                    <span className={styles.statChange}>Awaiting response</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statLabel}>Accepted Value</h3>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>$</span>
                        </div>
                    </div>
                    <p className={styles.statValue}>${acceptedValue.toLocaleString()}</p>
                    <span className={styles.statChange}>Total value</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statLabel}>Conversion</h3>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{conversionRate}%</p>
                    <span className={styles.statChange}>Quote to order</span>
                </div>
            </div>

            {/* Quotes Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Quotations</h2>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <select
                            className={styles.select}
                            style={{ width: '140px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="sent">Sent</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.input}
                            style={{ width: '200px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowCreateModal(true)}>
                            <Icons.Plus /> Create Quote
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
                                <th>Pickup Price</th>
                                <th>Delivery Price</th>
                                <th>Expires</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuotes.map((quote) => (
                                <tr key={quote.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{quote.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{quote.customer}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{quote.email}</div>
                                    </td>
                                    <td>{quote.project}</td>
                                    <td style={{ color: '#16a34a', fontWeight: 500 }}>${quote.pickupPrice.toLocaleString()}</td>
                                    <td style={{ fontWeight: 600 }}>${quote.deliveryPrice.toLocaleString()}</td>
                                    <td style={{ color: '#64748b' }}>{quote.expiryDate}</td>
                                    <td>{getStatusBadge(quote.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className={styles.btn} style={{ padding: '6px', border: '1px solid #e2e8f0' }} title="View">
                                                <Icons.Eye />
                                            </button>
                                            <button className={styles.btn} style={{ padding: '6px', border: '1px solid #e2e8f0' }} title="Edit">
                                                <Icons.Edit />
                                            </button>
                                            <button
                                                className={`${styles.btn} ${styles.btnPrimary}`}
                                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                                onClick={() => { setSelectedQuotation(quote); setShowSendModal(true); }}
                                            >
                                                <Icons.Send /> Send
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Quote Modal */}
            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '700px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Create New Quotation</h3>
                            <button className={styles.modalClose} onClick={() => setShowCreateModal(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {/* Customer Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label className={styles.label}>Customer Name *</label>
                                    <input
                                        className={styles.input}
                                        value={newQuotation.customer}
                                        onChange={(e) => setNewQuotation(q => ({ ...q, customer: e.target.value }))}
                                        placeholder="Company or person name"
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>Email *</label>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        value={newQuotation.email}
                                        onChange={(e) => setNewQuotation(q => ({ ...q, email: e.target.value }))}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>Phone</label>
                                    <input
                                        className={styles.input}
                                        value={newQuotation.phone}
                                        onChange={(e) => setNewQuotation(q => ({ ...q, phone: e.target.value }))}
                                        placeholder="+263 77 123 4567"
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>Project Name</label>
                                    <input
                                        className={styles.input}
                                        value={newQuotation.project}
                                        onChange={(e) => setNewQuotation(q => ({ ...q, project: e.target.value }))}
                                        placeholder="e.g., Home Extension"
                                    />
                                </div>
                                <div>
                                    <label className={styles.label}>Preferred Contact Method</label>
                                    <select
                                        className={styles.select}
                                        value={newQuotation.preferredContact}
                                        onChange={(e) => setNewQuotation(q => ({ ...q, preferredContact: e.target.value as any }))}
                                    >
                                        <option value="email">Email</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="sms">SMS</option>
                                        <option value="phone">Phone Call</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={styles.label}>Discount (%)</label>
                                    <input
                                        className={styles.input}
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newQuotation.discount}
                                        onChange={(e) => setNewQuotation(q => ({ ...q, discount: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                            </div>

                            {/* Items */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label className={styles.label} style={{ marginBottom: 0 }}>Products</label>
                                    <button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleAddItem} style={{ padding: '6px 12px', fontSize: '13px' }}>
                                        <Icons.Plus /> Add Item
                                    </button>
                                </div>
                                {newQuotation.items.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
                                        <select
                                            className={styles.select}
                                            style={{ flex: 2 }}
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                        >
                                            <option value={0}>Select product...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                                            ))}
                                        </select>
                                        <input
                                            className={styles.input}
                                            type="number"
                                            min="1"
                                            style={{ flex: 1 }}
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                        />
                                        <span style={{ width: '80px', textAlign: 'right', fontWeight: 500 }}>
                                            ${(item.quantity * item.unitPrice).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                                        >
                                            <Icons.Trash />
                                        </button>
                                    </div>
                                ))}
                                {newQuotation.items.length === 0 && (
                                    <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                                        No items added. Click "Add Item" to add products.
                                    </p>
                                )}
                            </div>

                            {/* Totals */}
                            {newQuotation.items.length > 0 && (
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                    {(() => {
                                        const totals = calculateTotals(newQuotation.items, newQuotation.discount);
                                        return (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span>Subtotal:</span>
                                                    <span>${totals.subtotal.toFixed(2)}</span>
                                                </div>
                                                {newQuotation.discount > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#16a34a' }}>
                                                        <span>Discount ({newQuotation.discount}%):</span>
                                                        <span>-${totals.discountAmount.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600, color: '#16a34a' }}>
                                                    <span>Pickup Price:</span>
                                                    <span>${totals.pickupPrice.toFixed(2)}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                                    <span>Delivery Price (+{settings.deliveryFeePercent}%):</span>
                                                    <span>${totals.deliveryPrice.toFixed(2)}</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                onClick={handleCreateQuotation}
                                disabled={!newQuotation.customer || !newQuotation.email || newQuotation.items.length === 0}
                            >
                                Create Quotation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Quote Modal */}
            {showSendModal && selectedQuotation && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '450px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Send Quote {selectedQuotation.id}</h3>
                            <button className={styles.modalClose} onClick={() => { setShowSendModal(false); setSelectedQuotation(null); }}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ marginBottom: '16px', color: '#64748b' }}>
                                Customer: <strong>{selectedQuotation.customer}</strong><br />
                                Preferred: <strong>{selectedQuotation.preferredContact}</strong>
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button
                                    className={`${styles.btn} ${styles.btnOutline}`}
                                    style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                                    onClick={() => handleSendQuote('email')}
                                >
                                    <Icons.Email />
                                    <span>Email</span>
                                </button>
                                <button
                                    className={`${styles.btn} ${styles.btnOutline}`}
                                    style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#25D366' }}
                                    onClick={() => handleSendQuote('whatsapp')}
                                >
                                    <Icons.WhatsApp />
                                    <span>WhatsApp</span>
                                </button>
                                <button
                                    className={`${styles.btn} ${styles.btnOutline}`}
                                    style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                                    onClick={() => handleSendQuote('sms')}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>SMS</span>
                                </button>
                                <button
                                    className={`${styles.btn} ${styles.btnOutline}`}
                                    style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#dc2626' }}
                                    onClick={() => handleSendQuote('pdf')}
                                >
                                    <Icons.PDF />
                                    <span>Download PDF</span>
                                </button>
                            </div>

                            <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                                    <strong>Pickup:</strong> ${selectedQuotation.pickupPrice.toLocaleString()}<br />
                                    <strong>Delivery:</strong> ${selectedQuotation.deliveryPrice.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
