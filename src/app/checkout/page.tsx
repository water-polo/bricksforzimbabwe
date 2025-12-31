'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useOrders } from '@/context/OrderContext';
import styles from './page.module.css';

// Dynamic import for Map to avoid SSR issues
const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), {
    ssr: false,
    loading: () => <div style={{ height: '300px', width: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', color: '#64748b' }}>Loading Map...</div>
});

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
    deliveryOption: 'pickup' | 'delivery';
    preferredTime: string;
    pickupLocationId: string;
}

const DELIVERY_TIMES = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00'
];

const LOCATIONS = [
    { id: '1', name: 'Harare (Main Branch)', address: 'Koala Park Premises, Seke Road, Harare', lat: -17.9197, lng: 31.0384 },
    { id: '2', name: 'Bulawayo Branch', address: '23 Fort St, Bulawayo', lat: -20.132507, lng: 28.583005 },
    { id: '3', name: 'Mutare Depot', address: '5 Main St, Mutare', lat: -18.972799, lng: 32.669411 },
];

const COMPANY_COORDS = { lat: -17.9197, lng: 31.0384 }; // Default Start (Koala Park)
const PRICE_PER_KM = 1.50;

// Icons
const Icons = {
    Truck: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
    ),
    Store: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
            <line x1="12" y1="11" x2="12" y2="21"></line>
            <path d="M5 21v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8"></path>
            <path d="M2 11h20"></path>
            <path d="M12 3a7 7 0 0 1 7 7H5a7 7 0 0 1 7-7z"></path>
        </svg>
    ),
    Clock: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
    MapPin: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    ),
    Navigation: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
    ),
};

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
        preferredTime: DELIVERY_TIMES[0],
        pickupLocationId: LOCATIONS[0].id
    });

    // GPS State
    const [gpsLoading, setGpsLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [distance, setDistance] = useState<number | null>(null);
    const [calculatedFee, setCalculatedFee] = useState<number>(0);
    const [gpsError, setGpsError] = useState<string | null>(null);
    const [destinationCoords, setDestinationCoords] = useState<{ lat: number, lng: number } | null>(null);

    // Pre-fill form
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

    const handleTimeSelect = (time: string) => {
        setFormData(prev => ({ ...prev, preferredTime: time }));
    };

    // Haversine Algo
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const updateFee = (dist: number) => {
        setDistance(dist);
        const fee = dist * PRICE_PER_KM;
        setCalculatedFee(Number(fee.toFixed(2)));
    };

    const handleUseCurrentLocation = () => {
        setGpsLoading(true);
        setGpsError(null);
        if (!navigator.geolocation) {
            setGpsError("Geolocation is not supported");
            setGpsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const dist = calculateDistance(COMPANY_COORDS.lat, COMPANY_COORDS.lng, latitude, longitude);

                updateFee(dist);
                setDestinationCoords({ lat: latitude, lng: longitude });

                setFormData(prev => ({
                    ...prev,
                    address: `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                    city: 'Current Location'
                }));
                setGpsLoading(false);
            },
            () => {
                setGpsError("Unable to retrieve location");
                setGpsLoading(false);
            }
        );
    };

    const handleTextAddressCalculation = () => {
        if (!formData.address || formData.address.length < 5) {
            setGpsError("Please enter a valid address first");
            return;
        }
        setCalculating(true);
        setGpsError(null);

        // SIMULATION: Create a random location near central harare
        // In production, this would be a call to Google Maps Geocoding API
        setTimeout(() => {
            // Random offset ~5-20km away
            const latOffset = (Math.random() - 0.5) * 0.15;
            const lngOffset = (Math.random() - 0.5) * 0.15;
            const dLat = COMPANY_COORDS.lat + latOffset;
            const dLng = COMPANY_COORDS.lng + lngOffset;

            const simulatedDist = calculateDistance(COMPANY_COORDS.lat, COMPANY_COORDS.lng, dLat, dLng);

            updateFee(simulatedDist);
            setDestinationCoords({ lat: dLat, lng: dLng });
            setCalculating(false);
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newOrderId = 'BFZ-' + Date.now().toString(36).toUpperCase();
        setOrderId(newOrderId);

        const notes = formData.deliveryOption === 'delivery'
            ? `${formData.notes ? formData.notes + ' | ' : ''}Time: ${formData.preferredTime} | Dist: ${distance ? distance.toFixed(1) + 'km' : 'Unknown'}`
            : `${formData.notes ? formData.notes + ' | ' : ''}Pickup at: ${LOCATIONS.find(l => l.id === formData.pickupLocationId)?.name}`;

        addOrder({
            customerName: `${formData.firstName} ${formData.lastName}`,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            items: items,
            total: totalPrice + (formData.deliveryOption === 'delivery' ? calculatedFee : 0),
            source: formData.deliveryOption === 'pickup' ? 'walk-in' : 'online',
            notes: notes,
        });

        setOrderPlaced(true);
        clearCart();
        setIsSubmitting(false);
    };

    const deliveryFee = formData.deliveryOption === 'delivery' ? calculatedFee : 0;
    const grandTotal = totalPrice + deliveryFee;

    // Loading & Empty States
    if (isLoading) return <div className={styles.page}><section className={styles.header}><div className="container"><h1 className={styles.title}>Checkout</h1></div></section><section className={styles.empty}><div className="container"><p>Loading...</p></div></section></div>;
    if (items.length === 0 && !orderPlaced) return <div className={styles.page}><section className={styles.header}><div className="container"><h1 className={styles.title}>Checkout</h1></div></section><section className={styles.empty}><div className="container"><div className={styles.emptyContent}><h2>Your cart is empty</h2><p>Add some products before checking out.</p><Link href="/products" className="btn btn-primary">Browse Products</Link></div></div></section></div>;
    if (!isAuthenticated && !orderPlaced) return <div className={styles.page}><section className={styles.header}><div className="container"><h1 className={styles.title}>Checkout</h1></div></section><section className={styles.authPrompt}><div className="container"><div className={styles.authCard}><div className={styles.authIcon}><Icons.Truck /></div><h2>Sign in to Continue</h2><p>Create an account or sign in to place your order.</p><div className={styles.authButtons}><Link href={`/login?redirect=${encodeURIComponent('/checkout')}`} className="btn btn-primary" style={{ flex: 1 }}>Sign In</Link><Link href={`/register?redirect=${encodeURIComponent('/checkout')}`} className="btn btn-outline" style={{ flex: 1 }}>Create Account</Link></div></div></div></section></div>;

    if (orderPlaced) {
        return (
            <div className={styles.page}>
                <section className={styles.header}><div className="container"><h1 className={styles.title}>Order Confirmed!</h1></div></section>
                <section className={styles.success}>
                    <div className="container">
                        <div className={styles.successContent}>
                            <div className={styles.successIcon}>✓</div>
                            <h2>Thank you for your order!</h2>
                            <p className={styles.orderId}>Order ID: <strong>{orderId}</strong></p>
                            <p>Order received. We will contact you regarding delivery.</p>
                            <div className={styles.successActions}>
                                <Link href="/account/orders" className="btn btn-primary">View My Orders</Link>
                                <Link href="/products" className="btn btn-outline">Continue Shopping</Link>
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
                    <p className={styles.subtitle}>Complete your order details</p>
                </div>
            </section>

            <section className={styles.checkoutSection}>
                <div className="container">
                    <form onSubmit={handleSubmit} className={styles.grid}>
                        {/* Customer Details */}
                        <div className={styles.formSection}>
                            <div className={styles.loggedInNotice}>
                                <span>Signed in as <strong>{customer?.email}</strong></span>
                            </div>

                            <h2 className={styles.sectionTitle}>Customer Details</h2>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}><label>First Name</label><input name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
                                <div className={styles.formGroup}><label>Last Name</label><input name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}><label>Email</label><input name="email" value={formData.email} onChange={handleChange} required /></div>
                                <div className={styles.formGroup}><label>Phone</label><input name="phone" value={formData.phone} onChange={handleChange} required /></div>
                            </div>

                            <h2 className={styles.sectionTitle}>Delivery Options</h2>
                            <div className={styles.deliveryOptions}>
                                <label className={`${styles.deliveryOption} ${formData.deliveryOption === 'delivery' ? styles.deliveryOptionActive : ''}`} style={{ padding: '12px', minHeight: 'auto' }}>
                                    <input type="radio" name="deliveryOption" value="delivery" checked={formData.deliveryOption === 'delivery'} onChange={handleChange} />
                                    <div className={styles.optionContent} style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '0' }}>
                                        <div className={styles.optionIcon} style={{ background: '#e0f2fe', color: '#0284c7', padding: '8px', borderRadius: '50%', marginBottom: 0 }}><Icons.Truck /></div>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ fontSize: '14px', display: 'block' }}>Delivery</strong>
                                            <span className={styles.optionPrice} style={{ fontSize: '12px', color: '#64748b' }}>${PRICE_PER_KM.toFixed(2)}/km</span>
                                        </div>
                                    </div>
                                </label>
                                <label className={`${styles.deliveryOption} ${formData.deliveryOption === 'pickup' ? styles.deliveryOptionActive : ''}`} style={{ padding: '12px', minHeight: 'auto' }}>
                                    <input type="radio" name="deliveryOption" value="pickup" checked={formData.deliveryOption === 'pickup'} onChange={handleChange} />
                                    <div className={styles.optionContent} style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '0' }}>
                                        <div className={styles.optionIcon} style={{ background: '#dcfce7', color: '#16a34a', padding: '8px', borderRadius: '50%', marginBottom: 0 }}><Icons.Store /></div>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ fontSize: '14px', display: 'block' }}>Pickup</strong>
                                            <span className={styles.optionPrice} style={{ fontSize: '12px', color: '#64748b' }}>Free</span>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* PICKUP LOGIC */}
                            {formData.deliveryOption === 'pickup' && (
                                <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                        <Icons.MapPin /> Select Pickup Location
                                    </label>
                                    <select name="pickupLocationId" value={formData.pickupLocationId} onChange={handleChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '6px', fontSize: '14px' }}>
                                        {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {/* DELIVERY LOGIC */}
                            {formData.deliveryOption === 'delivery' && (
                                <>
                                    <div style={{ marginTop: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Preferred Delivery Time</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                            {DELIVERY_TIMES.map((time) => (
                                                <div key={time} onClick={() => handleTimeSelect(time)}
                                                    style={{
                                                        border: formData.preferredTime === time ? '2px solid #009FDF' : '1px solid #e2e8f0',
                                                        background: formData.preferredTime === time ? '#f0f9ff' : 'white',
                                                        borderRadius: '6px', padding: '8px', cursor: 'pointer', textAlign: 'center',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                                                    }}>
                                                    <div style={{ color: formData.preferredTime === time ? '#009FDF' : '#94a3b8' }}><Icons.Clock /></div>
                                                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#334155' }}>{time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="address">Delivery Address</label>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Enter street address..." style={{ flex: 1 }} />
                                                <button type="button" onClick={handleTextAddressCalculation} disabled={calculating} className="btn"
                                                    style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', fontSize: '13px', padding: '0 12px', whiteSpace: 'nowrap' }}>
                                                    {calculating ? 'Calculating...' : 'Calculate Fee'}
                                                </button>
                                            </div>
                                            <button type="button" onClick={handleUseCurrentLocation} disabled={gpsLoading}
                                                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '12px', cursor: 'pointer', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Icons.Navigation /> {gpsLoading ? 'Locating...' : 'Or use my current location'}
                                            </button>
                                        </div>
                                        <div className={styles.formGroup} style={{ marginTop: '12px' }}>
                                            <label htmlFor="city">City</label>
                                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="e.g., Harare" />
                                        </div>

                                        {(distance !== null || gpsError) && (
                                            <div style={{ marginTop: '16px', padding: '16px', background: gpsError ? '#fef2f2' : 'white', borderRadius: '12px', border: gpsError ? '1px solid #fee2e2' : '1px solid #e2e8f0' }}>
                                                {gpsError ? (
                                                    <p style={{ color: '#ef4444', fontSize: '12px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Icons.Truck /> {gpsError}
                                                    </p>
                                                ) : (
                                                    <div>
                                                        {destinationCoords && (
                                                            <div style={{ marginBottom: '16px' }}>
                                                                <DeliveryMap start={COMPANY_COORDS} end={destinationCoords} />
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                            <div>
                                                                <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>Estimated Distance</span>
                                                                <strong style={{ color: '#0f172a' }}>{distance?.toFixed(1)} km</strong>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>Delivery Fee</span>
                                                                <strong style={{ color: '#0284c7', fontSize: '16px' }}>${calculatedFee.toFixed(2)}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className={styles.formGroup} style={{ marginTop: '20px' }}>
                                <label>Order Notes</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Special instructions..." />
                            </div>
                        </div>

                        {/* Summary Section (Same) */}
                        <div className={styles.summarySection}>
                            <div className={styles.summary}>
                                <h2 className={styles.summaryTitle}>Totals</h2>
                                <div className={styles.orderItems}>
                                    {items.map(item => (
                                        <div key={item.id} className={styles.orderItem}>
                                            <div className={styles.orderItemInfo}><span className={styles.orderItemQty}>{item.quantity}x</span><span className={styles.orderItemName}>{item.name}</span></div>
                                            <span className={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.summaryTotals}>
                                    <div className={styles.summaryRow}><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                                    <div className={styles.summaryRow}><span>Delivery</span><span>{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : (formData.deliveryOption === 'delivery' ? 'TBD' : 'Free')}</span></div>
                                    <div className={`${styles.summaryRow} ${styles.grandTotal}`}><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
                                </div>
                                <button type="submit" className={`btn btn-primary ${styles.placeOrderBtn}`} disabled={isSubmitting}>{isSubmitting ? 'Processing...' : 'Place Order'}</button>
                                <p className={styles.paymentNote}>Payment arranged on confirmation</p>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
