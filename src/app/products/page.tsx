'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

import { useProducts, Product } from '@/context/ProductContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useCart } from '@/context/CartContext';

// Add to Cart Button with feedback
function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            image: product.image || ''
        });

        // Show feedback
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    return (
        <button
            onClick={handleAddToCart}
            className={styles.addToCartBtn}
            style={{
                background: isAdded ? '#10b981' : 'var(--primary)',
                transform: isAdded ? 'scale(1.02)' : 'scale(1)'
            }}
            title="Add to cart"
        >
            {isAdded ? (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Added!
                </>
            ) : (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                </>
            )}
        </button>
    );
}

function WishlistButton({ productId, onLoginRequired }: { productId: number; onLoginRequired: () => void }) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { isAuthenticated } = useCustomerAuth();
    const isSaved = isInWishlist(productId);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            onLoginRequired();
            return;
        }

        isSaved ? removeFromWishlist(productId) : addToWishlist(productId);
    };

    return (
        <button
            onClick={handleClick}
            className={styles.iconBtn}
            style={{
                background: isSaved ? '#fee2e2' : 'white',
                borderColor: isSaved ? '#ef4444' : '#e2e8f0',
                color: isSaved ? '#ef4444' : '#64748b'
            }}
            title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        </button>
    );
}

// Login Prompt Modal
function LoginPromptModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div style={{ textAlign: 'center', padding: '24px' }}>
                    <div style={{
                        width: '64px', height: '64px', background: '#f0f9ff', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                        color: 'var(--primary)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
                        Save to Your Wishlist
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
                        Sign in or create an account to save items to your wishlist and access them anytime.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            onClick={() => router.push('/login?redirect=/products')}
                            style={{
                                padding: '12px 24px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => router.push('/register?redirect=/products')}
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const { products } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);

    const categories = [
        { id: 'all', name: 'All Products' },
        { id: 'bricks', name: 'Bricks' },
        { id: 'pavers', name: 'Pavers' },
        { id: 'blocks', name: 'Blocks' },
        { id: 'slabs', name: 'Slabs' },
        { id: 'curbs', name: 'Curbs & Copings' },
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>Our Products</h1>
                    <p className={styles.subtitle}>
                        Quality construction materials for every project
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className={styles.filters}>
                <div className="container">
                    <div className={styles.filterBar}>
                        <div className={styles.searchBox}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <div className={styles.categoryFilter}>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.categoryBtnActive : ''}`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className={styles.products}>
                <div className="container">
                    <p className={styles.resultCount}>{filteredProducts.length} products found</p>
                    <div className={styles.grid}>
                        {filteredProducts.map(product => (
                            <div key={product.id} className={styles.card}>
                                <div className={styles.cardImage}>
                                    {product.image && (product.image.startsWith('/') || product.image.startsWith('http') || product.image.startsWith('data:')) ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={styles.productImg}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove(styles.hidden);
                                            }}
                                        />
                                    ) : null}
                                    <span className={`${styles.cardEmoji} ${product.image && (product.image.startsWith('/') || product.image.startsWith('http') || product.image.startsWith('data:')) ? styles.hidden : ''}`}>
                                        {product.category === 'bricks' ? '🧱' :
                                            product.category === 'pavers' ? '🛤️' :
                                                product.category === 'blocks' ? '📦' :
                                                    product.category === 'slabs' ? '⬛' : '🏗️'}
                                    </span>
                                </div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardCategory}>{product.category}</span>
                                    <h3 className={styles.cardName}>{product.name}</h3>
                                    <div className={styles.cardColors}>
                                        {product.colors.map((color, idx) => (
                                            <span key={idx} className={styles.colorTag}>{color}</span>
                                        ))}
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <div>
                                            <div className={styles.cardPrice}>
                                                <span className={styles.priceValue}>${product.price.toFixed(2)}</span>
                                                <span className={styles.priceUnit}>{product.unit}</span>
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                                                Inclusive of VAT
                                            </div>
                                        </div>
                                        <div className={styles.cardActions}>
                                            <Link href={`/products/${product.id}`} className={styles.iconBtn} title="View details">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </Link>
                                            <WishlistButton productId={product.id} onLoginRequired={() => setShowLoginModal(true)} />
                                        </div>
                                    </div>
                                    <AddToCartButton product={product} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Login Modal */}
            <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}
