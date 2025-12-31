'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import styles from './page.module.css';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { isAuthenticated } = useCustomerAuth();

    const productId = Number(params.id);
    const product = products.find(p => p.id === productId);

    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    if (!product) {
        return (
            <div className={styles.notFound}>
                <div className={styles.notFoundContent}>
                    <h1>Product Not Found</h1>
                    <p>Sorry, we couldn't find the product you're looking for.</p>
                    <Link href="/products" className={styles.backBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const isSaved = isInWishlist(product.id);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            unit: product.unit,
            image: product.image || ''
        }, quantity);

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleWishlistClick = () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }
        isSaved ? removeFromWishlist(product.id) : addToWishlist(product.id);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 1) {
            setQuantity(val);
        }
    };

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className={styles.page}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <div className="container">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/products">Products</Link>
                    <span>/</span>
                    <span className={styles.currentPage}>{product.name}</span>
                </div>
            </div>

            {/* Product Detail */}
            <section className={styles.productSection}>
                <div className="container">
                    <div className={styles.productGrid}>
                        {/* Product Image */}
                        <div className={styles.imageSection}>
                            <div className={styles.mainImage}>
                                {product.image && (product.image.startsWith('/') || product.image.startsWith('http') || product.image.startsWith('data:')) ? (
                                    <img src={product.image} alt={product.name} />
                                ) : (
                                    <span className={styles.emoji}>
                                        {product.category === 'bricks' ? '🧱' :
                                            product.category === 'pavers' ? '🛤️' :
                                                product.category === 'blocks' ? '📦' :
                                                    product.category === 'slabs' ? '⬛' : '🏗️'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className={styles.infoSection}>
                            <span className={styles.category}>{product.category}</span>
                            <h1 className={styles.productName}>{product.name}</h1>

                            <div className={styles.priceSection}>
                                <span className={styles.price}>${product.price.toFixed(2)}</span>
                                <span className={styles.unit}>{product.unit}</span>
                            </div>
                            <p className={styles.vatNote}>Price inclusive of VAT</p>

                            {product.colors && product.colors.length > 0 && (
                                <div className={styles.colorsSection}>
                                    <h3>Available Colors</h3>
                                    <div className={styles.colorTags}>
                                        {product.colors.map((color, idx) => (
                                            <span key={idx} className={styles.colorTag}>{color}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.dimensions && (
                                <div className={styles.dimensionsSection}>
                                    <h3>Dimensions</h3>
                                    <p>{product.dimensions}</p>
                                </div>
                            )}

                            <div className={styles.stockInfo}>
                                {product.stock > 10 ? (
                                    <span className={styles.inStock}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        In Stock ({product.stock} available)
                                    </span>
                                ) : product.stock > 0 ? (
                                    <span className={styles.lowStock}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        Low Stock (Only {product.stock} left)
                                    </span>
                                ) : (
                                    <span className={styles.outOfStock}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="15" y1="9" x2="9" y2="15"></line>
                                            <line x1="9" y1="9" x2="15" y2="15"></line>
                                        </svg>
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className={styles.purchaseSection}>
                                <div className={styles.quantitySelector}>
                                    <label>Quantity</label>
                                    <div className={styles.quantityInput}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            min="1"
                                        />
                                        <button onClick={() => setQuantity(quantity + 1)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.actionButtons}>
                                    <button
                                        className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`}
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                    >
                                        {isAdded ? (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                Added to Cart!
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="9" cy="21" r="1"></circle>
                                                    <circle cx="20" cy="21" r="1"></circle>
                                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                </svg>
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className={`${styles.wishlistBtn} ${isSaved ? styles.wishlistActive : ''}`}
                                        onClick={handleWishlistClick}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className={styles.features}>
                                <div className={styles.feature}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                                        <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                                        <path d="M8 21h8M12 17v4"></path>
                                    </svg>
                                    <span>Fast Delivery</span>
                                </div>
                                <div className={styles.feature}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                    <span>Quality Guaranteed</span>
                                </div>
                                <div className={styles.feature}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>Expert Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className={styles.relatedSection}>
                    <div className="container">
                        <h2>Related Products</h2>
                        <div className={styles.relatedGrid}>
                            {relatedProducts.map(related => (
                                <Link href={`/products/${related.id}`} key={related.id} className={styles.relatedCard}>
                                    <div className={styles.relatedImage}>
                                        {related.image && (related.image.startsWith('/') || related.image.startsWith('http') || related.image.startsWith('data:')) ? (
                                            <img src={related.image} alt={related.name} />
                                        ) : (
                                            <span>
                                                {related.category === 'bricks' ? '🧱' :
                                                    related.category === 'pavers' ? '🛤️' :
                                                        related.category === 'blocks' ? '📦' :
                                                            related.category === 'slabs' ? '⬛' : '🏗️'}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.relatedInfo}>
                                        <h3>{related.name}</h3>
                                        <p>${related.price.toFixed(2)} {related.unit}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Login Prompt Modal */}
            {showLoginPrompt && (
                <div className={styles.modalOverlay} onClick={() => setShowLoginPrompt(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setShowLoginPrompt(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className={styles.modalContent}>
                            <div className={styles.modalIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>

                            <h3>Save to Your Wishlist</h3>
                            <p>Sign in or create an account to save items to your wishlist.</p>

                            <div className={styles.modalActions}>
                                <button
                                    onClick={() => router.push(`/login?redirect=/products/${product.id}`)}
                                    className={styles.primaryBtn}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => router.push(`/register?redirect=/products/${product.id}`)}
                                    className={styles.secondaryBtn}
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
