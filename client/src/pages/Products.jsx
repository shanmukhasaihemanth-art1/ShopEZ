import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [selectedSizes, setSelectedSizes] = useState({})
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/products')
      setProducts(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
  }

  const addToCart = async (product) => {
    if (!token) {
      navigate('/login')
      return
    }

    // If product has sizes, require a size to be picked
    if (product.sizes && product.sizes.length > 0 && !selectedSizes[product._id]) {
      alert('Please select a size first')
      return
    }

    try {
      await axios.post(
        'http://localhost:8000/api/cart',
        {
          productId: product._id,
          quantity: 1,
          size: selectedSizes[product._id] || ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Added to cart successfully!')
    } catch (err) {
      alert('Failed to add to cart')
    }
  }

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category))]

  // Apply filter + sort
  let displayedProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products

  if (sortBy === 'lowToHigh') {
    displayedProducts = [...displayedProducts].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'highToLow') {
    displayedProducts = [...displayedProducts].sort((a, b) => b.price - a.price)
  }

  if (loading) return <p style={styles.loading}>Loading products...</p>

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Filters</h3>

        <div style={styles.filterSection}>
          <p style={styles.filterHeading}>Sort By</p>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              checked={sortBy === ''}
              onChange={() => setSortBy('')}
            /> Popular
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              checked={sortBy === 'lowToHigh'}
              onChange={() => setSortBy('lowToHigh')}
            /> Price (low to high)
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              checked={sortBy === 'highToLow'}
              onChange={() => setSortBy('highToLow')}
            /> Price (high to low)
          </label>
        </div>

        <div style={styles.filterSection}>
          <p style={styles.filterHeading}>Category</p>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.categorySelect}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products */}
      <div style={styles.container}>
        <h2 style={styles.title}>All Products</h2>
        {displayedProducts.length === 0 ? (
          <p style={styles.empty}>No products found.</p>
        ) : (
          <div style={styles.grid}>
            {displayedProducts.map(product => (
              <div key={product._id} style={styles.card} className="product-card">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.image}
                  />
                )}
                <div style={styles.info}>
                  <h3 style={styles.name}>{product.name}</h3>
                  <p style={styles.category}>{product.category}</p>
                  <p style={styles.description}>{product.description}</p>
                  <div style={styles.priceRow}>
                    <p style={styles.price}>₹{product.price}</p>
                    <p style={styles.mrp}>₹{Math.round(product.price * 1.2)}</p>
                    <p style={styles.discount}>17% off</p>
                  </div>
                  <p style={styles.freeDelivery}>Free Delivery</p>
                  <p style={styles.stock}>Stock: {product.stock}</p>

                  {product.sizes && product.sizes.length > 0 && (
                    <select
                      value={selectedSizes[product._id] || ''}
                      onChange={(e) => handleSizeChange(product._id, e.target.value)}
                      style={styles.sizeSelect}
                    >
                      <option value="">Select Size</option>
                      {product.sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  )}
                 <button
                    style={styles.button}
                    className="add-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    backgroundColor: '#f1f3f6',
    minHeight: '100vh'
  },
  sidebar: {
    width: '220px',
    backgroundColor: 'white',
    padding: '1.2rem',
    borderRadius: '8px',
    height: 'fit-content',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },
  sidebarTitle: {
    color: '#2874f0',
    marginBottom: '1rem'
  },
  filterSection: {
    marginBottom: '1.5rem'
  },
  filterHeading: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333'
  },
  radioLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  categorySelect: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },
  container: {
    flex: 1
  },
  title: {
    color: '#2874f0',
    marginBottom: '1.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'transform 0.2s'
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  info: {
    padding: '1rem'
  },
  name: {
    margin: '0 0 0.3rem',
    color: '#333',
    fontSize: '1.05rem'
  },
  category: {
    color: '#2874f0',
    fontSize: '0.8rem',
    marginBottom: '0.4rem'
  },
  description: {
    color: '#666',
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
 priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.2rem'
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#212121',
    margin: 0
  },
  mrp: {
    fontSize: '0.85rem',
    color: '#878787',
    textDecoration: 'line-through',
    margin: 0
  },
  discount: {
    fontSize: '0.85rem',
    color: '#388e3c',
    fontWeight: '600',
    margin: 0
  },
  freeDelivery: {
    fontSize: '0.8rem',
    color: '#388e3c',
    fontWeight: '600',
    marginBottom: '0.3rem'
  },
  stock: {
    color: '#888',
    fontSize: '0.8rem',
    marginBottom: '0.8rem'
  },
  sizeSelect: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    marginBottom: '0.8rem'
  },
  button: {
    width: '100%',
    padding: '0.6rem',
    backgroundColor: '#fb641b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 'bold'
  },
  loading: {
    textAlign: 'center',
    marginTop: '2rem'
  },
  empty: {
    textAlign: 'center',
    color: '#666'
  },
  message: {
    textAlign: 'center',
    color: 'green',
    marginBottom: '1rem'
  }
}

export default Products