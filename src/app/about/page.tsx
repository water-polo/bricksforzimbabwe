import Image from 'next/image';
import styles from './page.module.css';

const timeline = [
    { year: '2010', title: 'Company Founded', description: 'Started operations in Harare with a focus on quality construction materials.' },
    { year: '2015', title: 'Expanded Product Range', description: 'Added pavers, blocks, and decorative items to our catalog.' },
    { year: '2020', title: 'Fleet Expansion', description: 'Invested in delivery trucks for nationwide coverage.' },
    { year: '2024', title: 'Digital Transformation', description: 'Launched online ordering and enhanced customer service.' },
];

const team = [
    { name: 'Managing Director', role: 'Leadership', image: '👔' },
    { name: 'Production Manager', role: 'Operations', image: '🏭' },
    { name: 'Sales Team', role: 'Customer Service', image: '🤝' },
    { name: 'Delivery Fleet', role: 'Logistics', image: '🚚' },
];

export default function AboutPage() {
    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <span className={styles.badge}>Since 2010</span>
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

            {/* Timeline */}
            <section className={`section ${styles.timeline}`}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center' }}>Our Journey</h2>
                    <p className="section-subtitle" style={{ textAlign: 'center' }}>
                        Over a decade of building Zimbabwe
                    </p>
                    <div className={styles.timelineContainer}>
                        {timeline.map((item, index) => (
                            <div key={index} className={styles.timelineItem}>
                                <div className={styles.timelineYear}>{item.year}</div>
                                <div className={styles.timelineContent}>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className={`section ${styles.values}`}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center', color: 'white' }}>Our Values</h2>
                    <p className="section-subtitle" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
                        The principles that guide everything we do
                    </p>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <span className={styles.valueEmoji}>💎</span>
                            <h3>Quality</h3>
                            <p>Every product meets strict standards for durability and performance.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueEmoji}>🤝</span>
                            <h3>Integrity</h3>
                            <p>Honest pricing, transparent practices, and keeping our promises.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueEmoji}>💡</span>
                            <h3>Innovation</h3>
                            <p>Continuously improving our products and processes.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <span className={styles.valueEmoji}>🌍</span>
                            <h3>Community</h3>
                            <p>Supporting local employment and sustainable practices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className={`section ${styles.team}`}>
                <div className="container">
                    <h2 className="section-title" style={{ textAlign: 'center' }}>Our Team</h2>
                    <p className="section-subtitle" style={{ textAlign: 'center' }}>
                        Dedicated professionals committed to your success
                    </p>
                    <div className={styles.teamGrid}>
                        {team.map((member, index) => (
                            <div key={index} className={styles.teamCard}>
                                <div className={styles.teamImage}>
                                    <span>{member.image}</span>
                                </div>
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
