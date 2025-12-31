'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../admin.module.css';

// Types
interface Delivery {
    id: string;
    orderId: string;
    customer: string;
    phone: string;
    address: string;
    pickupLocationId: number | null;
    items: number;
    status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
    driverId: number | null;
    driverName: string | null;
    scheduledDate: string;
    deliveredDate: string | null;
    customerSignature: string | null;
    driverSignature: string | null;
}

interface PickupLocation {
    id: number;
    name: string;
    address: string;
}

interface Driver {
    id: number;
    name: string;
    phone: string;
    available: boolean;
}

// Mock Data
const MOCK_LOCATIONS: PickupLocation[] = [
    { id: 1, name: 'Main Warehouse', address: '15 Industrial Rd, Harare' },
    { id: 2, name: 'Bulawayo Depot', address: '78 Factory Lane, Bulawayo' },
    { id: 3, name: 'Mutare Branch', address: '23 Border Rd, Mutare' },
];

const MOCK_DRIVERS: Driver[] = [
    { id: 1, name: 'Tendai Moyo', phone: '+263 77 111 2222', available: true },
    { id: 2, name: 'Farai Chirwa', phone: '+263 71 333 4444', available: true },
    { id: 3, name: 'Brian Ncube', phone: '+263 77 555 6666', available: false },
];

const MOCK_DELIVERIES: Delivery[] = [
    {
        id: 'DEL001', orderId: 'ORD-001', customer: 'John Doe', phone: '+263 77 123 4567',
        address: '123 Main St, Harare', pickupLocationId: 1, items: 500, status: 'pending',
        driverId: null, driverName: null, scheduledDate: '2024-12-31', deliveredDate: null,
        customerSignature: null, driverSignature: null
    },
    {
        id: 'DEL002', orderId: 'ORD-002', customer: 'Jane Smith', phone: '+263 71 987 6543',
        address: '456 Oak Ave, Bulawayo', pickupLocationId: 2, items: 300, status: 'in_transit',
        driverId: 1, driverName: 'Tendai Moyo', scheduledDate: '2024-12-30', deliveredDate: null,
        customerSignature: null, driverSignature: null
    },
    {
        id: 'DEL003', orderId: 'ORD-003', customer: 'Bob Johnson', phone: '+263 24 555 1234',
        address: '789 Pine Rd, Mutare', pickupLocationId: 3, items: 1000, status: 'delivered',
        driverId: 2, driverName: 'Farai Chirwa', scheduledDate: '2024-12-28', deliveredDate: '2024-12-28',
        customerSignature: 'signed', driverSignature: 'signed'
    },
    {
        id: 'DEL004', orderId: 'ORD-004', customer: 'BuildRight Construction', phone: '+263 24 789 0123',
        address: '100 Industrial Zone, Harare', pickupLocationId: 1, items: 5000, status: 'assigned',
        driverId: 1, driverName: 'Tendai Moyo', scheduledDate: '2024-12-31', deliveredDate: null,
        customerSignature: null, driverSignature: null
    },
];

// Icons
const Icons = {
    Truck: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13" rx="2"></rect>
            <path d="M16 8h4l3 3v5h-7V8z"></path>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
    ),
    PDF: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
    ),
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    MapPin: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    ),
    User: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    ),
    Phone: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
    ),
    Check: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
};

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function DeliveriesPage() {
    const [deliveries, setDeliveries] = useState<Delivery[]>(MOCK_DELIVERIES);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDeliverySlipModal, setShowDeliverySlipModal] = useState(false);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [deliveryToDelete, setDeliveryToDelete] = useState<Delivery | null>(null);
    const [editingDelivery, setEditingDelivery] = useState<Partial<Delivery>>({});
    const [signatureType, setSignatureType] = useState<'customer' | 'driver'>('customer');
    const [signatureText, setSignatureText] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Canvas drawing functions
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const getStatusBadge = (status: Delivery['status']) => {
        switch (status) {
            case 'pending': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending</span>;
            case 'assigned': return <span className={styles.badge} style={{ background: '#e0e7ff', color: '#4f46e5' }}>Assigned</span>;
            case 'picked_up': return <span className={`${styles.badge} ${styles.badgeInfo}`}>Picked Up</span>;
            case 'in_transit': return <span className={`${styles.badge} ${styles.badgeInfo}`}>In Transit</span>;
            case 'delivered': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Delivered</span>;
            case 'cancelled': return <span className={`${styles.badge} ${styles.badgeError}`}>Cancelled</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const handleStatusChange = (deliveryId: string, newStatus: Delivery['status']) => {
        setDeliveries(prev => prev.map(d =>
            d.id === deliveryId ? { ...d, status: newStatus } : d
        ));
    };

    const handleAssignDriver = (deliveryId: string, driverId: number) => {
        const driver = MOCK_DRIVERS.find(d => d.id === driverId);
        setDeliveries(prev => prev.map(d =>
            d.id === deliveryId ? {
                ...d,
                driverId,
                driverName: driver?.name || null,
                status: 'assigned'
            } : d
        ));
        setShowAssignModal(false);
        setSelectedDelivery(null);
    };

    const handleSaveSignature = () => {
        if (!selectedDelivery) return;

        const signatureData = signatureText || 'canvas_signature';

        setDeliveries(prev => prev.map(d =>
            d.id === selectedDelivery.id ? {
                ...d,
                [signatureType === 'customer' ? 'customerSignature' : 'driverSignature']: signatureData
            } : d
        ));

        setShowSignatureModal(false);
        setSelectedDelivery(null);
        setSignatureText('');
        clearCanvas();
    };

    const handleGeneratePDF = (delivery: Delivery) => {
        // In real implementation, this would generate a PDF
        console.log('Generating PDF for delivery:', delivery.id);
        alert(`Delivery slip PDF for ${delivery.id} would be generated here.\n\nContents:\n- Order: ${delivery.orderId}\n- Customer: ${delivery.customer}\n- Address: ${delivery.address}\n- Items: ${delivery.items}\n- Driver: ${delivery.driverName || 'Unassigned'}\n- Date: ${delivery.scheduledDate}`);
    };

    const pendingCount = deliveries.filter(d => d.status === 'pending').length;
    const inTransitCount = deliveries.filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status)).length;
    const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

    return (
        <div>
            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Deliveries</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <Icons.Truck />
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
                    <p className={styles.statValue} style={{ color: '#d97706' }}>{pendingCount}</p>
                    <span className={styles.statChange}>Awaiting dispatch</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>In Progress</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <Icons.Truck />
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#2563eb' }}>{inTransitCount}</p>
                    <span className={styles.statChange}>On the way</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Delivered</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <Icons.Check />
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>{deliveredCount}</p>
                    <span className={styles.statChange}>Completed</span>
                </div>
            </div>

            {/* Deliveries Table */}
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
                                <th>Pickup</th>
                                <th>Driver</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Signatures</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map(delivery => {
                                const pickupLocation = MOCK_LOCATIONS.find(l => l.id === delivery.pickupLocationId);
                                return (
                                    <tr key={delivery.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{delivery.id}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{delivery.orderId}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{delivery.customer}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Icons.Phone /> {delivery.phone}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                                <Icons.MapPin />
                                                {pickupLocation?.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            {delivery.driverName ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Icons.User />
                                                    <span>{delivery.driverName}</span>
                                                </div>
                                            ) : (
                                                <button
                                                    className={`${styles.btn} ${styles.btnOutline}`}
                                                    style={{ padding: '4px 10px', fontSize: '12px' }}
                                                    onClick={() => { setSelectedDelivery(delivery); setShowAssignModal(true); }}
                                                >
                                                    Assign
                                                </button>
                                            )}
                                        </td>
                                        <td>{delivery.scheduledDate}</td>
                                        <td>
                                            <select
                                                className={styles.select}
                                                style={{ width: 'auto', padding: '6px', fontSize: '12px' }}
                                                value={delivery.status}
                                                onChange={(e) => handleStatusChange(delivery.id, e.target.value as Delivery['status'])}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <span
                                                    style={{
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        background: delivery.driverSignature ? '#dcfce7' : '#f1f5f9',
                                                        color: delivery.driverSignature ? '#16a34a' : '#94a3b8'
                                                    }}
                                                    title="Driver Signature"
                                                >
                                                    D {delivery.driverSignature ? '✓' : '—'}
                                                </span>
                                                <span
                                                    style={{
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        background: delivery.customerSignature ? '#dcfce7' : '#f1f5f9',
                                                        color: delivery.customerSignature ? '#16a34a' : '#94a3b8'
                                                    }}
                                                    title="Customer Signature"
                                                >
                                                    C {delivery.customerSignature ? '✓' : '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                <button
                                                    className={styles.btn}
                                                    style={{ padding: '6px', border: '1px solid #e2e8f0', color: '#64748b' }}
                                                    title="Edit"
                                                    onClick={() => {
                                                        setEditingDelivery({ ...delivery });
                                                        setShowEditModal(true);
                                                    }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className={styles.btn}
                                                    style={{ padding: '6px', border: '1px solid #e2e8f0' }}
                                                    title="Capture Signature"
                                                    onClick={() => {
                                                        setSelectedDelivery(delivery);
                                                        setSignatureType('customer');
                                                        setShowSignatureModal(true);
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                                        <path d="M2 2l7.586 7.586"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                                    style={{ padding: '6px 10px', fontSize: '12px' }}
                                                    onClick={() => handleGeneratePDF(delivery)}
                                                >
                                                    <Icons.PDF /> Slip
                                                </button>
                                                <button
                                                    className={styles.btn}
                                                    style={{ padding: '6px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fee2e2' }}
                                                    title="Delete"
                                                    onClick={() => {
                                                        setDeliveryToDelete(delivery);
                                                        setShowDeleteConfirm(true);
                                                    }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Driver Modal */}
            {showAssignModal && selectedDelivery && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Assign Driver</h3>
                            <button className={styles.modalClose} onClick={() => { setShowAssignModal(false); setSelectedDelivery(null); }}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ marginBottom: '16px', color: '#64748b' }}>
                                Delivery: <strong>{selectedDelivery.id}</strong><br />
                                Customer: <strong>{selectedDelivery.customer}</strong>
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {MOCK_DRIVERS.map(driver => (
                                    <button
                                        key={driver.id}
                                        className={`${styles.btn} ${styles.btnOutline}`}
                                        style={{
                                            padding: '12px 16px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            opacity: driver.available ? 1 : 0.5
                                        }}
                                        disabled={!driver.available}
                                        onClick={() => handleAssignDriver(selectedDelivery.id, driver.id)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Icons.User />
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: 500 }}>{driver.name}</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>{driver.phone}</div>
                                            </div>
                                        </div>
                                        <span className={`${styles.badge} ${driver.available ? styles.badgeSuccess : styles.badgeError}`}>
                                            {driver.available ? 'Available' : 'Busy'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Signature Modal */}
            {showSignatureModal && selectedDelivery && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '450px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Capture Signature</h3>
                            <button className={styles.modalClose} onClick={() => { setShowSignatureModal(false); setSelectedDelivery(null); setSignatureText(''); }}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div style={{ marginBottom: '16px' }}>
                                <label className={styles.label}>Signature Type</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className={`${styles.btn} ${signatureType === 'driver' ? styles.btnPrimary : styles.btnOutline}`}
                                        style={{ flex: 1 }}
                                        onClick={() => setSignatureType('driver')}
                                    >
                                        Driver
                                    </button>
                                    <button
                                        className={`${styles.btn} ${signatureType === 'customer' ? styles.btnPrimary : styles.btnOutline}`}
                                        style={{ flex: 1 }}
                                        onClick={() => setSignatureType('customer')}
                                    >
                                        Customer
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label className={styles.label}>Draw Signature</label>
                                <canvas
                                    ref={canvasRef}
                                    width={380}
                                    height={150}
                                    style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: '#fafbfc',
                                        cursor: 'crosshair',
                                        touchAction: 'none'
                                    }}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <button
                                    className={`${styles.btn} ${styles.btnOutline}`}
                                    style={{ marginTop: '8px', width: '100%' }}
                                    onClick={clearCanvas}
                                >
                                    Clear
                                </button>
                            </div>

                            <div style={{ marginBottom: '8px' }}>
                                <label className={styles.label}>Or Type Name</label>
                                <input
                                    className={styles.input}
                                    placeholder="Full name as acknowledgment"
                                    value={signatureText}
                                    onChange={(e) => setSignatureText(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => { setShowSignatureModal(false); setSelectedDelivery(null); }}>
                                Cancel
                            </button>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSaveSignature}>
                                Save Signature
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Delivery Modal */}
            {showEditModal && editingDelivery.id && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '500px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Edit Delivery</h3>
                            <button className={styles.modalClose} onClick={() => setShowEditModal(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                                <label className={styles.label}>Delivery ID</label>
                                <input className={styles.input} value={editingDelivery.id} disabled style={{ background: '#f8fafc' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Scheduled Date</label>
                                    <input
                                        type="date"
                                        className={styles.input}
                                        value={editingDelivery.scheduledDate || ''}
                                        onChange={e => setEditingDelivery({ ...editingDelivery, scheduledDate: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Status</label>
                                    <select
                                        className={styles.select}
                                        value={editingDelivery.status || 'pending'}
                                        onChange={e => setEditingDelivery({ ...editingDelivery, status: e.target.value as Delivery['status'] })}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="picked_up">Picked Up</option>
                                        <option value="in_transit">In Transit</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Pickup Location</label>
                                    <select
                                        className={styles.select}
                                        value={editingDelivery.pickupLocationId || ''}
                                        onChange={e => setEditingDelivery({ ...editingDelivery, pickupLocationId: parseInt(e.target.value) })}
                                    >
                                        {MOCK_LOCATIONS.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Driver</label>
                                    <select
                                        className={styles.select}
                                        value={editingDelivery.driverId || ''}
                                        onChange={e => {
                                            const driverId = parseInt(e.target.value);
                                            const driver = MOCK_DRIVERS.find(d => d.id === driverId);
                                            setEditingDelivery({
                                                ...editingDelivery,
                                                driverId: driverId || null,
                                                driverName: driver?.name || null
                                            });
                                        }}
                                    >
                                        <option value="">Unassigned</option>
                                        {MOCK_DRIVERS.map(driver => (
                                            <option key={driver.id} value={driver.id}>{driver.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Delivery Address</label>
                                <input
                                    className={styles.input}
                                    value={editingDelivery.address || ''}
                                    onChange={e => setEditingDelivery({ ...editingDelivery, address: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowEditModal(false)}>
                                Cancel
                            </button>
                            <button
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                onClick={() => {
                                    setDeliveries(deliveries.map(d =>
                                        d.id === editingDelivery.id ? { ...d, ...editingDelivery } as Delivery : d
                                    ));
                                    setShowEditModal(false);
                                    setEditingDelivery({});
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && deliveryToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Delete Delivery</h3>
                            <button className={styles.modalClose} onClick={() => setShowDeleteConfirm(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ color: '#64748b' }}>
                                Are you sure you want to delete delivery <strong>{deliveryToDelete.id}</strong>?
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
                                Customer: {deliveryToDelete.customer}
                            </p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </button>
                            <button
                                className={styles.btn}
                                style={{ background: '#dc2626', color: 'white' }}
                                onClick={() => {
                                    setDeliveries(deliveries.filter(d => d.id !== deliveryToDelete.id));
                                    setShowDeleteConfirm(false);
                                    setDeliveryToDelete(null);
                                }}
                            >
                                Delete Delivery
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
