'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactUsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/contact');
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <p>Redirecting to contact page...</p>
        </div>
    );
}
