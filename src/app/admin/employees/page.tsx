'use client';

import styles from '../admin.module.css';

export default function EmployeesPage() {
    const employees = [
        { id: 1, name: 'Sarah Mlambo', email: 'sarah@bricks.co.zw', role: 'Operations Manager', department: 'Operations', status: 'active', joined: '2023-01-15' },
        { id: 2, name: 'James Ncube', email: 'james@bricks.co.zw', role: 'Sales Executive', department: 'Sales', status: 'active', joined: '2023-03-20' },
        { id: 3, name: 'Grace Mutasa', email: 'grace@bricks.co.zw', role: 'Warehouse Supervisor', department: 'Logistics', status: 'active', joined: '2022-11-10' },
        { id: 4, name: 'Peter Dube', email: 'peter@bricks.co.zw', role: 'Accountant', department: 'Finance', status: 'on_leave', joined: '2023-06-01' },
    ];

    const getDepartmentBadge = (dept: string) => {
        const colors: Record<string, { bg: string; color: string }> = {
            'Operations': { bg: '#dbeafe', color: '#2563eb' },
            'Sales': { bg: '#dcfce7', color: '#16a34a' },
            'Logistics': { bg: '#fef3c7', color: '#d97706' },
            'Finance': { bg: '#f3e8ff', color: '#9333ea' },
        };
        const style = colors[dept] || { bg: '#f1f5f9', color: '#64748b' };
        return <span className={styles.badge} style={{ background: style.bg, color: style.color }}>{dept}</span>;
    };

    return (
        <div>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Employees</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{employees.length}</p>
                    <span className={styles.statChange}>Team members</span>
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
                        {employees.filter(e => e.status === 'active').length}
                    </p>
                    <span className={styles.statChange}>Currently working</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>On Leave</p>
                        <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#d97706' }}>
                        {employees.filter(e => e.status === 'on_leave').length}
                    </p>
                    <span className={styles.statChange}>Away</span>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Departments</p>
                        <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{new Set(employees.map(e => e.department)).size}</p>
                    <span className={styles.statChange}>Teams</span>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Team Directory</h2>
                    <button className={`${styles.btn} ${styles.btnPrimary}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="19" y1="8" x2="19" y2="14"></line>
                            <line x1="22" y1="11" x2="16" y2="11"></line>
                        </svg>
                        Add Employee
                    </button>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Joined</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td style={{ fontWeight: 500 }}>{emp.name}</td>
                                    <td style={{ color: '#64748b' }}>{emp.email}</td>
                                    <td>{emp.role}</td>
                                    <td>{getDepartmentBadge(emp.department)}</td>
                                    <td style={{ color: '#64748b', fontSize: '13px' }}>{emp.joined}</td>
                                    <td>
                                        {emp.status === 'active' ? (
                                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>
                                        ) : (
                                            <span className={`${styles.badge} ${styles.badgeWarning}`}>On Leave</span>
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
