'use client';

import styles from '../admin.module.css';

export default function DriversPage() {
    const drivers = [
        { id: 1, name: 'Tendai Moyo', phone: '+263 77 123 4567', vehicle: 'Isuzu NQR', license: 'AE123456', status: 'active', deliveries: 45 },
        { id: 2, name: 'Chipo Ndlovu', phone: '+263 77 234 5678', vehicle: 'Hino 300', license: 'AE234567', status: 'active', deliveries: 38 },
        { id: 3, name: 'Tapiwa Khumalo', phone: '+263 77 345 6789', vehicle: 'Tata Ultra', license: 'AE345678', status: 'off_duty', deliveries: 52 },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>;
            case 'off_duty': return <span className={`${styles.badge}`} style={{ background: '#f1f5f9', color: '#64748b' }}>Off Duty</span>;
            case 'on_leave': return <span className={`${styles.badge} ${styles.badgeWarning}`}>On Leave</span>;
            default: return <span className={styles.badge}>{status}</span>;
        }
    };

    return (
        <div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Drivers</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{drivers.length}</p>
                    <span className={styles.statChange}>Registered drivers</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Active Now</p>
                        <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#16a34a' }}>
                        {drivers.filter(d => d.status === 'active').length}
                    </p>
                    <span className={styles.statChange}>On the road</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Deliveries</p>
                        <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                                <path d="M16 8h4l3 3v5h-7V8z"></path>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{drivers.reduce((sum, d) => sum + d.deliveries, 0)}</p>
                    <span className={styles.statChange}>This month</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Avg. per Driver</p>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>
                        {Math.round(drivers.reduce((sum, d) => sum + d.deliveries, 0) / drivers.length)}
                    </p>
                    <span className={styles.statChange}>Deliveries</span>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Driver Directory</h2>
                    <button className={`${styles.btn} ${styles.btnPrimary}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Driver
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
                                <th>Deliveries</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map(driver => (
                                <tr key={driver.id}>
                                    <td style={{ fontWeight: 500 }}>{driver.name}</td>
                                    <td style={{ color: '#64748b' }}>{driver.phone}</td>
                                    <td>{driver.vehicle}</td>
                                    <td style={{ color: '#64748b', fontFamily: 'monospace' }}>{driver.license}</td>
                                    <td>{driver.deliveries}</td>
                                    <td>{getStatusBadge(driver.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
