import Link from 'next/link';
import styles from './page.module.css';

const projects = [
    {
        id: 1,
        title: 'Residential Complex - Borrowdale',
        category: 'Residential',
        description: 'Supplied bricks and pavers for a 20-unit residential complex.',
        products: ['Face Bricks', 'Interlocking Pavers', 'Wall Copings'],
        image: '🏘️',
    },
    {
        id: 2,
        title: 'Shopping Mall Parking',
        category: 'Commercial',
        description: 'Industrial pavers for high-traffic parking area.',
        products: ['80mm Industrial Pavers', 'Kerb Stones'],
        image: '🏬',
    },
    {
        id: 3,
        title: 'Private Residence - Highlands',
        category: 'Residential',
        description: 'Complete exterior with premium bricks and decorative slabs.',
        products: ['Face Bricks', 'Granite Slabs', 'Polished Pavers'],
        image: '🏠',
    },
    {
        id: 4,
        title: 'Industrial Warehouse',
        category: 'Industrial',
        description: 'Standard blocks for large-scale warehouse construction.',
        products: ['9" Standard Blocks', 'Lintels', 'Concrete Pipes'],
        image: '🏭',
    },
    {
        id: 5,
        title: 'School Playground',
        category: 'Institutional',
        description: 'Colorful pavers creating vibrant play areas for children.',
        products: ['Colored Pavers', 'Cobble Stones', 'Kerbs'],
        image: '🏫',
    },
    {
        id: 6,
        title: 'Hotel Driveway',
        category: 'Commercial',
        description: 'Elegant entrance featuring mixed paver patterns.',
        products: ['3D Pavers', 'Granite Slabs', 'Wall Copings'],
        image: '🏨',
    },
];

const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Institutional'];

export default function ProjectsPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>Our Projects</h1>
                    <p className={styles.subtitle}>
                        See how our products have transformed spaces across Zimbabwe
                    </p>
                </div>
            </section>

            {/* Filter */}
            <section className={styles.filter}>
                <div className="container">
                    <div className={styles.filterBtns}>
                        {categories.map((cat) => (
                            <button key={cat} className={styles.filterBtn}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className={`section ${styles.projects}`}>
                <div className="container">
                    <div className={styles.grid}>
                        {projects.map((project) => (
                            <div key={project.id} className={styles.card}>
                                <div className={styles.cardImage}>
                                    <span className={styles.cardEmoji}>{project.image}</span>
                                    <span className={styles.cardCategory}>{project.category}</span>
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{project.title}</h3>
                                    <p className={styles.cardDesc}>{project.description}</p>
                                    <div className={styles.cardProducts}>
                                        <span className={styles.productsLabel}>Products Used:</span>
                                        <div className={styles.productTags}>
                                            {project.products.map((prod, idx) => (
                                                <span key={idx} className={styles.productTag}>{prod}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaContent}>
                        <h2>Have a Project in Mind?</h2>
                        <p>Let us help you choose the right materials for your construction needs.</p>
                        <Link href="/contact" className="btn btn-accent">
                            Get a Free Quote
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
