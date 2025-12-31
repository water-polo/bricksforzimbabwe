'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import styles from './page.module.css';

// Progress Timeline Component
function CheckoutTimeline({ currentStep }: { currentStep: number }) {
    const steps = [
        { id: 1, name: 'My Cart', icon: '🛒' },
        { id: 2, name: 'Account', icon: '👤' },
        { id: 3, name: 'Checkout', icon: '✓' }
    ];

    return (
        <div className={styles.timeline}>
            {steps.map((step, index) => (
                <div key={step.id} className={styles.timelineStep}>
                    <div className={`${styles.stepCircle} ${currentStep >= step.id ? styles.stepActive : ''} ${currentStep > step.id ? styles.stepCompleted : ''}`}>
                        {currentStep > step.id ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : (
                            <span>{step.id}</span>
                        )}
                    </div>
                    <span className={`${styles.stepLabel} ${currentStep >= step.id ? styles.stepLabelActive : ''}`}>
                        {step.name}
                    </span>
                    {index < steps.length - 1 && (
                        <div className={`${styles.stepLine} ${currentStep > step.id ? styles.stepLineActive : ''}`}></div>
                    )}
                </div>
            ))}
        </div>
    );
}

// Quantity Input Component
function QuantityInput({ value, onChange, min = 1 }: { value: number; onChange: (val: number) => void; min?: number }) {
    const [inputValue, setInputValue] = useState(value.toString());

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        const numVal = parseInt(val, 10);
        if (!isNaN(numVal) && numVal >= min) {
            onChange(numVal);
        }
    };

    const handleBlur = () => {
        const numVal = parseInt(inputValue, 10);
        if (isNaN(numVal) || numVal < min) {
            setInputValue(min.toString());
            onChange(min);
        } else {
            setInputValue(numVal.toString());
        }
    };

    const increment = () => {
        const newVal = value + 1;
        setInputValue(newVal.toString());
        onChange(newVal);
    };

    const decrement = () => {
        if (value > min) {
            const newVal = value - 1;
            setInputValue(newVal.toString());
            onChange(newVal);
        }
    };

    return (
        <div className={styles.quantityInput}>
            <button className={styles.qtyBtn} onClick={decrement} disabled={value <= min}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={styles.qtyInput}
                aria-label="Quantity"
            />
            <button className={styles.qtyBtn} onClick={increment}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </div>
    );
}

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
    const { isAuthenticated } = useCustomerAuth();

    if (items.length === 0) {
        return (
            <div className={styles.page}>
                <section className={styles.header}>
                    <div className="container">
                        <CheckoutTimeline currentStep={1} />
                        <h1 className={styles.title}>Your Cart</h1>
                    </div>
                </section>
                <section className={styles.empty}>
                    <div className="container">
                        <div className={styles.emptyContent}>
                            <div className={styles.emptyIcon}>
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </div>
                            <h2>Your cart is empty</h2>
                            <p>Looks like you haven&apos;t added any items yet. Start shopping to fill it up!</p>
                            <Link href="/products" className={styles.primaryBtn}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <section className={styles.header}>
                <div className="container">
                    <CheckoutTimeline currentStep={1} />
                    <h1 className={styles.title}>Your Cart</h1>
                    <p className={styles.subtitle}>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
                </div>
            </section>

            <section className={styles.cartSection}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* Cart Items */}
                        <div className={styles.cartItems}>
                            <div className={styles.cartHeader}>
                                <span>Product</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>Total</span>
                                <span></span>
                            </div>

                            {items.map(item => (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemImage}>
                                            {item.image && (item.image.startsWith('/') || item.image.startsWith('http') || item.image.startsWith('data:')) ? (
                                                <img src={item.image} alt={item.name} />
                                            ) : (
                                                <span className={styles.itemEmoji}>
                                                    {item.category === 'bricks' ? '🧱' :
                                                        item.category === 'pavers' ? '🛤️' :
                                                            item.category === 'blocks' ? '📦' :
                                                                item.category === 'slabs' ? '⬛' : '🏗️'}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.itemDetails}>
                                            <Link href={`/products/${item.id}`} className={styles.itemName}>
                                                {item.name}
                                            </Link>
                                            <span className={styles.itemCategory}>{item.category}</span>
                                        </div>
                                    </div>
                                    <div className={styles.itemPrice}>
                                        <span className={styles.priceLabel}>Price</span>
                                        <span className={styles.priceValue}>${item.price.toFixed(2)}</span>
                                        <span className={styles.itemUnit}>{item.unit}</span>
                                    </div>
                                    <div className={styles.itemQuantity}>
                                        <span className={styles.qtyLabel}>Quantity</span>
                                        <QuantityInput
                                            value={item.quantity}
                                            onChange={(val) => updateQuantity(item.id, val)}
                                        />
                                    </div>
                                    <div className={styles.itemTotal}>
                                        <span className={styles.totalLabel}>Total</span>
                                        <span className={styles.totalValue}>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            <div className={styles.cartActions}>
                                <button className={styles.clearBtn} onClick={clearCart}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    Clear Cart
                                </button>
                                <Link href="/products" className={styles.continueBtn}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                    </svg>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className={styles.summary}>
                            <h2 className={styles.summaryTitle}>Order Summary</h2>

                            <div className={styles.summaryDetails}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>VAT (Included)</span>
                                    <span className={styles.vatNote}>Included</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Delivery</span>
                                    <span className={styles.deliveryNote}>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className={styles.summaryTotal}>
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>

                            <Link
                                href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
                                className={styles.checkoutBtn}
                            >
                                {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>

                            {!isAuthenticated && (
                                <p className={styles.guestNote}>
                                    Don&apos;t have an account?{' '}
                                    <Link href="/register?redirect=/checkout">Create one</Link>
                                </p>
                            )}

                            <div className={styles.trustBadges}>
                                <div className={styles.trustBadge}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>Secure Checkout</span>
                                </div>
                                <div className={styles.trustBadge}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                                        <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"></path>
                                        <path d="M8 21h8"></path>
                                        <path d="M12 17v4"></path>
                                    </svg>
                                    <span>Fast Delivery</span>
                                </div>
                                <div className={styles.trustBadge}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    <span>Quality Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
