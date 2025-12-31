'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

interface Message {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    date: string;
    status: 'new' | 'read' | 'replied';
    preferredContact: 'email' | 'whatsapp' | 'sms' | 'phone';
}

// Icons
const Icons = {
    Eye: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    ),
    Mail: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
    ),
    Check: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    Close: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )
};

export default function SupportPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        // Load messages from localStorage or use mock
        const stored = localStorage.getItem('simulated_support');
        if (stored) {
            setMessages(JSON.parse(stored));
        } else {
            // Add some mock data if empty
            const mock: Message[] = [
                {
                    id: 'MSG-001',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+263 712 345 678',
                    subject: 'Delivery Question',
                    message: 'Do you deliver to Chinhoyi? If so, what is the cost for 10,000 bricks?',
                    date: '2024-12-30',
                    status: 'new',
                    preferredContact: 'email'
                }
            ];
            setMessages(mock);
        }
    }, []);

    const handleMarkAsRead = (id: string) => {
        const updated = messages.map(m => m.id === id ? { ...m, status: 'read' as const } : m);
        setMessages(updated);
        localStorage.setItem('simulated_support', JSON.stringify(updated));
    };

    const handleReply = (method: string) => {
        if (!selectedMessage) return;
        alert(`Ideally this would open ${method} reply to ${selectedMessage.name}`);
        const updated = messages.map(m => m.id === selectedMessage.id ? { ...m, status: 'replied' as const } : m);
        setMessages(updated);
        localStorage.setItem('simulated_support', JSON.stringify(updated));
        setSelectedMessage(null);
    };

    return (
        <div>
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Support Messages</h2>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Preferred</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg) => (
                                <tr key={msg.id} style={{ opacity: msg.status === 'replied' ? 0.6 : 1, background: msg.status === 'new' ? '#f8fafc' : 'white' }}>
                                    <td>{msg.date}</td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{msg.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{msg.phone}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{msg.subject}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {msg.message}
                                        </div>
                                    </td>
                                    <td>{msg.preferredContact}</td>
                                    <td>
                                        <span className={`${styles.badge} ${msg.status === 'new' ? styles.badgeWarning : msg.status === 'replied' ? styles.badgeSuccess : ''}`}>
                                            {msg.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className={styles.btn}
                                                title="View"
                                                onClick={() => { setSelectedMessage(msg); if (msg.status === 'new') handleMarkAsRead(msg.id); }}
                                            >
                                                <Icons.Eye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        No messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Message Modal */}
            {selectedMessage && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '600px' }}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Message from {selectedMessage.name}</h3>
                            <button className={styles.modalClose} onClick={() => setSelectedMessage(null)}>
                                <Icons.Close />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                <div>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Email</span>
                                    <div style={{ fontWeight: 500 }}>{selectedMessage.email || 'N/A'}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Phone</span>
                                    <div style={{ fontWeight: 500 }}>{selectedMessage.phone || 'N/A'}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Date</span>
                                    <div style={{ fontWeight: 500 }}>{selectedMessage.date}</div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Preferred Contact</span>
                                    <div style={{ fontWeight: 500 }}>{selectedMessage.preferredContact}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#475569' }}>Subject: {selectedMessage.subject}</h4>
                                <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
                                    {selectedMessage.message}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setSelectedMessage(null)}>
                                    Close
                                </button>
                                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleReply('email')}>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <Icons.Mail /> Reply via Email
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
