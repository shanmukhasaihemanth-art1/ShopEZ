import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const categories = [
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&h=300&fit=crop' },
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&h=300&fit=crop' },
    { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop' },
    { name: 'Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop' },
    { name: 'Sports Equipment', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&h=300&fit=crop' },
    { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' }
  ]

  const deals = [
    { name: 'Smartphones', tag: 'Up to 40% Off', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop' },
    { name: 'Laptops', tag: 'Up to 30% Off', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop' },
    { name: 'Headphones', tag: 'Up to 50% Off', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
    { name: 'Watches', tag: 'Up to 60% Off', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop' }
  ]

  return (
    <div style={styles.container}>
      {/* Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerLeft}>
          <p style={styles.bannerTag}>UP TO 70% OFF</p>
          <h1 style={styles.bannerTitle}>BIG SHOPPING DAYS</h1>
          <p style={styles.bannerSub}>Electronics · Fashion · Groceries · Sports & more</p>
          <button style={styles.bannerButton} className="shop-now-btn" onClick={() => navigate('/products')}>
            Shop Now →
          </button>
        </div>
        <div style={styles.bannerRight}>
          <span style={styles.bannerEmoji}>🛍️</span>
        </div>
      </div>

      {/* Categories */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Shop by Category</h2>
        <div style={styles.categories}>
          {categories.map(cat => (
            <div
              key={cat.name}
              style={styles.categoryCard}
              className="category-card"
              onClick={() => navigate('/products')}
            >
              <img src={cat.image} alt={cat.name} style={styles.categoryImage} />
              <p style={styles.categoryName}>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deals */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Top Deals For You</h2>
        <div style={styles.deals}>
          {deals.map(deal => (
            <div
              key={deal.name}
              style={styles.dealCard}
              className="category-card"
              onClick={() => navigate('/products')}
            >
              <img src={deal.image} alt={deal.name} style={styles.dealImage} />
              <p style={styles.dealName}>{deal.name}</p>
              <p style={styles.dealTag}>{deal.tag}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={styles.features}>
        <div style={styles.featureCard}>
          <h3>🛍️ Wide Selection</h3>
          <p>Explore thousands of products across all categories</p>
        </div>
        <div style={styles.featureCard}>
          <h3>🔒 Secure Checkout</h3>
          <p>Your payments and data are always safe with us</p>
        </div>
        <div style={styles.featureCard}>
          <h3>🚚 Fast Delivery</h3>
          <p>Get your orders delivered quickly to your doorstep</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#f1f3f6',
    minHeight: '100vh',
    paddingBottom: '2rem'
  },
  banner: {
    background: 'linear-gradient(135deg, #ff9f00 0%, #ff6f00 50%, #c2185b 100%)',
    minHeight: '280px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 4rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  bannerLeft: {
    color: 'white',
    maxWidth: '500px'
  },
  bannerTag: {
    fontSize: '1rem',
    letterSpacing: '3px',
    marginBottom: '0.5rem',
    color: '#ffe500',
    fontWeight: '700'
  },
  bannerTitle: {
    fontSize: '3.2rem',
    fontWeight: '900',
    margin: '0 0 1rem',
    lineHeight: 1.1
  },
  bannerSub: {
    fontSize: '1.05rem',
    marginBottom: '1.5rem',
    opacity: 0.95
  },
  bannerButton: {
    backgroundColor: 'white',
    color: '#c2185b',
    border: 'none',
    padding: '0.9rem 2.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '700'
  },
  bannerRight: {
    fontSize: '8rem'
  },
  bannerEmoji: {
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
  },
  section: {
    backgroundColor: 'white',
    margin: '1.5rem 2rem 0',
    borderRadius: '8px',
    padding: '1.5rem 2rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    color: '#212121',
    marginBottom: '1.2rem',
    fontSize: '1.3rem'
  },
  categories: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  categoryCard: {
    textAlign: 'center',
    cursor: 'pointer',
    width: '130px'
  },
  categoryImage: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '0.6rem',
    border: '1px solid #eee'
  },
  categoryName: {
    fontWeight: '600',
    color: '#212121',
    margin: 0,
    fontSize: '0.9rem'
  },
  deals: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  dealCard: {
    width: '180px',
    cursor: 'pointer',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center'
  },
  dealImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '0.6rem'
  },
  dealName: {
    fontWeight: '600',
    margin: '0 0 0.3rem',
    color: '#212121'
  },
  dealTag: {
    color: '#388e3c',
    fontWeight: '600',
    fontSize: '0.85rem',
    margin: 0
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2.5rem 2rem 0',
    flexWrap: 'wrap'
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '250px',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  }
}

export default Home