'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamic import for Map
const LocationMap = dynamic(() => import('@/components/DeliveryMap'), {
    ssr: false,
    loading: () => <div style={{ height: '400px', width: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>Loading Map...</div>
});

const COMPANY_COORDS = { lat: -17.9197, lng: 31.0384 };

function ContactForm() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        deliveryOption: 'delivery',
        preferredContact: 'email',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const subjectParam = searchParams.get('subject');
        if (subjectParam) {
            // Map common params to select values
            let subjectValue = '';
            if (subjectParam === 'quote') subjectValue = 'quote';
            else if (subjectParam === 'product') subjectValue = 'product';

            if (subjectValue) {
                setFormData(prev => ({ ...prev, subject: subjectValue }));
            }
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission & Save to LocalStorage
        await new Promise(resolve => setTimeout(resolve, 1000));

        const submission = {
            id: `MSG-${Date.now().toString().slice(-4)}`,
            ...formData,
            status: 'pending', // or 'new'
            date: new Date().toISOString().split('T')[0],
        };

        if (formData.subject === 'quote') {
            // Save as Quote
            const existing = JSON.parse(localStorage.getItem('simulated_quotes') || '[]');
            const quoteData = {
                id: `QT-${Date.now().toString().slice(-4)}`,
                customer: formData.name,
                email: formData.email,
                phone: formData.phone,
                items: [], // Empty items for general inquiry quote
                pickupPrice: 0,
                deliveryPrice: 0,
                discount: 0,
                status: 'pending',
                preferredContact: formData.preferredContact,
                date: new Date().toISOString().split('T')[0],
                expiryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                project: 'Inquiry from Contact Form',
                message: formData.message // Custom field not in original type but useful
            };
            localStorage.setItem('simulated_quotes', JSON.stringify([quoteData, ...existing]));
        } else {
            // Save as Support Message
            const existing = JSON.parse(localStorage.getItem('simulated_support') || '[]');
            const supportData = {
                id: `MSG-${Date.now().toString().slice(-4)}`,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
                date: new Date().toISOString().split('T')[0],
                status: 'new',
                preferredContact: formData.preferredContact
            };
            localStorage.setItem('simulated_support', JSON.stringify([supportData, ...existing]));
        }

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            deliveryOption: 'delivery',
            preferredContact: 'email',
            message: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getMessagePlaceholder = () => {
        switch (formData.subject) {
            case 'quote':
                return "Please list the products (e.g., Common Bricks) and quantities (e.g., 10,000) you need. Include any specific requirements...";
            case 'delivery':
                return "Please include your Order ID and the specific delivery details or questions you have...";
            case 'product':
                return "Which product are you interested in? What would you like to know?";
            default:
                return "Tell us about your project or inquiry...";
        }
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.subtitle}>
                        We&apos;d love to hear from you. Get in touch for quotes, inquiries, or just to say hello.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className={`section ${styles.contact}`}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* Contact Info */}
                        <div className={styles.info}>
                            <h2>Get In Touch</h2>
                            <p className={styles.infoText}>
                                Have questions about our products? Need a quote for your project?
                                Our team is ready to help you find the perfect construction materials.
                            </p>

                            <div className={styles.infoCards}>
                                <div className={styles.infoCard}>
                                    <div className={styles.infoIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Visit Us</h3>
                                        <p>Koala Park Premises<br />Seke Road, Harare, Zimbabwe</p>
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <div className={styles.infoIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Call Us</h3>
                                        <p>
                                            <a href="tel:+263719269637" style={{ display: 'block', marginBottom: '4px' }}>+263 719 269 637</a>
                                            <a href="tel:+263780308403" style={{ display: 'block', marginBottom: '4px' }}>+263 780 308 403</a>
                                            <span style={{ fontSize: '13px', color: 'var(--slate-500)' }}>Call / WhatsApp</span>
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <div className={styles.infoIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Email Us</h3>
                                        <p>info@bricksforzimbabwe.co.zw<br />sales@bricksforzimbabwe.co.zw</p>
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <div className={styles.infoIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Business Hours</h3>
                                        <p>Mon - Fri: 7:00 AM - 5:00 PM<br />Sat: 8:00 AM - 1:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className={styles.formContainer}>
                            {isSubmitted ? (
                                <div className={styles.success}>
                                    <div className={styles.successIcon}>✓</div>
                                    <h3>Message Sent!</h3>
                                    <p>Thank you for contacting us. We&apos;ll get back to you within 24 hours.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <h2>Send us a Message</h2>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="name">Full Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+263 7X XXX XXXX"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="subject">Subject *</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="quote">Request a Quote</option>
                                                <option value="product">Product Inquiry</option>
                                                <option value="delivery">Delivery Question</option>
                                                <option value="support">Customer Support</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* New Fields: Delivery & Preferred Contact */}
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Delivery or Pickup?</label>
                                            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'normal', fontSize: '14px' }}>
                                                    <input
                                                        type="radio"
                                                        name="deliveryOption"
                                                        value="delivery"
                                                        checked={formData.deliveryOption === 'delivery'}
                                                        onChange={handleChange}
                                                    /> Delivery
                                                </label>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'normal', fontSize: '14px' }}>
                                                    <input
                                                        type="radio"
                                                        name="deliveryOption"
                                                        value="pickup"
                                                        checked={formData.deliveryOption === 'pickup'}
                                                        onChange={handleChange}
                                                    /> Pickup
                                                </label>
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Preferred Contact</label>
                                            <select
                                                name="preferredContact"
                                                value={formData.preferredContact}
                                                onChange={handleChange}
                                            >
                                                <option value="email">Email</option>
                                                <option value="phone">Phone Call</option>
                                                <option value="whatsapp">WhatsApp</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="message">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            placeholder={getMessagePlaceholder()}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${styles.submitBtn}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className={styles.mapContainer} style={{ background: '#f8fafc', padding: '40px 0' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 600, color: '#1e293b' }}>Find Us</h2>
                    <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <LocationMap start={COMPANY_COORDS} />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>}>
            <ContactForm />
        </Suspense>
    );
}
