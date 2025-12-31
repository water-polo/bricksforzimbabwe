'use client';

import { useState } from 'react';
import styles from '../admin.module.css';

interface Location {
    id: number;
    name: string;
    address: string;
    type: 'warehouse' | 'branch' | 'depot' | 'pickup';
    hours: string;
    active: boolean;
}

const Icons = {
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
};

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([
        { id: 1, name: 'Harare Central', address: '14 Samora Machel Ave, Harare', type: 'warehouse', hours: '7:00 AM - 5:00 PM', active: true },
        { id: 2, name: 'Bulawayo Branch', address: '23 Fort St, Bulawayo', type: 'branch', hours: '8:00 AM - 4:00 PM', active: true },
        { id: 3, name: 'Mutare Depot', address: '5 Main St, Mutare', type: 'depot', hours: '8:00 AM - 3:00 PM', active: true },
        { id: 4, name: 'Gweru Collection Point', address: '89 Robert Mugabe Way, Gweru', type: 'pickup', hours: '9:00 AM - 2:00 PM', active: false },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Partial<Location>>({});
    const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'warehouse': return <span className={styles.badge} style={{ background: '#dbeafe', color: '#2563eb' }}>Warehouse</span>;
            case 'branch': return <span className={styles.badge} style={{ background: '#dcfce7', color: '#16a34a' }}>Branch</span>;
            case 'depot': return <span className={styles.badge} style={{ background: '#fef3c7', color: '#d97706' }}>Depot</span>;
            case 'pickup': return <span className={styles.badge} style={{ background: '#f3e8ff', color: '#9333ea' }}>Pickup Point</span>;
            default: return <span className={styles.badge}>{type}</span>;
        }
    };

    const handleAdd = () => {
        setCurrentLocation({ type: 'warehouse', active: true });
        setIsModalOpen(true);
    };

    const handleEdit = (location: Location) => {
        setCurrentLocation({ ...location });
        setIsModalOpen(true);
    };

    const handleDelete = (location: Location) => {
        setLocationToDelete(location);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (locationToDelete) {
            setLocations(locations.filter(l => l.id !== locationToDelete.id));
        }
        setShowDeleteConfirm(false);
        setLocationToDelete(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentLocation.id) {
            // Edit
            setLocations(locations.map(l => l.id === currentLocation.id ? { ...l, ...currentLocation } as Location : l));
        } else {
            // Add
            const newId = Math.max(...locations.map(l => l.id), 0) + 1;
            setLocations([...locations, { ...currentLocation, id: newId } as Location]);
        }
        setIsModalOpen(false);
        setCurrentLocation({});
    };

    const toggleActive = (id: number) => {
        setLocations(locations.map(l => l.id === id ? { ...l, active: !l.active } : l));
    };

    return (
        <div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Locations</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{locations.length}</p>
                    <span className={styles.statChange}>Registered</span>
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
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>
                        {locations.filter(l => l.active).length}
                    </p>
                    <span className={styles.statChange}>Currently open</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Warehouses</p>
                        <div className={styles.statIcon} style={{ background: '#f1f5f9', color: '#64748b' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{locations.filter(l => l.type === 'warehouse').length}</p>
                    <span className={styles.statChange}>Main storage</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Pickup Points</p>
                        <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{locations.filter(l => l.type === 'pickup').length}</p>
                    <span className={styles.statChange}>Collection</span>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Pickup Locations</h2>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Location
                    </button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Type</th>
                                <th>Hours</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map(location => (
                                <tr key={location.id}>
                                    <td style={{ fontWeight: 500 }}>{location.name}</td>
                                    <td style={{ color: '#64748b' }}>{location.address}</td>
                                    <td>{getTypeBadge(location.type)}</td>
                                    <td style={{ color: '#64748b', fontSize: '13px' }}>{location.hours}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleActive(location.id)}
                                            style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                border: 'none',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                background: location.active ? '#dcfce7' : '#f1f5f9',
                                                color: location.active ? '#16a34a' : '#64748b'
                                            }}
                                        >
                                            {location.active ? '● Active' : '○ Inactive'}
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className={styles.btn}
                                            style={{ padding: '6px', marginRight: '6px', color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                            onClick={() => handleEdit(location)}
                                            title="Edit"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            className={styles.btn}
                                            style={{ padding: '6px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fee2e2' }}
                                            onClick={() => handleDelete(location)}
                                            title="Delete"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '500px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{currentLocation.id ? 'Edit Location' : 'Add New Location'}</h3>
                            <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                                    <label className={styles.label}>Location Name *</label>
                                    <input
                                        className={styles.input}
                                        value={currentLocation.name || ''}
                                        onChange={e => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                                        placeholder="e.g., Harare Central Warehouse"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup} style={{ marginBottom: '16px' }}>
                                    <label className={styles.label}>Address *</label>
                                    <input
                                        className={styles.input}
                                        value={currentLocation.address || ''}
                                        onChange={e => setCurrentLocation({ ...currentLocation, address: e.target.value })}
                                        placeholder="Full address"
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Type</label>
                                        <select
                                            className={styles.select}
                                            value={currentLocation.type || 'warehouse'}
                                            onChange={e => setCurrentLocation({ ...currentLocation, type: e.target.value as Location['type'] })}
                                        >
                                            <option value="warehouse">Warehouse</option>
                                            <option value="branch">Branch</option>
                                            <option value="depot">Depot</option>
                                            <option value="pickup">Pickup Point</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Operating Hours</label>
                                        <input
                                            className={styles.input}
                                            value={currentLocation.hours || ''}
                                            onChange={e => setCurrentLocation({ ...currentLocation, hours: e.target.value })}
                                            placeholder="8:00 AM - 5:00 PM"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={currentLocation.active ?? true}
                                            onChange={e => setCurrentLocation({ ...currentLocation, active: e.target.checked })}
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                        <span className={styles.label} style={{ marginBottom: 0 }}>Location is active</span>
                                    </label>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                                    {currentLocation.id ? 'Save Changes' : 'Add Location'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && locationToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '400px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Delete Location</h3>
                            <button className={styles.modalClose} onClick={() => setShowDeleteConfirm(false)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ color: '#64748b' }}>
                                Are you sure you want to delete <strong>{locationToDelete.name}</strong>?
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
                                This action cannot be undone.
                            </p>
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
                                Delete Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
