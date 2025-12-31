'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../admin.module.css';
import { useProducts } from '@/context/ProductContext';

// Icons
const Icons = {
    Settings: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    ),
    Close: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Package: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
    ),
    AlertTriangle: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
};

// Types for settings
interface InventorySettings {
    lowStockNotifications: boolean;
    lowStockThreshold: number;
    reorderPercent: number;
    showStockOnFrontend: 'always' | 'low_only' | 'never';
    lowStockDisplayPercent: number;
    outOfStockDisplay: 'show' | 'hide' | 'badge';
}

// Mock damaged inventory items
const DAMAGED_INVENTORY = [
    { id: 1, productName: 'Common Brick - Red', quantity: 50, reason: 'Chipped during delivery', returnId: 'RET001', date: '2024-12-28' },
    { id: 2, productName: 'Interlocking Paver 80mm', quantity: 15, reason: 'Color defects', returnId: 'RET002', date: '2024-12-26' },
    { id: 3, productName: 'Standard Block 6"', quantity: 30, reason: 'Cracked', returnId: 'RET003', date: '2024-12-22' },
];

export default function InventoryPage() {
    const { products, updateProduct } = useProducts();
    const [activeTab, setActiveTab] = useState<'regular' | 'damaged'>('regular');
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<InventorySettings>({
        lowStockNotifications: true,
        lowStockThreshold: 500,
        reorderPercent: 20,
        showStockOnFrontend: 'low_only',
        lowStockDisplayPercent: 10,
        outOfStockDisplay: 'badge',
    });
    const settingsRef = useRef<HTMLDivElement>(null);

    // Close settings when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const lowStockProducts = products.filter(p => (p.stock || 0) < settings.lowStockThreshold && (p.stock || 0) > 0);
    const outOfStockProducts = products.filter(p => (p.stock || 0) === 0);
    const inStockProducts = products.filter(p => (p.stock || 0) >= settings.lowStockThreshold);

    const handleStockUpdate = (productId: number, newStock: number) => {
        updateProduct(productId, { stock: Math.max(0, newStock) });
    };

    const handleSettingChange = (key: keyof InventorySettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div>
            {/* Page Header with Tabs and Settings */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                    <button
                        onClick={() => setActiveTab('regular')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === 'regular' ? 'white' : 'transparent',
                            color: activeTab === 'regular' ? '#1e293b' : '#64748b',
                            fontWeight: 500,
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: activeTab === 'regular' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Icons.Package />
                        Regular Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('damaged')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeTab === 'damaged' ? 'white' : 'transparent',
                            color: activeTab === 'damaged' ? '#dc2626' : '#64748b',
                            fontWeight: 500,
                            fontSize: '14px',
                            cursor: 'pointer',
                            boxShadow: activeTab === 'damaged' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Icons.AlertTriangle />
                        Damaged ({DAMAGED_INVENTORY.length})
                    </button>
                </div>

                {/* Settings Button */}
                <div style={{ position: 'relative' }} ref={settingsRef}>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`${styles.btn} ${styles.btnOutline}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Icons.Settings />
                        Settings
                    </button>

                    {/* Settings Panel */}
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
                            width: '360px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                padding: '16px',
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Inventory Settings</h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                                >
                                    <Icons.Close />
                                </button>
                            </div>

                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Low Stock Notifications */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: '14px', color: '#475569' }}>Low Stock Notifications</label>
                                    <button
                                        onClick={() => handleSettingChange('lowStockNotifications', !settings.lowStockNotifications)}
                                        style={{
                                            width: '44px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: settings.lowStockNotifications ? '#0ea5e9' : '#e2e8f0',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'background 0.2s ease'
                                        }}
                                    >
                                        <span style={{
                                            position: 'absolute',
                                            top: '2px',
                                            left: settings.lowStockNotifications ? '22px' : '2px',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: 'white',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                            transition: 'left 0.2s ease'
                                        }}></span>
                                    </button>
                                </div>

                                {/* Low Stock Threshold */}
                                <div>
                                    <label style={{ fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>
                                        Low Stock Threshold
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.lowStockThreshold}
                                        onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                                        className={styles.input}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                {/* Reorder Notification % */}
                                <div>
                                    <label style={{ fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>
                                        Reorder Notification (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.reorderPercent}
                                        onChange={(e) => handleSettingChange('reorderPercent', parseInt(e.target.value) || 0)}
                                        className={styles.input}
                                        style={{ width: '100%' }}
                                        min="1"
                                        max="100"
                                    />
                                </div>

                                {/* Show Stock on Frontend */}
                                <div>
                                    <label style={{ fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>
                                        Show Stock on Frontend
                                    </label>
                                    <select
                                        value={settings.showStockOnFrontend}
                                        onChange={(e) => handleSettingChange('showStockOnFrontend', e.target.value)}
                                        className={styles.select}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="always">Always show quantities</option>
                                        <option value="low_only">Show only when low</option>
                                        <option value="never">Never show quantities</option>
                                    </select>
                                </div>

                                {/* Low Stock Display % (only if low_only) */}
                                {settings.showStockOnFrontend === 'low_only' && (
                                    <div>
                                        <label style={{ fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>
                                            "Few Left" Display Threshold (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.lowStockDisplayPercent}
                                            onChange={(e) => handleSettingChange('lowStockDisplayPercent', parseInt(e.target.value) || 0)}
                                            className={styles.input}
                                            style={{ width: '100%' }}
                                            min="1"
                                            max="100"
                                        />
                                    </div>
                                )}

                                {/* Out of Stock Display */}
                                <div>
                                    <label style={{ fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>
                                        Out of Stock Display
                                    </label>
                                    <select
                                        value={settings.outOfStockDisplay}
                                        onChange={(e) => handleSettingChange('outOfStockDisplay', e.target.value)}
                                        className={styles.select}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="show">Keep displayed (available)</option>
                                        <option value="badge">Mark as "Out of Stock"</option>
                                        <option value="hide">Hide from listings</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', background: '#fafbfc' }}>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    style={{ width: '100%' }}
                                >
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Regular Inventory Tab */}
            {activeTab === 'regular' && (
                <>
                    {/* Stats */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <p className={styles.statLabel}>Total SKUs</p>
                                <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                                    <Icons.Package />
                                </div>
                            </div>
                            <p className={styles.statValue}>{products.length}</p>
                            <span className={styles.statChange}>Active products</span>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <p className={styles.statLabel}>In Stock</p>
                                <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <p className={styles.statValue}>{inStockProducts.length}</p>
                            <span className={`${styles.statChange} ${styles.changePositive}`}>Healthy levels</span>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <p className={styles.statLabel}>Low Stock</p>
                                <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                                    <Icons.AlertTriangle />
                                </div>
                            </div>
                            <p className={styles.statValue} style={{ color: '#d97706' }}>{lowStockProducts.length}</p>
                            <span className={styles.statChange}>Below {settings.lowStockThreshold}</span>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <p className={styles.statLabel}>Out of Stock</p>
                                <div className={styles.statIcon} style={{ background: '#fee2e2', color: '#dc2626' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                </div>
                            </div>
                            <p className={styles.statValue} style={{ color: '#dc2626' }}>{outOfStockProducts.length}</p>
                            <span className={styles.statChange}>Requires action</span>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    {lowStockProducts.length > 0 && (
                        <div className={styles.tableCard} style={{ marginBottom: '24px' }}>
                            <div className={styles.tableHeader}>
                                <h2 className={styles.tableTitle}>⚠️ Low Stock Alerts</h2>
                            </div>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Current Stock</th>
                                            <th>Restock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lowStockProducts.map(product => (
                                            <tr key={product.id}>
                                                <td style={{ fontWeight: 500 }}>{product.name}</td>
                                                <td>
                                                    <span className={styles.badge} style={{ background: '#f1f5f9', color: '#475569', textTransform: 'capitalize' }}>
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`${styles.badge} ${styles.badgeWarning}`}>
                                                        {product.stock?.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className={`${styles.btn} ${styles.btnPrimary}`}
                                                        style={{ padding: '6px 12px', fontSize: '12px' }}
                                                        onClick={() => handleStockUpdate(product.id, (product.stock || 0) + 1000)}
                                                    >
                                                        + 1,000
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* All Inventory */}
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader}>
                            <h2 className={styles.tableTitle}>Inventory Overview</h2>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Stock Level</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td style={{ fontWeight: 500 }}>{product.name}</td>
                                            <td>
                                                <span className={styles.badge} style={{ background: '#f1f5f9', color: '#475569', textTransform: 'capitalize' }}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td>{product.stock?.toLocaleString() || 0}</td>
                                            <td>
                                                {(product.stock || 0) === 0 ? (
                                                    <span className={`${styles.badge} ${styles.badgeError}`}>Out of Stock</span>
                                                ) : (product.stock || 0) < settings.lowStockThreshold ? (
                                                    <span className={`${styles.badge} ${styles.badgeWarning}`}>Low Stock</span>
                                                ) : (
                                                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>In Stock</span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    className={`${styles.btn} ${styles.btnOutline}`}
                                                    style={{ padding: '6px 12px', fontSize: '12px', marginRight: '6px' }}
                                                    onClick={() => handleStockUpdate(product.id, (product.stock || 0) - 100)}
                                                >
                                                    - 100
                                                </button>
                                                <button
                                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    onClick={() => handleStockUpdate(product.id, (product.stock || 0) + 100)}
                                                >
                                                    + 100
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Damaged Inventory Tab */}
            {activeTab === 'damaged' && (
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Damaged Inventory</h2>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                            Items from returns marked as damaged
                        </span>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Reason</th>
                                    <th>Return ID</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DAMAGED_INVENTORY.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                            No damaged inventory items
                                        </td>
                                    </tr>
                                ) : (
                                    DAMAGED_INVENTORY.map(item => (
                                        <tr key={item.id}>
                                            <td style={{ fontWeight: 500 }}>{item.productName}</td>
                                            <td>
                                                <span className={`${styles.badge} ${styles.badgeError}`}>
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td style={{ color: '#64748b', fontSize: '13px' }}>{item.reason}</td>
                                            <td>
                                                <span style={{ color: '#0ea5e9', fontSize: '13px' }}>{item.returnId}</span>
                                            </td>
                                            <td style={{ color: '#64748b' }}>{item.date}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    className={`${styles.btn} ${styles.btnOutline}`}
                                                    style={{ padding: '6px 12px', fontSize: '12px', marginRight: '6px' }}
                                                >
                                                    Write Off
                                                </button>
                                                <button
                                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                >
                                                    Return to Stock
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
