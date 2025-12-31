'use client';

import { useState, useRef } from 'react';
import styles from '../admin.module.css';
import { useProducts, Product } from '@/context/ProductContext';

// Category Icons
const CategoryIcons = {
    bricks: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="6" rx="1"></rect>
            <rect x="2" y="14" width="9" height="6" rx="1"></rect>
            <rect x="13" y="14" width="9" height="6" rx="1"></rect>
        </svg>
    ),
    pavers: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
        </svg>
    ),
    blocks: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
    ),
    slabs: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <line x1="3" y1="12" x2="21" y2="12"></line>
        </svg>
    ),
    curbs: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19h16"></path>
            <path d="M4 15h16"></path>
            <path d="M4 11h16"></path>
            <rect x="4" y="4" width="16" height="4" rx="1"></rect>
        </svg>
    )
};

export default function AdminProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Omit<Product, 'colors'>> & { colors?: string }>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (product: Product) => {
        setCurrentProduct({
            ...product,
            colors: product.colors.join(', ')
        } as Partial<Omit<Product, 'colors'>> & { colors?: string });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentProduct({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct({});
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            ...currentProduct,
            price: Number(currentProduct.price),
            stock: Number(currentProduct.stock),
            colors: typeof currentProduct.colors === 'string'
                ? (currentProduct.colors as string).split(',').map((c: string) => c.trim())
                : currentProduct.colors || ['Grey'],
            image: currentProduct.image || ''
        };

        if (currentProduct.id) {
            updateProduct(currentProduct.id, productData);
        } else {
            // @ts-ignore
            addProduct({ ...productData, category: productData.category || 'bricks', unit: productData.unit || 'per unit' });
        }
        handleCloseModal();
    };

    const getCategoryIcon = (category: string) => {
        const IconComponent = CategoryIcons[category as keyof typeof CategoryIcons] || CategoryIcons.blocks;
        return <IconComponent />;
    };

    const categories = ['all', 'bricks', 'pavers', 'blocks', 'slabs', 'curbs'];

    return (
        <div>
            {/* Stats Row */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <p className={styles.statLabel}>Total Products</p>
                        <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className={styles.statValue}>{products.length}</p>
                    <span className={styles.statChange}>All categories</span>
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
                    <p className={styles.statValue}>{products.filter(p => (p.stock || 0) >= 500).length}</p>
                    <span className={`${styles.statChange} ${styles.changePositive}`}>Healthy inventory</span>
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
                    <p className={styles.statValue} style={{ color: '#d97706' }}>
                        {products.filter(p => (p.stock || 0) < 500 && (p.stock || 0) > 0).length}
                    </p>
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
                    <p className={styles.statValue} style={{ color: '#dc2626' }}>
                        {products.filter(p => (p.stock || 0) === 0).length}
                    </p>
                    <span className={styles.statChange}>Requires action</span>
                </div>
            </div>

            {/* Products Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <h2 className={styles.tableTitle}>Product Catalog</h2>
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                            {filteredProducts.length} of {products.length} products
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '8px 12px 8px 36px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    width: '200px'
                                }}
                            />
                        </div>
                        {/* Filter */}
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '13px',
                                background: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Product
                        </button>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}></th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right', width: '100px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#64748b'
                                        }}>
                                            {getCategoryIcon(product.category)}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{product.name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{product.unit}</div>
                                    </td>
                                    <td>
                                        <span className={styles.badge} style={{ background: '#f1f5f9', color: '#475569', textTransform: 'capitalize' }}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#1e293b' }}>${product.price.toFixed(2)}</td>
                                    <td style={{ color: '#64748b' }}>{product.stock?.toLocaleString() || 0}</td>
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
                                            className={styles.btn}
                                            style={{ padding: '6px', marginRight: '6px', color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                            onClick={() => handleEdit(product)}
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
                                            onClick={() => handleDelete(product.id)}
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

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {currentProduct.id ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button className={styles.modalClose} onClick={handleCloseModal}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Product Name</label>
                                        <input
                                            className={styles.input}
                                            value={currentProduct.name || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Category</label>
                                        <select
                                            className={styles.select}
                                            value={currentProduct.category || 'bricks'}
                                            onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                        >
                                            <option value="bricks">Bricks</option>
                                            <option value="pavers">Pavers</option>
                                            <option value="blocks">Blocks</option>
                                            <option value="slabs">Slabs</option>
                                            <option value="curbs">Curbs & Copings</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={styles.input}
                                            value={currentProduct.price || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Stock Quantity</label>
                                        <input
                                            type="number"
                                            className={styles.input}
                                            value={currentProduct.stock || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Unit</label>
                                        <input
                                            className={styles.input}
                                            value={currentProduct.unit || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                                            placeholder="per brick"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Available Colors</label>
                                    <input
                                        className={styles.input}
                                        value={currentProduct.colors || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, colors: e.target.value })}
                                        placeholder="Red, Black, Grey (comma separated)"
                                    />
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                                    {currentProduct.id ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
