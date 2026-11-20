import './Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const menuButtonRef = useRef(null)

  // Check login status and cart count
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    setCartCount(cart.length)
    
    if (token && user) {
      setIsLoggedIn(true)
      try {
        const userData = JSON.parse(user)
        setUserName(userData.name || 'User')
      } catch {
        setUserName('User')
      }
    } else {
      setIsLoggedIn(false)
      setUserName('')
    }
  }, [pathname]) // Re-check on route change

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
    setIsLoggedIn(false)
    setUserName('')
    closeMenu()
    navigate('/')
  }

  if (pathname === '/login') {
    return (
      <nav className="navbar navbar-login" aria-label="Main navigation">
        <Link className="logo" to="/" onClick={closeMenu}>
          NewPhone
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
        NewPhone
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
        <Link to="/phones" onClick={closeMenu}>Buy Phones</Link>
        <Link to="/sell" onClick={closeMenu}>Sell Your Phone</Link>
        
        <Link to="/cart" className="nav-cart-link" onClick={closeMenu}>
          🛒 Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        
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