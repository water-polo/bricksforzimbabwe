'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './admin.module.css';

// Clean 1.5px stroke icons
const Icons = {
    Dashboard: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
        </svg>
    ),
    Orders: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M9 21V9"></path>
        </svg>
    ),
    Inventory: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    ),
    Catalog: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
    ),
    Customers: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    Support: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
            <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
            <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
            <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
            <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
        </svg>
    ),
    Deliveries: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2"></rect>
            <path d="M16 8h4l3 3v5h-7V8z"></path>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
    ),
    Locations: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    ),
    Drivers: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    ),
    Returns: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
    ),
    Employees: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
    ),
    Transactions: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="M7 15h0M2 9.5h20"></path>
        </svg>
    ),
    Settings: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    ),
    Quotations: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    ),
    Notification: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
    ),
    Logout: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
    ),
    ChevronDown: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    ),
    ChevronLeft: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    ),
    Sun: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    )
};

// Navigation structure
const navSections = [
    {
        items: [
            { label: 'Dashboard', href: '/admin', icon: Icons.Dashboard },
            { label: 'Orders', href: '/admin/orders', icon: Icons.Orders },
            { label: 'Quotations', href: '/admin/quotations', icon: Icons.Quotations },
            { label: 'Inventory', href: '/admin/inventory', icon: Icons.Inventory },
            { label: 'Catalog', href: '/admin/products', icon: Icons.Catalog },
            { label: 'Customers', href: '/admin/customers', icon: Icons.Customers },
        ]
    },
    {
        label: 'Logistics',
        items: [
            { label: 'Deliveries', href: '/admin/deliveries', icon: Icons.Deliveries },
            { label: 'Pickup Locations', href: '/admin/locations', icon: Icons.Locations },
            { label: 'Drivers', href: '/admin/drivers', icon: Icons.Drivers },
            { label: 'Returns', href: '/admin/returns', icon: Icons.Returns },
        ]
    },
    {
        label: 'Team',
        items: [
            { label: 'Employees', href: '/admin/employees', icon: Icons.Employees },
            { label: 'Transactions', href: '/admin/transactions', icon: Icons.Transactions },
        ]
    }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, isLoading, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const getPageTitle = () => {
        for (const section of navSections) {
            const item = section.items.find(i => i.href === pathname);
            if (item) return item.label;
        }
        if (pathname.includes('/products')) return 'Catalog';
        if (pathname.includes('/orders')) return 'Orders';
        return 'Dashboard';
    };

    const getPageSubtitle = () => {
        switch (pathname) {
            case '/admin': return 'Welcome back! Here\'s what\'s happening today.';
            case '/admin/products': return 'Manage your product catalog and pricing.';
            case '/admin/orders': return 'Track and manage customer orders.';
            case '/admin/customers': return 'View and manage your customers.';
            case '/admin/inventory': return 'Monitor stock levels and inventory.';
            case '/admin/deliveries': return 'Manage deliveries and schedules.';
            case '/admin/returns': return 'Process returns and refunds.';
            case '/admin/employees': return 'Manage your team members.';
            case '/admin/quotations': return 'Manage customer quote requests.';
            default: return 'Manage your store efficiently.';
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).toUpperCase();

    const isLinkActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
                {/* Sidebar Header */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoWrapper}>
                        <div className={styles.logoIcon}>B</div>
                        {!sidebarCollapsed && (
                            <>
                                <span className={styles.logoText}>Bricks</span>
                                <span className={styles.logoBadge}>ADMIN</span>
                            </>
                        )}
                    </div>
                    <button
                        className={styles.collapseBtn}
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        <Icons.ChevronLeft />
                    </button>
                </div>

                {/* Navigation */}
                <nav className={styles.sidebarNav}>
                    {navSections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className={styles.navSection}>
                            {section.label && !sidebarCollapsed && (
                                <div className={styles.sidebarSectionLabel}>{section.label}</div>
                            )}
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = isLinkActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                                        title={sidebarCollapsed ? item.label : undefined}
                                    >
                                        <Icon />
                                        {!sidebarCollapsed && <span>{item.label}</span>}
                                        {isActive && !sidebarCollapsed && <span className={styles.activeIndicator}>•</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className={styles.sidebarFooter}>
                    {!sidebarCollapsed && (
                        <div className={styles.themeToggle}>
                            <Icons.Sun />
                            <span>Light</span>
                            <Icons.ChevronDown />
                        </div>
                    )}

                    <div className={styles.sidebarUser}>
                        <div className={styles.userAvatar}>A</div>
                        {!sidebarCollapsed && (
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>Bricks Admin</span>
                                <span className={styles.userRole}>ADMINISTRATOR</span>
                            </div>
                        )}
                    </div>

                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                        title="Sign Out"
                    >
                        <Icons.Logout />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`${styles.mainWrapper} ${sidebarCollapsed ? styles.mainWrapperExpanded : ''}`}>
                {/* Top Header */}
                <header className={styles.topHeader}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
                        <p className={styles.pageSubtitle}>{getPageSubtitle()}</p>
                    </div>

                    <div className={styles.headerRight}>
                        <span className={styles.headerDate}>{currentDate}</span>

                        {/* Notifications */}
                        <div className={styles.headerAction} ref={notifRef}>
                            <button
                                className={styles.iconBtn}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Icons.Notification />
                                <span className={styles.notifBadge}></span>
                            </button>
                            {showNotifications && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <span>Notifications</span>
                                        <button className={styles.dropdownAction}>Mark all read</button>
                                    </div>
                                    <div className={styles.dropdownItem}>
                                        <div className={styles.notifDot} style={{ background: '#22c55e' }}></div>
                                        <div>
                                            <p className={styles.notifText}>New order received</p>
                                            <span className={styles.notifTime}>2 minutes ago</span>
                                        </div>
                                    </div>
                                    <div className={styles.dropdownItem}>
                                        <div className={styles.notifDot} style={{ background: '#f59e0b' }}></div>
                                        <div>
                                            <p className={styles.notifText}>Low stock: Common Brick</p>
                                            <span className={styles.notifTime}>1 hour ago</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className={styles.headerAction} ref={userMenuRef}>
                            <button
                                className={styles.userMenuBtn}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className={styles.headerAvatar}>BA</div>
                            </button>
                            {showUserMenu && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownUserInfo}>
                                        <div className={styles.headerAvatar} style={{ width: '40px', height: '40px' }}>BA</div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Bricks Admin</p>
                                            <p style={{ fontSize: '12px', color: '#64748b' }}>admin@bricks.co.zw</p>
                                        </div>
                                    </div>
                                    <button className={styles.dropdownItem}>
                                        <Icons.Settings />
                                        <span>Settings</span>
                                    </button>
                                    <button className={styles.dropdownItem} onClick={handleLogout} style={{ color: '#dc2626' }}>
                                        <Icons.Logout />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className={styles.mainContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}
