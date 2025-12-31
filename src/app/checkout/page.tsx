'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useOrders } from '@/context/OrderContext';
import styles from './page.module.css';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
    deliveryOption: 'pickup' | 'delivery';
}

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const { customer, isAuthenticated, isLoading } = useCustomerAuth();
    const { addOrder } = useOrders();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: '',
        deliveryOption: 'delivery',
    });

    // Pre-fill form with customer data if logged in
    useEffect(() => {
        if (customer) {
            const nameParts = customer.name.split(' ');
            setFormData(prev => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: customer.email || '',
                phone: customer.phone || '',
            }));
        }
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate order submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate order ID
        const newOrderId = 'BFZ-' + Date.now().toString(36).toUpperCase();
        setOrderId(newOrderId);

        // Add order to context
        addOrder({
            customerName: `${formData.firstName} ${formData.lastName}`,
            customerEmail: formData.email,
            items: items,
            total: totalPrice + (formData.deliveryOption === 'delivery' ? 15 : 0),
        });

        setOrderPlaced(true);
        clearCart();
        setIsSubmitting(false);
    };

    const deliveryFee = formData.deliveryOption === 'delivery' ? 15.00 : 0;
    const grandTotal = totalPrice + deliveryFee;

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className={styles.page}>
                <section className={styles.header}>
                    <div className="container">
                        <h1 className={styles.title}>Checkout</h1>
                    </div>
                </section>
                <section className={styles.empty}>
                    <div className="container">
                        <div className={styles.emptyContent}>
                            <p>Loading...</p>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // If cart is empty
    if (items.length === 0 && !orderPlaced) {
        return (
            <div className={styles.page}>
                <section className={styles.header}>
                    <div className="container">
                        <h1 className={styles.title}>Checkout</h1>
                    </div>
                </section>
                <section className={styles.empty}>
                    <div className="container">
                        <div className={styles.emptyContent}>
                            <h2>Your cart is empty</h2>
                            <p>Add some products before checking out.</p>
                            <Link href="/products" className="btn btn-primary">
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // If not logged in, show login/register prompt
    if (!isAuthenticated && !orderPlaced) {
        return (
            <div className={styles.page}>
                <section className={styles.header}>
                    <div className="container">
                        <h1 className={styles.title}>Checkout</h1>
                        <p className={styles.subtitle}>Please sign in to complete your order</p>
                    </div>
                </section>
                <section className={styles.authPrompt}>
                    <div className="container">
                        <div className={styles.authCard}>
                            <div className={styles.authIcon}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <h2>Sign in to Continue</h2>
                            <p>Create an account or sign in to place your order and track your purchases.</p>

                            <div className={styles.authButtons}>
                                <Link
                                    href={`/login?redirect=${encodeURIComponent('/checkout')}`}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={`/register?redirect=${encodeURIComponent('/checkout')}`}
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                >
                                    Create Account
                                </Link>
                            </div>

                            <div className={styles.cartPreview}>
                                <h3>Your Cart ({items.length} items)</h3>
                                <div className={styles.cartPreviewItems}>
                                    {items.slice(0, 3).map(item => (
                                        <div key={item.id} className={styles.cartPreviewItem}>
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {items.length > 3 && (
                                        <p className={styles.moreItems}>+ {items.length - 3} more items</p>
                                    )}
                                </div>
                                <div className={styles.cartPreviewTotal}>
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className={styles.page}>
                <section className={styles.header}>
                    <div className="container">
                        <h1 className={styles.title}>Order Confirmed!</h1>
                    </div>
                </section>
                <section className={styles.success}>
                    <div className="container">
                        <div className={styles.successContent}>
                            <div className={styles.successIcon}>✓</div>
                            <h2>Thank you for your order!</h2>
                            <p className={styles.orderId}>Order ID: <strong>{orderId}</strong></p>
                            <p>We have received your order and will contact you shortly to confirm details and payment.</p>
                            <div className={styles.successInfo}>
                                <div className={styles.infoCard}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <p>Confirmation email sent to {formData.email}</p>
                                </div>
                                <div className={styles.infoCard}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <p>Our team will call you within 24 hours</p>
                                </div>
                            </div>
                            <div className={styles.successActions}>
                                <Link href="/account/orders" className="btn btn-primary">
                                    View My Orders
                                </Link>
                                <Link href="/products" className="btn btn-outline">
                                    Continue Shopping
                                </Link>
                            </div>
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
                    <h1 className={styles.title}>Checkout</h1>
                    <p className={styles.subtitle}>Complete your order</p>
                </div>
            </section>

            <section className={styles.checkoutSection}>
                <div className="container">
                    <form onSubmit={handleSubmit} className={styles.grid}>
                        {/* Customer Details */}
                        <div className={styles.formSection}>
                            <div className={styles.loggedInNotice}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <span>Signed in as <strong>{customer?.email}</strong></span>
                            </div>

                            <h2 className={styles.sectionTitle}>Customer Details</h2>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="firstName">First Name *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="lastName">Last Name *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="phone">Phone Number *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+263 7X XXX XXXX"
                                    />
                                </div>
                            </div>

                            <h2 className={styles.sectionTitle}>Delivery Options</h2>

                            <div className={styles.deliveryOptions}>
                                <label className={`${styles.deliveryOption} ${formData.deliveryOption === 'delivery' ? styles.deliveryOptionActive : ''}`}>
                                    <input
                                        type="radio"
                                        name="deliveryOption"
                                        value="delivery"
                                        checked={formData.deliveryOption === 'delivery'}
                                        onChange={handleChange}
                                    />
                                    <div className={styles.optionContent}>
                                        <span className={styles.optionIcon}>🚚</span>
                                        <div>
                                            <strong>Delivery</strong>
                                            <p>We deliver to your location</p>
                                        </div>
                                        <span className={styles.optionPrice}>$15.00</span>
                                    </div>
                                </label>
                                <label className={`${styles.deliveryOption} ${formData.deliveryOption === 'pickup' ? styles.deliveryOptionActive : ''}`}>
                                    <input
                                        type="radio"
                                        name="deliveryOption"
                                        value="pickup"
                                        checked={formData.deliveryOption === 'pickup'}
                                        onChange={handleChange}
                                    />
                                    <div className={styles.optionContent}>
                                        <span className={styles.optionIcon}>🏭</span>
                                        <div>
                                            <strong>Pickup</strong>
                                            <p>Collect from our yard</p>
                                        </div>
                                        <span className={styles.optionPrice}>Free</span>
                                    </div>
                                </label>
                            </div>

                            {formData.deliveryOption === 'delivery' && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="address">Delivery Address *</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            placeholder="Street address"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="city">City *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Harare"
                                        />
                                    </div>
                                </>
                            )}

                            <div className={styles.formGroup}>
                                <label htmlFor="notes">Order Notes (Optional)</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any special instructions..."
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className={styles.summarySection}>
                            <div className={styles.summary}>
                                <h2 className={styles.summaryTitle}>Order Summary</h2>

                                <div className={styles.orderItems}>
                                    {items.map(item => (
                                        <div key={item.id} className={styles.orderItem}>
                                            <div className={styles.orderItemInfo}>
                                                <span className={styles.orderItemQty}>{item.quantity}x</span>
                                                <span className={styles.orderItemName}>{item.name}</span>
                                            </div>
                                            <span className={styles.orderItemPrice}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.summaryTotals}>
                                    <div className={styles.summaryRow}>
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span>Delivery</span>
                                        <span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                                    </div>
                                    <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                                        <span>Total</span>
                                        <span>${grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`btn btn-accent ${styles.placeOrderBtn}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                                </button>

                                <p className={styles.paymentNote}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" />
                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                    Payment will be arranged upon order confirmation
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
