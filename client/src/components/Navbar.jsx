import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <div>
      {/* Top bar */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>ShopEZ</Link>

        <div style={styles.search}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>
<div style={styles.links}>
          {!user ? (
            <Link to="/login" style={styles.loginBtn}>Login</Link>
          ) : user.role === 'admin' ? (
            <>
              <Link to="/admin" style={styles.link}>Admin Dashboard</Link>
              <div style={styles.userMenu}>
                <span style={styles.user}>👤 {user.name}</span>
                <button onClick={handleLogout} style={styles.button}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/cart" style={styles.iconLink}>
                <span style={styles.icon}>🛒</span> Cart
              </Link>
              <Link to="/orders" style={styles.link}>Orders</Link>
              <div style={styles.userMenu}>
                <span style={styles.user}>👤 {user.name}</span>
                <button onClick={handleLogout} style={styles.button}>Logout</button>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 2rem',
    background: 'linear-gradient(to right, #2874f0, #2874f0)',
    color: 'white',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.6rem',
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 1.1
  },
  brandAccent: {
    color: '#ffe500'
  },
  brandTag: {
    fontSize: '0.7rem',
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#ffe500'
  },
  search: {
    flex: 1,
    maxWidth: '550px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '2px',
    padding: '0.55rem 1rem'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontSize: '0.95rem',
    color: '#212121'
  },
  searchIcon: {
    color: '#2874f0',
    fontSize: '1rem'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.8rem'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  iconLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem'
  },
  icon: {
    fontSize: '1.1rem'
  },
  loginBtn: {
    color: '#2874f0',
    backgroundColor: 'white',
    textDecoration: 'none',
    padding: '0.4rem 2.5rem',
    borderRadius: '2px',
    fontWeight: '700',
    fontSize: '0.95rem'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem'
  },
  user: {
    color: 'white',
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  button: {
    backgroundColor: 'white',
    color: '#2874f0',
    border: 'none',
    padding: '0.35rem 0.9rem',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.85rem'
  },
  categoryBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
    backgroundColor: 'white',
    padding: '0.7rem 1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    flexWrap: 'wrap'
  },
  categoryLink: {
    color: '#212121',
    fontWeight: '500',
    fontSize: '0.9rem',
    textDecoration: 'none'
  }
}

export default Navbar