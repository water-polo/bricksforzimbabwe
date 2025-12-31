'use client';

import { useState } from 'react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import styles from './account.module.css';

export default function ProfilePage() {
    const { customer, updateProfile } = useCustomerAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        address: customer?.address || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile({
            name: formData.name,
            phone: formData.phone,
            address: formData.address
        });
        setIsEditing(false);
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>My Profile</h1>
                <p className={styles.pageSubtitle}>Manage your personal information and delivery details</p>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Personal Information</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input
                                name="email"
                                value={formData.email}
                                className={styles.input}
                                style={{ background: '#f8fafc', color: '#64748b' }}
                                disabled={true}
                                title="Email cannot be changed"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="+263..."
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>Delivery Address</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Street Address, City, Province"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        name: customer?.name || '',
                                        email: customer?.email || '',
                                        phone: customer?.phone || '',
                                        address: customer?.address || ''
                                    });
                                    setIsEditing(false);
                                }}
                                className={styles.btn}
                                style={{ border: '1px solid #e2e8f0' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`${styles.btn} ${styles.btnPrimary}`}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
