import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [product, setProduct] = useState({
    name: '', description: '', price: '', category: '', image: '', stock: '', sizes: []
  })
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const categoryOptions = ['Electronics', 'Mobiles', 'Fashion', 'Clothing', 'Footwear', 'Groceries', 'Sports Equipment', 'Accessories']
  const sizeOptions = ['S', 'M', 'L', 'XL']

  const toggleSize = (size) => {
    setProduct(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
      return { ...prev, sizes }
    })
  }

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/')
      return
    }
    fetchOrders()
    fetchProducts()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/products')
      setProducts(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const addProduct = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        'http://localhost:8000/api/products',
        {
          ...product,
          price: Number(product.price),
          stock: Number(product.stock)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Product added successfully!')
      setProduct({
        name: '', description: '', price: '',
        category: '', image: '', stock: '', sizes: []
      })
      fetchProducts()
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('Failed to add product')
    }
  }

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProducts()
    } catch (err) {
      console.log(err)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:8000/api/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return '#2874f0'
      case 'Shipped': return '#ff9800'
      case 'Delivered': return '#4caf50'
      case 'Cancelled': return '#f44336'
      default: return '#666'
    }
  }

  return (
    <div style={styles.page}>
      {/* Top Nav */}
      <div style={styles.topbar}>
        <h2 style={styles.brand}>ShopEZ (admin)</h2>
        <div style={styles.tabs}>
          <button style={navTab(activeTab, 'overview')} onClick={() => setActiveTab('overview')}>Home</button>
          <button style={navTab(activeTab, 'orders')} onClick={() => setActiveTab('orders')}>Orders</button>
          <button style={navTab(activeTab, 'products')} onClick={() => setActiveTab('products')}>Products</button>
          <button style={navTab(activeTab, 'new')} onClick={() => setActiveTab('new')}>New Product</button>
        </div>
      </div>

      <div style={styles.body}>
        {/* Overview */}
        {activeTab === 'overview' && (
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>All Products</p>
              <p style={styles.statValue}>{products.length}</p>
              <button style={styles.statButton} onClick={() => setActiveTab('products')}>View all</button>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>All Orders</p>
              <p style={styles.statValue}>{orders.length}</p>
              <button style={styles.statButton} onClick={() => setActiveTab('orders')}>View all</button>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Add Product</p>
              <p style={styles.statValue}>(new)</p>
              <button style={styles.statButton} onClick={() => setActiveTab('new')}>Add now</button>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <h3 style={styles.sectionTitle}>All Products</h3>
            <div style={styles.grid}>
              {products.map(p => (
                <div key={p._id} style={styles.productCard}>
                  {p.image && <img src={p.image} alt={p.name} style={styles.productImage} />}
                  <h4 style={styles.productName}>{p.name}</h4>
                  <p style={styles.productDesc}>{p.description}</p>
                  <p style={styles.productPrice}>₹{p.price}</p>
                  {p.sizes && p.sizes.length > 0 && (
                    <p style={styles.productSizes}>Sizes: {p.sizes.join(', ')}</p>
                  )}
                  <button style={styles.deleteButton} onClick={() => deleteProduct(p._id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Product Tab */}
        {activeTab === 'new' && (
          <div style={styles.formBox}>
            <h3 style={styles.sectionTitle}>New Product</h3>
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={addProduct}>
              <div style={styles.formGrid}>
                <input
                  name="name"
                  placeholder="Product name"
                  value={product.name}
                  onChange={handleProductChange}
                  style={styles.input}
                  required
                />
                <select
                  name="category"
                  value={product.category}
                  onChange={handleProductChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  name="price"
                  type="number"
                  placeholder="Price (₹)"
                  value={product.price}
                  onChange={handleProductChange}
                  style={styles.input}
                  required
                />
                <input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  value={product.stock}
                  onChange={handleProductChange}
                  style={styles.input}
                  required
                />
                <input
                  name="image"
                  placeholder="Thumbnail Img url"
                  value={product.image}
                  onChange={handleProductChange}
                  style={{ ...styles.input, gridColumn: '1 / -1' }}
                />
              </div>

              {product.category === 'Clothing' && (
                <div style={styles.sizeBox}>
                  <p style={styles.sizeLabel}>Available Sizes</p>
                  {sizeOptions.map(size => (
                    <label key={size} style={styles.sizeOption}>
                      <input
                        type="checkbox"
                        checked={product.sizes.includes(size)}
                        onChange={() => toggleSize(size)}
                      /> {size}
                    </label>
                  ))}
                </div>
              )}

              <textarea
                name="description"
                placeholder="Product Description"
                value={product.description}
                onChange={handleProductChange}
                style={styles.textarea}
                rows={3}
                required
              />
              <button type="submit" style={styles.submitButton}>
                Add product
              </button>
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h3 style={styles.sectionTitle}>All Orders ({orders.length})</h3>
            {orders.length === 0 ? (
              <p style={styles.empty}>No orders yet!</p>
            ) : (
              orders.map(order => (
                <div key={order._id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <p style={styles.orderId}>Order: {order._id}</p>
                      <p style={styles.orderUser}>
                        Customer: {order.user?.name} ({order.user?.email})
                      </p>
                    </div>
                    <span style={{
                      ...styles.status,
                      backgroundColor: getStatusColor(order.status)
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <div style={styles.orderItems}>
                    {order.items.map((item, index) => (
                      <p key={index} style={styles.orderItem}>
                        {item.product?.name}
                        {item.size ? ` (Size: ${item.size})` : ''} × {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                    ))}
                  </div>
                  <div style={styles.orderFooter}>
                    <p style={styles.orderTotal}>Total: ₹{order.totalAmount}</p>
                    <p style={styles.orderAddress}>📍 {order.address}</p>
                    <div style={styles.statusUpdate}>
                      <label>Update Status: </label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        style={styles.select}
                      >
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const navTab = (active, tab) => ({
  background: 'none',
  border: 'none',
  color: active === tab ? '#ff9800' : 'white',
  fontWeight: active === tab ? 'bold' : 'normal',
  cursor: 'pointer',
  fontSize: '0.95rem'
})

const styles = {
  page: {
    backgroundColor: '#f1f3f6',
    minHeight: '100vh'
  },
  topbar: {
    backgroundColor: '#1c2331',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  brand: {
    margin: 0
  },
  tabs: {
    display: 'flex',
    gap: '1.5rem'
  },
  body: {
    padding: '2rem'
  },
  statsRow: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  statCard: {
    backgroundColor: '#2c3a4f',
    color: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    width: '180px',
    textAlign: 'center'
  },
  statLabel: {
    margin: '0 0 0.5rem',
    fontWeight: 'bold'
  },
  statValue: {
    fontSize: '1.8rem',
    margin: '0 0 1rem'
  },
  statButton: {
    background: 'none',
    border: '1px solid #ff9800',
    color: '#ff9800',
    padding: '0.4rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  sectionTitle: {
    color: '#2874f0',
    marginBottom: '1.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    padding: '1rem'
  },
  productImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '0.5rem'
  },
  productName: {
    margin: '0 0 0.3rem',
    color: '#333'
  },
  productDesc: {
    color: '#888',
    fontSize: '0.85rem',
    margin: '0 0 0.5rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  productPrice: {
    fontWeight: 'bold',
    margin: '0 0 0.5rem'
  },
  productSizes: {
    color: '#666',
    fontSize: '0.8rem',
    margin: '0 0 0.5rem'
  },
  deleteButton: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  formBox: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '700px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  },
  input: {
    padding: '0.7rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '0.7rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    marginBottom: '1rem'
  },
  submitButton: {
    padding: '0.8rem 2rem',
    backgroundColor: '#2874f0',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  message: {
    color: 'green',
    marginBottom: '1rem'
  },
  sizeBox: {
    marginBottom: '1rem'
  },
  sizeLabel: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333'
  },
  sizeOption: {
    display: 'inline-block',
    marginRight: '1.5rem',
    cursor: 'pointer'
  },
  orderCard: {
    backgroundColor: 'white',
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  },
  orderId: {
    color: '#666',
    fontSize: '0.85rem',
    margin: '0 0 0.3rem'
  },
  orderUser: {
    fontWeight: 'bold',
    margin: 0
  },
  status: {
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.85rem'
  },
  orderItems: {
    borderTop: '1px solid #f5f5f5',
    borderBottom: '1px solid #f5f5f5',
    padding: '0.5rem 0',
    margin: '0.5rem 0'
  },
  orderItem: {
    margin: '0.3rem 0',
    color: '#444'
  },
  orderFooter: {
    marginTop: '0.5rem'
  },
  orderTotal: {
    fontWeight: 'bold',
    margin: '0.3rem 0'
  },
  orderAddress: {
    color: '#666',
    margin: '0.3rem 0'
  },
  statusUpdate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  select: {
    padding: '0.4rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },
  empty: {
    textAlign: 'center',
    color: '#666'
  }
}

export default AdminDashboard