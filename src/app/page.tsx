import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

const featuredProducts = [
  { id: 1, name: 'Common Bricks', category: 'Bricks', image: '/products/brick-common.jpg', price: 'From $0.15' },
  { id: 2, name: 'Interlocking Pavers', category: 'Pavers', image: '/products/paver-interlock.jpg', price: 'From $1.50' },
  { id: 3, name: 'Standard Blocks', category: 'Blocks', image: '/products/block-standard.jpg', price: 'From $0.80' },
  { id: 4, name: 'Paving Slabs', category: 'Slabs', image: '/products/slab-paving.jpg', price: 'From $3.00' },
];

const categories = [
  { name: 'Bricks', icon: '🧱', description: 'Common, Face, Load Bearing, Hollow Maxi', href: '/products?category=bricks' },
  { name: 'Pavers', icon: '🛤️', description: 'Interlocking, Rectangular, 3D, Cobbles', href: '/products?category=pavers' },
  { name: 'Blocks', icon: '📦', description: 'Standard, Breeze, Retaining Wall', href: '/products?category=blocks' },
  { name: 'Slabs', icon: '⬛', description: 'Paving, Granite, Polished', href: '/products?category=slabs' },
  { name: 'Curbs & Copings', icon: '🏗️', description: 'Domestic, Industrial, Mountable', href: '/products?category=curbs' },
  { name: 'Pipes & More', icon: '🔧', description: 'Concrete Pipes, Lintels, Sills', href: '/products?category=pipes' },
];

const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '5000+', label: 'Projects Completed' },
  { value: '100+', label: 'Products Available' },
  { value: '24/7', label: 'Customer Support' },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Premium Construction Materials</span>
          <h1 className={styles.heroTitle}>
            Building Zimbabwe&apos;s Future,<br />
            <span className={styles.heroHighlight}>One Brick at a Time</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Crafting quality bricks, pavers, and blocks for builders who demand excellence.
            Trusted across Zimbabwe for over a decade.
          </p>
          <div className={styles.heroCta}>
            <Link href="/products" className="btn btn-accent">
              Explore Products
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statItem}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Categories Section */}
      <section className={`section ${styles.categories}`}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Our Product Range</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>
            Comprehensive selection of quality construction materials
          </p>
          <div className={styles.categoryGrid}>
            {categories.map((cat, index) => (
              <Link key={index} href={cat.href} className={styles.categoryCard}>
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <h3 className={styles.categoryName}>{cat.name}</h3>
                <p className={styles.categoryDesc}>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`section ${styles.featured}`}>
        <div className="container">
          <div className={styles.featuredHeader}>
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Best sellers and customer favorites
              </p>
            </div>
            <Link href="/products" className={styles.viewAllLink}>
              View All Products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          <div className={styles.productGrid}>
            {featuredProducts.map((product) => (
              <div key={product.id} className={`card ${styles.productCard}`}>
                <div className={styles.productImage}>
                  <div className={styles.productPlaceholder}>
                    <span>🧱</span>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productCategory}>{product.category}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>{product.price}</p>
                  <Link href={`/products/${product.id}`} className={styles.productBtn}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`section ${styles.whyUs}`}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', color: 'white' }}>Why Choose Bricks for Zimbabwe?</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
            We deliver excellence in every product
          </p>
          <div className={styles.whyUsGrid}>
            <div className={styles.whyUsCard}>
              <div className={styles.whyUsIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Premium Quality</h3>
              <p>All products meet or exceed industry standards for durability and strength.</p>
            </div>
            <div className={styles.whyUsCard}>
              <div className={styles.whyUsIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3>Fast Delivery</h3>
              <p>Own fleet of trucks ensures timely delivery across Zimbabwe.</p>
            </div>
            <div className={styles.whyUsCard}>
              <div className={styles.whyUsIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3>Competitive Pricing</h3>
              <p>Factory-direct pricing with bulk discounts for large orders.</p>
            </div>
            <div className={styles.whyUsCard}>
              <div className={styles.whyUsIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Expert Support</h3>
              <p>Knowledgeable team ready to help with product selection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Ready to Start Your Project?</h2>
            <p>Get in touch for a free quote or visit our showroom to see our products.</p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className="btn btn-accent">
                Request a Quote
              </Link>
              <Link href="/products" className="btn btn-outline">
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
