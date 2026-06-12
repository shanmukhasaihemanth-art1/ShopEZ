import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Cart() {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCart(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCart()
    } catch (err) {
      console.log(err)
    }
  }
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCart()
    } catch (err) {
      console.log(err)
    }
  }

  const placeOrder = async () => {
    if (!address) {
      setMessage('Please enter a delivery address')
      return
    }
    try {
      const items = cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }))
      const totalAmount = cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity, 0
      )
      await axios.post(
        'http://localhost:8000/api/orders',
        { items, address, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Order placed successfully!')
      setCart({ items: [] })
      setTimeout(() => navigate('/orders'), 2000)
    } catch (err) {
      setMessage('Failed to place order')
    }
  }

  const totalAmount = cart.items.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity, 0
  )

  if (loading) return <p style={styles.loading}>Loading cart...</p>

  return (
    <div style={styles.page}>
      {cart.items.length === 0 ? (
        <p style={styles.empty}>Your cart is empty!</p>
      ) : (
        <>
          {/* Left side - items */}
          {/* Left side - items */}
          <div style={styles.itemsBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={styles.title}>My Cart ({cart.items.length})</h2>
              <button style={styles.removeButton} onClick={clearCart}>Clear Cart</button>
            </div>
            {message && <p style={styles.message}>{message}</p>}
            {cart.items.filter(item => item.product).map(item => (
              <div key={item.product._id} style={styles.card}>
                {item.product.image && (
                  <img src={item.product.image} alt={item.product.name} style={styles.image} />
                )}
                <div style={styles.info}>
                  <h3 style={styles.name}>{item.product.name}</h3>
                  <p style={styles.description}>{item.product.description}</p>
                  {item.size && <p style={styles.qty}>Size: {item.size}</p>}
                  <p style={styles.qty}>Quantity: {item.quantity}</p>
                  <p style={styles.price}>Price: ₹{item.product.price}</p>
                  <button
                    style={styles.removeButton}
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - price summary */}
          <div style={styles.summaryBox}>
            <h3 style={styles.summaryTitle}>Price Details</h3>
            <div style={styles.summaryRow}>
              <span>Total MRP</span>
              <span>₹{totalAmount}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Delivery Charges</span>
              <span style={{ color: 'green' }}>FREE</span>
            </div>
            <hr style={styles.hr} />
            <div style={styles.summaryRowBold}>
              <span>Final Price</span>
              <span>₹{totalAmount}</span>
            </div>

            <h3 style={styles.summaryTitle}>Delivery Address</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.textarea}
              placeholder="Enter your full delivery address"
              rows={3}
            />
            <button style={styles.orderButton} onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    backgroundColor: '#f1f3f6',
    minHeight: '100vh',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  itemsBox: {
    flex: 2,
    minWidth: '320px',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },
  title: {
    color: '#2874f0',
    marginBottom: '1rem'
  },
  card: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem 0',
    borderBottom: '1px solid #eee'
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  info: {
    flex: 1
  },
  name: {
    margin: '0 0 0.3rem',
    color: '#333'
  },
  description: {
    color: '#888',
    fontSize: '0.85rem',
    margin: '0 0 0.5rem'
  },
  qty: {
    margin: '0.2rem 0',
    color: '#555'
  },
  price: {
    fontWeight: 'bold',
    margin: '0.2rem 0 0.5rem'
  },
  removeButton: {
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  summaryBox: {
    flex: 1,
    minWidth: '280px',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },
  summaryTitle: {
    color: '#666',
    fontSize: '1rem',
    marginBottom: '1rem',
    marginTop: '1.2rem',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.7rem',
    color: '#333'
  },
  summaryRowBold: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '1rem'
  },
  hr: {
    border: 'none',
    borderTop: '1px dashed #ddd',
    margin: '0.8rem 0'
  },
  textarea: {
    width: '100%',
    padding: '0.7rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    resize: 'none'
  },
  orderButton: {
    width: '100%',
    padding: '0.9rem',
    backgroundColor: '#fb641b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  loading: {
    textAlign: 'center',
    marginTop: '2rem',
    width: '100%'
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    width: '100%',
    padding: '2rem'
  },
  message: {
    textAlign: 'center',
    color: 'green',
    marginBottom: '1rem'
  }
}

export default Cart