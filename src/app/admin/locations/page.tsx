'use client';

import styles from '../admin.module.css';

export default function LocationsPage() {
    const locations = [
        { id: 1, name: 'Harare Central', address: '14 Samora Machel Ave, Harare', type: 'warehouse', hours: '7:00 AM - 5:00 PM', active: true },
        { id: 2, name: 'Bulawayo Branch', address: '23 Fort St, Bulawayo', type: 'branch', hours: '8:00 AM - 4:00 PM', active: true },
        { id: 3, name: 'Mutare Depot', address: '5 Main St, Mutare', type: 'depot', hours: '8:00 AM - 3:00 PM', active: true },
        { id: 4, name: 'Gweru Collection Point', address: '89 Robert Mugabe Way, Gweru', type: 'pickup', hours: '9:00 AM - 2:00 PM', active: false },
    ];

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'warehouse': return <span className={`${styles.badge}`} style={{ background: '#dbeafe', color: '#2563eb' }}>Warehouse</span>;
            case 'branch': return <span className={`${styles.badge}`} style={{ background: '#dcfce7', color: '#16a34a' }}>Branch</span>;
            case 'depot': return <span className={`${styles.badge}`} style={{ background: '#fef3c7', color: '#d97706' }}>Depot</span>;
            case 'pickup': return <span className={`${styles.badge}`} style={{ background: '#f3e8ff', color: '#9333ea' }}>Pickup Point</span>;
            default: return <span className={styles.badge}>{type}</span>;
        }
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
                    <button className={`${styles.btn} ${styles.btnPrimary}`}>
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
                                        {location.active ? (
                                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>
                                        ) : (
                                            <span className={`${styles.badge}`} style={{ background: '#f1f5f9', color: '#64748b' }}>Inactive</span>
                                        )}
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
