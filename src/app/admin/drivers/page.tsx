'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

// Types
interface Driver {
    id: number;
    name: string;
    phone: string;
    vehicle: string;
    license: string;
    status: 'active' | 'off_duty' | 'on_leave';
    totalDeliveries: number;
}

interface AssignedDelivery {
    id: string;
    orderId: string;
    customer: string;
    customerPhone: string;
    address: string;
    items: number;
    status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
    scheduledDate: string;
    pickupLocation: string;
}

// Icons
const Icons = {
    Phone: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
    ),
    MapPin: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    ),
    Truck: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13" rx="2"></rect>
            <path d="M16 8h4l3 3v5h-7V8z"></path>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
    ),
    User: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    ),
    Check: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    Package: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
    ),
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    ChevronRight: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
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
};

const STATUS_FLOW: Record<AssignedDelivery['status'], { next: AssignedDelivery['status'] | null; label: string }> = {
    assigned: { next: 'picked_up', label: 'Mark Picked Up' },
    picked_up: { next: 'in_transit', label: 'Start Delivery' },
    in_transit: { next: 'delivered', label: 'Mark Delivered' },
    delivered: { next: null, label: 'Completed' },
};

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([
        { id: 1, name: 'Tendai Moyo', phone: '+263 77 123 4567', vehicle: 'Isuzu NQR', license: 'AE123456', status: 'active', totalDeliveries: 45 },
        { id: 2, name: 'Chipo Ndlovu', phone: '+263 77 234 5678', vehicle: 'Hino 300', license: 'AE234567', status: 'active', totalDeliveries: 38 },
        { id: 3, name: 'Tapiwa Khumalo', phone: '+263 77 345 6789', vehicle: 'Tata Ultra', license: 'AE345678', status: 'off_duty', totalDeliveries: 52 },
    ]);
    const [assignedDeliveries, setAssignedDeliveries] = useState<Record<number, AssignedDelivery[]>>({
        1: [
            { id: 'DEL001', orderId: 'ORD-001', customer: 'John Doe', customerPhone: '+263 77 111 2222', address: '123 Main St, Harare', items: 500, status: 'assigned', scheduledDate: '2024-12-31', pickupLocation: 'Main Warehouse' },
            { id: 'DEL004', orderId: 'ORD-004', customer: 'BuildRight Construction', customerPhone: '+263 24 789 0123', address: '100 Industrial Zone, Harare', items: 5000, status: 'picked_up', scheduledDate: '2024-12-31', pickupLocation: 'Main Warehouse' },
        ],
        2: [
            { id: 'DEL002', orderId: 'ORD-002', customer: 'Jane Smith', customerPhone: '+263 71 987 6543', address: '456 Oak Ave, Bulawayo', items: 300, status: 'in_transit', scheduledDate: '2024-12-30', pickupLocation: 'Bulawayo Depot' },
        ],
        3: [],
    });

    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [showDriverPortal, setShowDriverPortal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentDriver, setCurrentDriver] = useState<Partial<Driver>>({});
    const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>;
            case 'off_duty': return <span className={styles.badge} style={{ background: '#f1f5f9', color: '#64748b' }}>Off Duty</span>;
            case 'on_leave': return <span className={`${styles.badge} ${styles.badgeWarning}`}>On Leave</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const getDeliveryStatusBadge = (status: AssignedDelivery['status']) => {
        switch (status) {
            case 'assigned': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Assigned</span>;
            case 'picked_up': return <span className={styles.badge} style={{ background: '#e0e7ff', color: '#4f46e5' }}>Picked Up</span>;
            case 'in_transit': return <span className={`${styles.badge} ${styles.badgeInfo}`}>In Transit</span>;
            case 'delivered': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Delivered</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    const handleStatusUpdate = (driverId: number, deliveryId: string) => {
        setAssignedDeliveries(prev => {
            const driverDeliveries = prev[driverId] || [];
            const delivery = driverDeliveries.find(d => d.id === deliveryId);
            if (!delivery) return prev;
            const nextStatus = STATUS_FLOW[delivery.status].next;
            if (!nextStatus) return prev;
            return {
                ...prev,
                [driverId]: driverDeliveries.map(d =>
                    d.id === deliveryId ? { ...d, status: nextStatus } : d
                )
            };
        });
    };

    const openDriverPortal = (driver: Driver) => {
        setSelectedDriver(driver);
        setShowDriverPortal(true);
    };

    const handleAdd = () => {
        setCurrentDriver({ status: 'active', totalDeliveries: 0 });
        setShowModal(true);
    };

    const handleEdit = (driver: Driver) => {
        setCurrentDriver({ ...driver });
        setShowModal(true);
    };

    const handleDelete = (driver: Driver) => {
        setDriverToDelete(driver);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (driverToDelete) {
            setDrivers(drivers.filter(d => d.id !== driverToDelete.id));
        }
        setShowDeleteConfirm(false);
        setDriverToDelete(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentDriver.id) {
            setDrivers(drivers.map(d => d.id === currentDriver.id ? { ...d, ...currentDriver } as Driver : d));
        } else {
            const newId = Math.max(...drivers.map(d => d.id), 0) + 1;
            setDrivers([...drivers, { ...currentDriver, id: newId, totalDeliveries: 0 } as Driver]);
            setAssignedDeliveries(prev => ({ ...prev, [newId]: [] }));
        }
        setShowModal(false);
        setCurrentDriver({});
    };

    const activeDrivers = drivers.filter(d => d.status === 'active').length;
    const totalDeliveries = drivers.reduce((sum, d) => sum + d.totalDeliveries, 0);
    const pendingToday = Object.values(assignedDeliveries).flat().filter(d => d.status !== 'delivered').length;

    return (
        <div>
            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Drivers</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <Icons.User />
                        </div>
                    </div>
                    <p className={styles.statValue}>{drivers.length}</p>
                    <span className={styles.statChange}>Registered drivers</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Active Now</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <Icons.Check />
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>{activeDrivers}</p>
                    <span className={styles.statChange}>On the road</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Pending Today</p>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <Icons.Truck />
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#d97706' }}>{pendingToday}</p>
                    <span className={styles.statChange}>Assigned deliveries</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Deliveries</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <Icons.Package />
                        </div>
                    </div>
                    <p className={styles.statValue}>{totalDeliveries}</p>
                    <span className={styles.statChange}>This month</span>
                </div>
            </div>

            {/* Drivers Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Driver Directory</h2>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>
                        <Icons.Plus /> Add Driver
                    </button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Vehicle</th>
                                <th>License</th>
                                <th>Assigned</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map(driver => {
                                const driverDeliveries = assignedDeliveries[driver.id] || [];
                                const pendingCount = driverDeliveries.filter(d => d.status !== 'delivered').length;
                                return (
                                    <tr key={driver.id}>
                                        <td style={{ fontWeight: 500 }}>{driver.name}</td>
                                        <td>
                                            <a href={`tel:${driver.phone}`} style={{ color: '#0ea5e9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Icons.Phone />
                                                {driver.phone}
                                            </a>
                                        </td>
                                        <td>{driver.vehicle}</td>
                                        <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{driver.license}</td>
                                        <td>
                                            {pendingCount > 0 ? (
                                                <span className={`${styles.badge} ${styles.badgeWarning}`}>
                                                    {pendingCount} pending
                                                </span>
                                            ) : (
                                                <span style={{ color: '#94a3b8' }}>—</span>
                                            )}
                                        </td>
                                        <td>{getStatusBadge(driver.status)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                className={`${styles.btn} ${styles.btnOutline}`}
                                                style={{ padding: '6px 10px', fontSize: '12px', marginRight: '6px' }}
                                                onClick={() => openDriverPortal(driver)}
                                            >
                                                Portal
                                            </button>
                                            <button
                                                className={styles.btn}
                                                style={{ padding: '6px', marginRight: '6px', color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                                onClick={() => handleEdit(driver)}
                                                title="Edit"
                                            >
                                                <Icons.Edit />
                                            </button>
                                            <button
                                                className={styles.btn}
                                                style={{ padding: '6px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fee2e2' }}
                                                onClick={() => handleDelete(driver)}
                                                title="Delete"
                                            >
                                                <Icons.Trash />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Driver Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '500px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{currentDriver.id ? 'Edit Driver' : 'Add Driver'}</h3>
                            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                                    <label className={styles.label}>Full Name *</label>
                                    <input
                                        className={styles.input}
                                        value={currentDriver.name || ''}
                                        onChange={e => setCurrentDriver({ ...currentDriver, name: e.target.value })}
                                        placeholder="Driver full name"
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Phone *</label>
                                        <input
                                            className={styles.input}
                                            value={currentDriver.phone || ''}
                                            onChange={e => setCurrentDriver({ ...currentDriver, phone: e.target.value })}
                                            placeholder="+263 77 123 4567"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>License Plate *</label>
                                        <input
                                            className={styles.input}
                                            value={currentDriver.license || ''}
                                            onChange={e => setCurrentDriver({ ...currentDriver, license: e.target.value })}
                                            placeholder="AE123456"
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Vehicle</label>
                                        <input
                                            className={styles.input}
                                            value={currentDriver.vehicle || ''}
                                            onChange={e => setCurrentDriver({ ...currentDriver, vehicle: e.target.value })}
                                            placeholder="Isuzu NQR"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Status</label>
                                        <select
                                            className={styles.select}
                                            value={currentDriver.status || 'active'}
                                            onChange={e => setCurrentDriver({ ...currentDriver, status: e.target.value as Driver['status'] })}
                                        >
                                            <option value="active">Active</option>
                                            <option value="off_duty">Off Duty</option>
                                            <option value="on_leave">On Leave</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                                    {currentDriver.id ? 'Save Changes' : 'Add Driver'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && driverToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Delete Driver</h3>
                            <button className={styles.modalClose} onClick={() => setShowDeleteConfirm(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ color: '#64748b' }}>
                                Are you sure you want to delete <strong>{driverToDelete.name}</strong>?
                            </p>
                            {(assignedDeliveries[driverToDelete.id] || []).length > 0 && (
                                <p style={{ color: '#d97706', fontSize: '13px', marginTop: '8px', padding: '8px', background: '#fef3c7', borderRadius: '6px' }}>
                                    ⚠️ This driver has {assignedDeliveries[driverToDelete.id].length} assigned deliveries.
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
                                Delete Driver
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Driver Portal Modal */}
            {showDriverPortal && selectedDriver && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '700px', maxHeight: '85vh' }}>
                        <div className={styles.modalHeader} style={{ background: '#0ea5e9', color: 'white' }}>
                            <div>
                                <h3 className={styles.modalTitle} style={{ color: 'white' }}>Driver Portal</h3>
                                <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>{selectedDriver.name} • {selectedDriver.vehicle}</p>
                            </div>
                            <button
                                className={styles.modalClose}
                                style={{ color: 'white' }}
                                onClick={() => { setShowDriverPortal(false); setSelectedDriver(null); }}
                            >
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody} style={{ padding: 0, maxHeight: '60vh', overflowY: 'auto' }}>
                            {(assignedDeliveries[selectedDriver.id] || []).length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                    <Icons.Package />
                                    <p style={{ marginTop: '12px' }}>No assigned deliveries</p>
                                </div>
                            ) : (
                                (assignedDeliveries[selectedDriver.id] || []).map((delivery, index) => (
                                    <div
                                        key={delivery.id}
                                        style={{
                                            padding: '16px 20px',
                                            borderBottom: index < (assignedDeliveries[selectedDriver.id]?.length || 0) - 1 ? '1px solid #f1f5f9' : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>
                                                    {delivery.id} • {delivery.orderId}
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                                    {delivery.scheduledDate}
                                                </div>
                                            </div>
                                            {getDeliveryStatusBadge(delivery.status)}
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Customer</div>
                                                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{delivery.customer}</div>
                                                <a
                                                    href={`tel:${delivery.customerPhone}`}
                                                    style={{
                                                        color: '#0ea5e9',
                                                        textDecoration: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    <Icons.Phone />
                                                    {delivery.customerPhone}
                                                </a>
                                            </div>

                                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Delivery Address</div>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '13px' }}>
                                                    <Icons.MapPin />
                                                    {delivery.address}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                                                <strong>{delivery.items.toLocaleString()}</strong> items from <strong>{delivery.pickupLocation}</strong>
                                            </div>

                                            {delivery.status !== 'delivered' && (
                                                <button
                                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                                    style={{ padding: '8px 16px' }}
                                                    onClick={() => handleStatusUpdate(selectedDriver.id, delivery.id)}
                                                >
                                                    <Icons.Check />
                                                    {STATUS_FLOW[delivery.status].label}
                                                </button>
                                            )}

                                            {delivery.status === 'delivered' && (
                                                <span style={{ color: '#16a34a', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Icons.Check /> Completed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <a
                                href={`tel:${selectedDriver.phone}`}
                                className={`${styles.btn} ${styles.btnOutline}`}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Icons.Phone /> Call Driver
                            </a>
                            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => { setShowDriverPortal(false); setSelectedDriver(null); }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
