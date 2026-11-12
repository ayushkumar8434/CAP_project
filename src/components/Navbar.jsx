import './Navbar.css'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)

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
        <Link to="/#popular-phones" onClick={closeMenu}>Buy Phones</Link>
        <Link to="/sell" onClick={closeMenu}>Sell Your Phone</Link>
        <Link
          to="/login"
          className="login-btn np-button np-button--primary"
          onClick={closeMenu}
        >
          Login
        </Link>
      </div>
    </nav>
  )
}

export default Navbar