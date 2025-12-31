'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import styles from '../account.module.css';

export default function WishlistPage() {
    const { getWishlistProducts, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const wishlistProducts = getWishlistProducts();

    const handleAddToCart = (product: any) => {
        addToCart({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            image: product.image
        });
        // Optional: remove from wishlist after adding to cart
        // removeFromWishlist(product.id);
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>My Wishlist</h1>
                <p className={styles.pageSubtitle}>Saved items you want to purchase later</p>
            </div>

            {wishlistProducts.length === 0 ? (
                <div className={styles.card} style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div style={{
                        width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                        color: '#94a3b8'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Your wishlist is empty</h3>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>Explore our catalog and save items you love.</p>
                    <a href="/products" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Browse Products
                    </a>
                </div>
            ) : (
                <div className={styles.productGrid}>
                    {wishlistProducts.map(product => (
                        <div key={product.id} className={styles.productCard}>
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className={styles.removeBtn}
                                title="Remove from wishlist"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <img
                                src={product.image || product.imageUrl}
                                alt={product.name}
                                className={styles.productImage}
                            />
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productPrice}>${product.price.toFixed(2)} / {product.unit.replace('per ', '')}</p>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
                                    Inclusive of VAT
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
