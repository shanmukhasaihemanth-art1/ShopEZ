import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
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

  if (loading) return <p style={styles.loading}>Loading orders...</p>

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Orders</h2>
      {orders.length === 0 ? (
        <p style={styles.empty}>You have no orders yet!</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={styles.card}>
            <div style={styles.header}>
              <p style={styles.orderId}>Order ID: {order._id}</p>
              <span style={{
                ...styles.status,
                backgroundColor: getStatusColor(order.status)
              }}>
                {order.status}
              </span>
            </div>
            <div style={styles.items}>
              {order.items.map((item, index) => (
                <div key={index} style={styles.item}>
                  <p style={styles.itemName}>
                    {item.product?.name || 'Product'}
                  </p>
                  <p style={styles.itemDetails}>
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              ))}
            </div>
            <div style={styles.footer}>
              <p style={styles.address}>📍 {order.address}</p>
              <p style={styles.total}>Total: ₹{order.totalAmount}</p>
              <p style={styles.date}>
                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    color: '#2874f0',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.5rem'
  },
  orderId: {
    color: '#666',
    fontSize: '0.85rem',
    margin: 0
  },
  status: {
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.85rem'
  },
  items: {
    marginBottom: '1rem'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f5f5f5'
  },
  itemName: {
    margin: 0,
    fontWeight: 'bold'
  },
  itemDetails: {
    margin: 0,
    color: '#666'
  },
  footer: {
    marginTop: '1rem'
  },
  address: {
    color: '#666',
    margin: '0.3rem 0'
  },
  total: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    margin: '0.3rem 0'
  },
  date: {
    color: '#888',
    fontSize: '0.85rem',
    margin: '0.3rem 0'
  },
  loading: {
    textAlign: 'center',
    marginTop: '2rem'
  },
  empty: {
    textAlign: 'center',
    color: '#666'
  }
}

export default Orders