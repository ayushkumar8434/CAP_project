import './Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [, forceRender] = useState(0)
  const menuButtonRef = useRef(null)

  // Login status and cart count are read on every render; the navbar re-renders on route change.
  const token = localStorage.getItem('authToken')
  const storedUser = localStorage.getItem('user')
  const isLoggedIn = Boolean(token && storedUser)
  let userName = ''
  if (isLoggedIn) {
    try {
      userName = JSON.parse(storedUser).name || 'User'
    } catch {
      userName = 'User'
    }
  }
  const cartCount = JSON.parse(localStorage.getItem('cart') || '[]').length

  useEffect(() => {
    if (!menuOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    closeMenu()
    forceRender((n) => n + 1)
    navigate('/')
  }

  if (pathname === '/login') {
    return (
      <nav className="navbar navbar-login" aria-label="Main navigation">
        <Link className="logo" to="/" onClick={closeMenu}>
          PocketPhone
        </Link>
        <Link className="login-home-link" to="/">
          <span aria-hidden="true">&larr;</span> Back to Home
        </Link>
      </nav>
    )
  }

  return (
    <nav className={`navbar${menuOpen ? ' is-menu-open' : ''}`} aria-label="Main navigation">
      <Link className="logo" to="/" onClick={closeMenu}>
        PocketPhone
      </Link>

      <button
        className="nav-menu-toggle"
        type="button"
        ref={menuButtonRef}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="nav-links" id="primary-navigation">
        {isLoggedIn && (
          <>
          <Link to="/phones" onClick={closeMenu}>Buy Phones</Link>
          <Link to="/sell" onClick={closeMenu}>Sell Your Phone</Link>
          <Link to="/orders" onClick={closeMenu}>Your Orders</Link>
          <Link to="/my-listings" onClick={closeMenu}>My Listings</Link>
          
          <Link to="/cart" className="nav-cart-link" onClick={closeMenu}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          </>
        )}
        {isLoggedIn ? (
          <>
            <span className="nav-user-name">Hi, {userName}</span>
            <button
              type="button"
              className="nav-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="login-btn np-button np-button--primary"
            onClick={closeMenu}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar