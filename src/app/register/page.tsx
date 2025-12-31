'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import styles from '../login/auth.module.css';

function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useCustomerAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const success = await register(name, email, password, phone);

        if (success) {
            router.push(redirect);
        } else {
            setError('An account with this email already exists');
        }
        setIsLoading(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <Link href="/">
                    <Image
                        src="/logo-v2.png"
                        alt="Bricks for Zimbabwe"
                        width={160}
                        height={45}
                        style={{ objectFit: 'contain' }}
                    />
                </Link>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join Bricks for Zimbabwe today</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && (
                    <div className={styles.error}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                        type="email"
                        className={styles.input}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Phone Number (Optional)</label>
                    <input
                        type="tel"
                        className={styles.input}
                        placeholder="+263 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Password</label>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Confirm Password</label>
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <div className={styles.footer}>
                <p>Already have an account? <Link href={`/login?redirect=${encodeURIComponent(redirect)}`}>Sign in</Link></p>
            </div>
        </div>
    );
}

function RegisterLoading() {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div style={{ width: 160, height: 45, background: '#f1f5f9', borderRadius: 8 }}></div>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Loading...</p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className={styles.container}>
            <Suspense fallback={<RegisterLoading />}>
                <RegisterForm />
            </Suspense>
        </div>
    );
}
