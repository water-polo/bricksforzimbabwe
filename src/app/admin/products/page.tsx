'use client';

import { useState, useRef } from 'react';
import styles from '../admin.module.css';
import { useProducts, Product, ProductImage } from '@/context/ProductContext';

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
    const [currentProduct, setCurrentProduct] = useState<Partial<Omit<Product, 'colors'>> & { colors?: string; images?: ProductImage[] }>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newImageType, setNewImageType] = useState<'single' | 'group' | 'project'>('single');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleEdit = (product: Product) => {
        setCurrentProduct({
            ...product,
            colors: product.colors.join(', '),
            images: product.images || (product.image ? [{ url: product.image, type: 'single' as const, enabled: true }] : [])
        } as Partial<Omit<Product, 'colors'>> & { colors?: string; images?: ProductImage[] });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentProduct({ images: [] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct({});
        setNewImageUrl('');
        setNewImageType('single');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    // Image Gallery Management Functions
    const handleAddImage = () => {
        if (!newImageUrl.trim()) return;
        const newImage: ProductImage = {
            url: newImageUrl.trim(),
            type: newImageType,
            enabled: true
        };
        setCurrentProduct({
            ...currentProduct,
            images: [...(currentProduct.images || []), newImage]
        });
        setNewImageUrl('');
        setNewImageType('single');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Url = event.target?.result as string;
            const newImage: ProductImage = {
                url: base64Url,
                type: newImageType,
                enabled: true
            };
            setCurrentProduct({
                ...currentProduct,
                images: [...(currentProduct.images || []), newImage]
            });
            setNewImageType('single');
        };
        reader.readAsDataURL(file);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        const images = [...(currentProduct.images || [])];
        images.splice(index, 1);
        setCurrentProduct({ ...currentProduct, images });
    };

    const handleToggleImage = (index: number) => {
        const images = [...(currentProduct.images || [])];
        images[index] = { ...images[index], enabled: !images[index].enabled };
        setCurrentProduct({ ...currentProduct, images });
    };

    const handleUpdateImageType = (index: number, type: 'single' | 'group' | 'project') => {
        const images = [...(currentProduct.images || [])];
        images[index] = { ...images[index], type };
        setCurrentProduct({ ...currentProduct, images });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const images = currentProduct.images || [];
        const primaryImage = images.find(img => img.enabled)?.url || currentProduct.image || '';

        const productData = {
            ...currentProduct,
            price: Number(currentProduct.price),
            stock: Number(currentProduct.stock),
            colors: typeof currentProduct.colors === 'string'
                ? (currentProduct.colors as string).split(',').map((c: string) => c.trim())
                : currentProduct.colors || ['Grey'],
            image: primaryImage,
            images: images
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

    const imageTypeLabels = {
        single: 'Single Product',
        group: 'Multiple Products',
        project: 'In-Project Shot'
    };

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
                                <tr
                                    key={product.id}
                                    onClick={() => handleEdit(product)}
                                    style={{ cursor: 'pointer' }}
                                    className={styles.tableRowClickable}
                                >
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
                                    <td onClick={e => e.stopPropagation()}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                                className={styles.btn}
                                                style={{
                                                    padding: '8px',
                                                    color: '#64748b',
                                                    background: '#f8fafc',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => handleEdit(product)}
                                                title="Edit"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                className={styles.btn}
                                                style={{
                                                    padding: '8px',
                                                    color: '#dc2626',
                                                    background: '#fef2f2',
                                                    border: '1px solid #fee2e2',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => handleDelete(product.id)}
                                                title="Delete"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
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

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Description</label>
                                    <textarea
                                        className={styles.input}
                                        style={{ minHeight: '80px', resize: 'vertical' }}
                                        value={currentProduct.description || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        placeholder="Enter product description..."
                                    />
                                </div>

                                {/* Image Gallery Manager */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                            <polyline points="21 15 16 10 5 21"></polyline>
                                        </svg>
                                        Product Images Gallery
                                    </label>

                                    {/* Add New Image - Two Methods */}
                                    <div style={{ marginBottom: '16px' }}>
                                        {/* Image Type Selector - shared between both methods */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '12px'
                                        }}>
                                            <span style={{ fontSize: '12px', color: '#64748b' }}>Image Type:</span>
                                            <select
                                                className={styles.select}
                                                value={newImageType}
                                                onChange={e => setNewImageType(e.target.value as 'single' | 'group' | 'project')}
                                                style={{ width: 'auto', minWidth: '180px', padding: '6px 10px', fontSize: '13px' }}
                                            >
                                                <option value="single">● Single Product</option>
                                                <option value="group">◐ Multiple Products</option>
                                                <option value="project">◧ In-Project Shot</option>
                                            </select>
                                        </div>

                                        {/* Two-column layout for Upload and URL */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '12px'
                                        }}>
                                            {/* Option 1: File Upload */}
                                            <div
                                                style={{
                                                    padding: '20px',
                                                    background: '#f8fafc',
                                                    borderRadius: '10px',
                                                    border: '2px dashed #cbd5e1',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease'
                                                }}
                                                onClick={() => fileInputRef.current?.click()}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    e.currentTarget.style.borderColor = '#0ea5e9';
                                                    e.currentTarget.style.background = '#f0f9ff';
                                                }}
                                                onDragLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                                    e.currentTarget.style.background = '#f8fafc';
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                                    e.currentTarget.style.background = '#f8fafc';
                                                    const file = e.dataTransfer.files[0];
                                                    if (file && file.type.startsWith('image/')) {
                                                        const input = fileInputRef.current;
                                                        if (input) {
                                                            const dataTransfer = new DataTransfer();
                                                            dataTransfer.items.add(file);
                                                            input.files = dataTransfer.files;
                                                            handleFileUpload({ target: input } as React.ChangeEvent<HTMLInputElement>);
                                                        }
                                                    }
                                                }}
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                    style={{ display: 'none' }}
                                                />
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" style={{ margin: '0 auto 8px' }}>
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="17 8 12 3 7 8"></polyline>
                                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                                </svg>
                                                <div style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', marginBottom: '4px' }}>
                                                    Upload Image
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                                    Drag & drop or click to browse
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '4px' }}>
                                                    Max 5MB • JPG, PNG, WebP
                                                </div>
                                            </div>

                                            {/* Option 2: URL Input */}
                                            <div style={{
                                                padding: '16px',
                                                background: '#f8fafc',
                                                borderRadius: '10px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                                    </svg>
                                                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>
                                                        Or use Image URL
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <input
                                                        className={styles.input}
                                                        value={newImageUrl}
                                                        onChange={e => setNewImageUrl(e.target.value)}
                                                        placeholder="/products/image.png"
                                                        style={{ margin: 0, flex: 1, fontSize: '13px' }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddImage();
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleAddImage}
                                                        className={`${styles.btn} ${styles.btnPrimary}`}
                                                        style={{ padding: '8px 14px' }}
                                                        disabled={!newImageUrl.trim()}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>
                                                    Enter full URL or path to existing image
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image List */}
                                    {(currentProduct.images?.length || 0) > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {currentProduct.images?.map((img, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '60px 1fr auto auto auto',
                                                        gap: '12px',
                                                        alignItems: 'center',
                                                        padding: '10px 12px',
                                                        background: img.enabled ? 'white' : '#f8fafc',
                                                        border: '1px solid',
                                                        borderColor: img.enabled ? '#e2e8f0' : '#f1f5f9',
                                                        borderRadius: '8px',
                                                        opacity: img.enabled ? 1 : 0.6
                                                    }}
                                                >
                                                    {/* Thumbnail */}
                                                    <div style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '6px',
                                                        background: '#f1f5f9',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <img
                                                            src={img.url}
                                                            alt={`Image ${index + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                (e.target as HTMLImageElement).parentElement!.innerHTML =
                                                                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Image URL */}
                                                    <div style={{ overflow: 'hidden' }}>
                                                        <div style={{
                                                            fontSize: '13px',
                                                            color: '#1e293b',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                            {img.url}
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                                            {imageTypeLabels[img.type]}
                                                        </div>
                                                    </div>

                                                    {/* Type Selector */}
                                                    <select
                                                        className={styles.select}
                                                        value={img.type}
                                                        onChange={e => handleUpdateImageType(index, e.target.value as 'single' | 'group' | 'project')}
                                                        style={{ width: 'auto', minWidth: '140px', padding: '6px 10px', fontSize: '12px' }}
                                                    >
                                                        <option value="single">Single Product</option>
                                                        <option value="group">Multiple Products</option>
                                                        <option value="project">In-Project Shot</option>
                                                    </select>

                                                    {/* Toggle Enable/Disable */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleImage(index)}
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '8px',
                                                            border: '1px solid',
                                                            borderColor: img.enabled ? '#16a34a' : '#e2e8f0',
                                                            background: img.enabled ? '#dcfce7' : '#f8fafc',
                                                            color: img.enabled ? '#16a34a' : '#94a3b8',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        title={img.enabled ? 'Visible on frontend (click to hide)' : 'Hidden from frontend (click to show)'}
                                                    >
                                                        {img.enabled ? (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                <circle cx="12" cy="12" r="3"></circle>
                                                            </svg>
                                                        ) : (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                                            </svg>
                                                        )}
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '8px',
                                                            border: '1px solid #fee2e2',
                                                            background: '#fef2f2',
                                                            color: '#dc2626',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        title="Delete image"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: '24px',
                                            textAlign: 'center',
                                            background: '#f8fafc',
                                            borderRadius: '8px',
                                            border: '1px dashed #e2e8f0',
                                            color: '#94a3b8',
                                            fontSize: '13px'
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px' }}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                            <div>No images added yet</div>
                                            <div style={{ fontSize: '11px', marginTop: '4px' }}>Add images using the form above</div>
                                        </div>
                                    )}

                                    {/* Help Text */}
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '10px 12px',
                                        background: '#eff6ff',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        color: '#1e40af'
                                    }}>
                                        <strong>Tip:</strong> Add 3 images for best results: Single product shot, multiple products grouped, and an in-project/installed photo.
                                        Use the eye icon to show/hide images on the frontend.
                                    </div>
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
