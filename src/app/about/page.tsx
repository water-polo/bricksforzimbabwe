'use client';

import Image from 'next/image';
import styles from './page.module.css';

const team = [
    {
        name: 'Johan van der Riet',
        role: 'Managing Director',
        image: '/team/johan.png',
        bio: 'A Family Man with a passion for the outdoors that was fostered in a rural upbringing and further developed at boarding school. A practical hands on approach is where I find most joy in manufacturing quality product that help build the nation.'
    },
    {
        name: 'Gugulethu Ncube',
        role: 'Accountant',
        image: '/team/gugu.png',
        bio: 'As a professional accountant, I have dedicated myself to ensuring the accuracy and integrity of financial records. My meticulous attention to detail and passion for numbers have been the cornerstone of my career. One of the tools that I hold dear in my professional arsenal is Microsoft Excel. My expertise in Excel goes beyond simple spreadsheets; I leverage its advanced features to streamline processes, analyze data, and generate comprehensive financial reports. In my free time, I enjoy spending time with my family, playing pool, and watching soccer.'
    },
    {
        name: 'Aurklen Chikomo',
        role: 'Chartered Accountant',
        image: '/team/aurklen.png',
        bio: 'A highly skilled and detailed oriented Chartered Accountant with over 10 years of experience in finance and related fields such as financial reporting, tax planning, compliance and budgeting. I am passionate about getting numbers right, allocating resources in more efficient and effective manner, and navigating the complexities of accounting technology, reporting and decision making. Spends free time with family, watching soccer and exploring new financial and accounting solutions.'
    }
];

export default function AboutPage() {
    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">

                    <h1 className={styles.title}>Building Zimbabwe&apos;s Infrastructure</h1>
                    <p className={styles.subtitle}>
                        From humble beginnings as Cement City to becoming one of Zimbabwe&apos;s
                        trusted construction material suppliers. Our journey is built on quality,
                        reliability, and customer satisfaction.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className={`section ${styles.mission}`}>
                <div className="container">
                    <div className={styles.missionGrid}>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <h2>Our Mission</h2>
                            <p>
                                To provide high-quality, affordable construction materials that empower
                                builders and homeowners to create lasting structures. We are committed
                                to supporting Zimbabwe&apos;s development one brick at a time.
                            </p>
                        </div>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </div>
                            <h2>Our Vision</h2>
                            <p>
                                To be the leading supplier of construction materials in Zimbabwe,
                                known for innovation, quality, and exceptional customer service.
                                We envision a future where every Zimbabwean has access to premium
                                building materials.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className={`section ${styles.values}`}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center' }}>Our Values</h2>
                    <p className="section-subtitle" style={{ textAlign: 'center' }}>
                        The principles that guide everything we do
                    </p>
                    <div className={styles.valuesGrid}>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                            </div>
                            <h2>Quality</h2>
                            <p>Every product meets strict standards for durability and performance.</p>
                        </div>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>
                            <h2>Integrity</h2>
                            <p>Honest pricing, transparent practices, and keeping our promises.</p>
                        </div>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"></path>
                                    <path d="M9 21h6"></path>
                                </svg>
                            </div>
                            <h2>Innovation</h2>
                            <p>Continuously improving our products and processes.</p>
                        </div>
                        <div className={styles.missionCard}>
                            <div className={styles.missionIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h2>Community</h2>
                            <p>Supporting local employment and sustainable practices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className={`section ${styles.team}`}>
                <div className="container">
                    <div className={styles.teamHeaderContainer}>
                        <div className={styles.teamAccent}></div>
                        <h2 className={styles.teamTitle}>Our Team</h2>
                    </div>

                    <div className={styles.teamGrid}>
                        {team.map((member, index) => (
                            <div key={index} className={styles.teamCard}>
                                <div className={styles.teamImageContainer}>
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={200}
                                        height={200}
                                        className={styles.teamImg}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className={styles.teamContent}>
                                    <h3 className={styles.memberName}>{member.name} <span className={styles.memberRole}>({member.role})</span></h3>
                                    <p className={styles.memberBio}>{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
