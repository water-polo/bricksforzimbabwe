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
    // Financials
    subtotal: number;
    discount: number; // percentage
    discountAmount: number;
    deliveryFee: number;
    total: number;
    type: 'pickup' | 'delivery';

    // Workflow
    status: 'draft' | 'pending' | 'generated' | 'sent' | 'accepted' | 'rejected' | 'expired';
    preferredContact: 'email' | 'whatsapp' | 'sms' | 'phone';

    // Meta
    date: string;
    expiryDate: string;
    project: string;
    message?: string;
}

// Icons
const Icons = {
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>,
    Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    PDF: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
    WhatsApp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>,
    Email: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    CheckCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
};

interface QuotationSettings {
    defaultExpiryDays: number;
    defaultTerms: string;
    deliveryFeePercent: number;
}

// Mock initial data
const MOCK_QUOTATIONS: Quotation[] = [
    {
        id: 'QT-2045',
        customer: 'BuildRight Construction',
        email: 'procurement@buildright.co.zw',
        phone: '+263 77 123 4567',
        items: [],
        subtotal: 4000,
        discount: 0,
        discountAmount: 0,
        deliveryFee: 320,
        total: 4320,
        type: 'delivery',
        status: 'pending',
        preferredContact: 'email',
        date: '2024-12-30',
        expiryDate: '2025-01-14',
        project: 'Highlands Office Park'
    }
];

export default function QuotationsPage() {
    const { products } = useProducts();
    const [quotations, setQuotations] = useState<Quotation[]>([]);

    // Load data
    useEffect(() => {
        const stored = localStorage.getItem('simulated_quotes');
        if (stored) {
            // Need to map old structure to new if necessary, but for now we assume fresh start or compatible
            // Ensuring we handle format gracefully
            const parsed = JSON.parse(stored).map((q: any) => ({
                ...q,
                type: q.type || 'delivery',
                subtotal: q.subtotal || q.pickupPrice || 0, // Fallback logic
                deliveryFee: q.deliveryFee || (q.deliveryPrice - q.pickupPrice) || 0,
                total: q.total || q.deliveryPrice || 0
            }));
            setQuotations([...parsed, ...MOCK_QUOTATIONS]);
        } else {
            setQuotations(MOCK_QUOTATIONS);
        }
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

    const [settings, setSettings] = useState<QuotationSettings>({
        defaultExpiryDays: 14,
        defaultTerms: 'Prices valid for 14 days. 50% deposit required to secure order.',
        deliveryFeePercent: 8,
    });

    const settingsRef = useRef<HTMLDivElement>(null);

    // Form State
    const [newQuotation, setNewQuotation] = useState({
        customer: '',
        email: '',
        phone: '',
        project: '',
        message: '',
        preferredContact: 'email' as Quotation['preferredContact'],
        items: [] as QuotationItem[],
        discount: 0,
        type: 'delivery' as 'pickup' | 'delivery'
    });

    // Close settings on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const calculateTotals = (items: QuotationItem[], discountPercent: number, type: 'pickup' | 'delivery') => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const discountAmount = subtotal * (discountPercent / 100);
        const afterDiscount = subtotal - discountAmount;

        let deliveryFee = 0;
        if (type === 'delivery') {
            deliveryFee = afterDiscount * (settings.deliveryFeePercent / 100);
        }

        const total = afterDiscount + deliveryFee;
        return { subtotal, discountAmount, deliveryFee, total };
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

    const handleReview = (quote: Quotation) => {
        setEditingQuoteId(quote.id);
        setNewQuotation({
            customer: quote.customer,
            email: quote.email,
            phone: quote.phone,
            project: quote.project,
            message: quote.message || '',
            preferredContact: quote.preferredContact,
            items: quote.items,
            discount: quote.discount,
            type: quote.type || 'delivery'
        });
        setShowCreateModal(true);
    };

    const handleGenerateQuotation = () => {
        const totals = calculateTotals(newQuotation.items, newQuotation.discount, newQuotation.type);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + settings.defaultExpiryDays);

        const quoteData = {
            customer: newQuotation.customer,
            email: newQuotation.email,
            phone: newQuotation.phone,
            project: newQuotation.project,
            preferredContact: newQuotation.preferredContact,
            items: newQuotation.items,
            discount: newQuotation.discount,
            discountAmount: totals.discountAmount,
            subtotal: totals.subtotal,
            deliveryFee: totals.deliveryFee,
            total: totals.total,
            type: newQuotation.type,
            expiryDate: expiryDate.toISOString().split('T')[0],
        };

        if (editingQuoteId) {
            setQuotations(prev => prev.map(q =>
                q.id === editingQuoteId
                    ? { ...q, ...quoteData, status: 'generated' }
                    : q
            ));
        } else {
            const newId = `QT-${Math.floor(Math.random() * 9000) + 1000}`;
            const newQuote: Quotation = {
                id: newId,
                ...quoteData,
                status: 'generated',
                date: new Date().toISOString().split('T')[0],
            };
            setQuotations(prev => [newQuote, ...prev]);
        }

        setShowCreateModal(false);
        setEditingQuoteId(null);
        setNewQuotation({ customer: '', email: '', phone: '', project: '', message: '', preferredContact: 'email', items: [], discount: 0, type: 'delivery' });
    };

    const handleSendQuote = (quote: Quotation) => {
        setQuotations(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'sent' } : q));
        alert('Quote sent successfully!');
    };

    const openPreview = (quote: Quotation) => {
        setSelectedQuotation(quote);
        setShowPreviewModal(true);
    };

    const getStatusBadge = (status: Quotation['status']) => {
        const baseStyle = { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' };
        switch (status) {
            case 'draft': return <span style={{ ...baseStyle, background: '#f1f5f9', color: '#64748b' }}>Draft</span>;
            case 'pending': return <span style={{ ...baseStyle, background: '#fff7ed', color: '#c2410c' }}>Pending</span>;
            case 'generated': return <span style={{ ...baseStyle, background: '#e0e7ff', color: '#4338ca' }}>Ready to Send</span>;
            case 'sent': return <span style={{ ...baseStyle, background: '#dcfce7', color: '#15803d' }}><Icons.CheckCircle /> Sent</span>;
            case 'accepted': return <span style={{ ...baseStyle, background: '#dcfce7', color: '#15803d' }}>Accepted</span>;
            case 'rejected': return <span style={{ ...baseStyle, background: '#fee2e2', color: '#b91c1c' }}>Rejected</span>;
            default: return <span>{status}</span>;
        }
    };

    const filteredQuotes = quotations.filter(q =>
        (q.customer.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || q.status === statusFilter)
    );

    // Render Preview Modal
    const renderPreviewModal = () => {
        if (!selectedQuotation) return null;
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal} style={{ maxWidth: '800px', padding: '0', background: '#525252' }}>
                    <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                        <span>Preview Quote: {selectedQuotation.id}</span>
                        <button onClick={() => setShowPreviewModal(false)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}><Icons.Close /></button>
                    </div>
                    <div style={{ background: 'white', padding: '40px', minHeight: '800px', position: 'relative', margin: '0 auto', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>

                        {/* Stamp */}
                        {selectedQuotation.status !== 'draft' && selectedQuotation.status !== 'pending' && (
                            <div style={{
                                position: 'absolute', top: '200px', right: '100px', width: '180px', height: '180px',
                                border: '4px double #ef4444', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                color: '#ef4444', transform: 'rotate(-15deg)', opacity: 0.25, pointerEvents: 'none', fontWeight: 'bold', fontSize: '20px', textAlign: 'center'
                            }}>
                                <div>OFFICIAL</div>
                                <div style={{ fontSize: '14px' }}>QUOTATION</div>
                                <div style={{ fontSize: '12px', marginTop: '4px' }}>{selectedQuotation.date}</div>
                            </div>
                        )}

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid #0ea5e9', paddingBottom: '20px' }}>
                            <div>
                                <h1 style={{ color: '#0ea5e9', margin: 0, fontSize: '28px' }}>BRICKS FOR ZIMBABWE</h1>
                                <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>Premium Construction Materials</p>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '14px', color: '#475569' }}>
                                <div>Koala Park, Seke Road, Harare</div>
                                <div>+263 719 269 637</div>
                                <div>sales@bricksforzim.com</div>
                            </div>
                        </div>

                        {/* Quote Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', width: '45%' }}>
                                <h3 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>Bill To</h3>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>{selectedQuotation.customer}</div>
                                <div style={{ color: '#64748b' }}>{selectedQuotation.email}</div>
                                <div style={{ color: '#64748b' }}>{selectedQuotation.phone}</div>
                                {selectedQuotation.project && <div style={{ color: '#64748b', marginTop: '4px' }}>Ref: {selectedQuotation.project}</div>}
                            </div>
                            <div style={{ textAlign: 'right', width: '45%' }}>
                                <h2 style={{ fontSize: '32px', color: '#334155', margin: 0 }}>QUOTATION</h2>
                                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>#{selectedQuotation.id}</div>
                                <table style={{ width: '100%', marginTop: '20px', fontSize: '14px' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ color: '#94a3b8', padding: '4px 0' }}>Date:</td>
                                            <td style={{ fontWeight: 600 }}>{selectedQuotation.date}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ color: '#94a3b8', padding: '4px 0' }}>Valid Until:</td>
                                            <td style={{ fontWeight: 600 }}>{selectedQuotation.expiryDate}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                            <thead>
                                <tr style={{ background: '#0ea5e9', color: 'white' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                                    <th style={{ padding: '12px', textAlign: 'center', width: '100px' }}>Qty</th>
                                    <th style={{ padding: '12px', textAlign: 'right', width: '120px' }}>Unit Price</th>
                                    <th style={{ padding: '12px', textAlign: 'right', width: '120px' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedQuotation.items.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '12px' }}>{item.productName}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <div style={{ width: '250px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b' }}>Subtotal</span>
                                    <span>${selectedQuotation.subtotal.toFixed(2)}</span>
                                </div>
                                {selectedQuotation.discountAmount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#16a34a' }}>
                                        <span>Discount {selectedQuotation.discount}%</span>
                                        <span>-${selectedQuotation.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                    <span style={{ color: '#64748b' }}>Delivery Fee ({selectedQuotation.type})</span>
                                    <span>${selectedQuotation.deliveryFee.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #e2e8f0', fontWeight: 'bold', fontSize: '18px' }}>
                                    <span>Total</span>
                                    <span>${selectedQuotation.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ marginTop: '60px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                            <p>{settings.defaultTerms}</p>
                            <p>Thank you for your business!</p>
                        </div>

                    </div>
                    {/* Action Bar */}
                    <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #e5e5e5', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => alert('Downloaded PDF')}>Download PDF</button>
                        {selectedQuotation.status === 'generated' && (
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => { handleSendQuote(selectedQuotation); setShowPreviewModal(false); }}>
                                Send Quote
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Header & Settings */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }} ref={settingsRef}>
                    <button onClick={() => setShowSettings(!showSettings)} className={`${styles.btn} ${styles.btnOutline}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icons.Settings /> Settings
                    </button>
                    {showSettings && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', zIndex: 100, width: '320px', padding: '16px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Settings</h3>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Delivery Fee %</label>
                            <input className={styles.input} type="number" value={settings.deliveryFeePercent} onChange={e => setSettings({ ...settings, deliveryFeePercent: Number(e.target.value) })} />
                            <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: '12px', width: '100%' }} onClick={() => setShowSettings(false)}>Save</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}><h3 className={styles.statLabel}>Pending</h3><div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}><Icons.Settings /></div></div>
                    <p className={styles.statValue}>{quotations.filter(q => q.status === 'pending').length}</p>
                    <span className={styles.statChange}>Needs Review</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}><h3 className={styles.statLabel}>Ready</h3><div className={styles.statIcon} style={{ background: '#e0e7ff', color: '#4338ca' }}><Icons.PDF /></div></div>
                    <p className={styles.statValue}>{quotations.filter(q => q.status === 'generated').length}</p>
                    <span className={styles.statChange}>To Send</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}><h3 className={styles.statLabel}>Sent</h3><div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}><Icons.Check /></div></div>
                    <p className={styles.statValue}>{quotations.filter(q => q.status === 'sent').length}</p>
                    <span className={styles.statChange}>Awaiting Reply</span>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Quotations</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input className={styles.input} placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '200px' }} />
                        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => { setEditingQuoteId(null); setShowCreateModal(true); }}>
                            <Icons.Plus /> Create
                        </button>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Customer</th>
                                <th>Project</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuotes.map(quote => (
                                <tr key={quote.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#64748b' }}>{quote.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{quote.customer}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{quote.email}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px' }}>{quote.project}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{quote.type === 'pickup' ? 'Pickup' : 'Delivery'}</div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>${quote.total.toFixed(2)}</td>
                                    <td>{getStatusBadge(quote.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            {quote.status === 'pending' || quote.status === 'draft' ? (
                                                <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => handleReview(quote)}>Review</button>
                                            ) : (
                                                <>
                                                    <button className={styles.btn} style={{ padding: '6px', border: '1px solid #e2e8f0' }} onClick={() => openPreview(quote)} title="View PDF Quote">
                                                        <Icons.PDF />
                                                    </button>
                                                    {quote.status !== 'sent' && (
                                                        <button className={styles.btn} style={{ padding: '6px', border: '1px solid #e2e8f0', color: '#0284c7' }} onClick={() => handleSendQuote(quote)} title="Mark Sent">
                                                            <Icons.Send />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '800px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{editingQuoteId ? 'Review & Generate Quote' : 'New Quotation'}</h3>
                            <button className={styles.modalClose} onClick={() => setShowCreateModal(false)}><Icons.Close /></button>
                        </div>
                        <div className={styles.modalBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {newQuotation.message && (
                                <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                                    <strong style={{ fontSize: '11px', color: '#b45309', display: 'block', marginBottom: '4px' }}>CUSTOMER REQUEST</strong>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>{newQuotation.message}</p>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div><label className={styles.label}>Customer Name</label><input className={styles.input} value={newQuotation.customer} onChange={e => setNewQuotation({ ...newQuotation, customer: e.target.value })} /></div>
                                <div><label className={styles.label}>Email</label><input className={styles.input} value={newQuotation.email} onChange={e => setNewQuotation({ ...newQuotation, email: e.target.value })} /></div>
                                <div><label className={styles.label}>Phone</label><input className={styles.input} value={newQuotation.phone} onChange={e => setNewQuotation({ ...newQuotation, phone: e.target.value })} /></div>
                                <div><label className={styles.label}>Project</label><input className={styles.input} value={newQuotation.project} onChange={e => setNewQuotation({ ...newQuotation, project: e.target.value })} /></div>
                                <div>
                                    <label className={styles.label}>Delivery Method</label>
                                    <select className={styles.select} value={newQuotation.type} onChange={e => setNewQuotation({ ...newQuotation, type: e.target.value as any })}>
                                        <option value="delivery">Delivery</option>
                                        <option value="pickup">Pickup (No Fee)</option>
                                    </select>
                                </div>
                                <div><label className={styles.label}>Discount %</label><input className={styles.input} type="number" value={newQuotation.discount} onChange={e => setNewQuotation({ ...newQuotation, discount: Number(e.target.value) })} /></div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <strong>Items</strong>
                                    <button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleAddItem}><Icons.Plus /> Add</button>
                                </div>
                                {newQuotation.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                        <select className={styles.select} style={{ flex: 2 }} value={item.productId} onChange={e => handleItemChange(idx, 'productId', e.target.value)}>
                                            <option value={0}>Select Product...</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <input className={styles.input} style={{ width: '80px' }} type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))} />
                                        <input className={styles.input} style={{ width: '100px' }} type="number" placeholder="Price" value={item.unitPrice} onChange={e => handleItemChange(idx, 'unitPrice', Number(e.target.value))} />
                                        <div style={{ width: '100px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 600 }}>
                                            ${(item.quantity * item.unitPrice).toFixed(2)}
                                        </div>
                                        <button onClick={() => handleRemoveItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Icons.Trash /></button>
                                    </div>
                                ))}
                            </div>

                            {/* Totals Preview */}
                            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                                {(() => {
                                    const totals = calculateTotals(newQuotation.items, newQuotation.discount, newQuotation.type);
                                    return (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', textAlign: 'right' }}>
                                            <div>Subtotal: ${totals.subtotal.toFixed(2)}</div>
                                            {totals.discountAmount > 0 && <div style={{ color: '#16a34a' }}>Discount: -${totals.discountAmount.toFixed(2)}</div>}
                                            <div>Delivery Fee: ${totals.deliveryFee.toFixed(2)}</div>
                                            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>Total: ${totals.total.toFixed(2)}</div>
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleGenerateQuotation}>
                                {editingQuoteId ? 'Generate Quote' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreviewModal && renderPreviewModal()}

        </div>
    );
}
