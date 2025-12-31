'use client';

import styles from '../admin.module.css';
import { useProducts } from '@/context/ProductContext';

export default function InventoryPage() {
    const { products, updateProduct } = useProducts();

    const lowStockProducts = products.filter(p => (p.stock || 0) < 500 && (p.stock || 0) > 0);
    const outOfStockProducts = products.filter(p => (p.stock || 0) === 0);
    const inStockProducts = products.filter(p => (p.stock || 0) >= 500);

    const handleStockUpdate = (productId: number, newStock: number) => {
        updateProduct(productId, { stock: newStock });
    };

    return (
        <div>
            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total SKUs</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
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
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue} style={{ color: '#d97706' }}>{lowStockProducts.length}</p>
                    <span className={styles.statChange}>Needs restocking</span>
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
                                        ) : (product.stock || 0) < 500 ? (
                                            <span className={`${styles.badge} ${styles.badgeWarning}`}>Low Stock</span>
                                        ) : (
                                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>In Stock</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className={`${styles.btn} ${styles.btnOutline}`}
                                            style={{ padding: '6px 12px', fontSize: '12px', marginRight: '6px' }}
                                            onClick={() => handleStockUpdate(product.id, Math.max(0, (product.stock || 0) - 100))}
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
        </div>
    );
}
