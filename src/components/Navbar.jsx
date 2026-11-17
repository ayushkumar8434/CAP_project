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

            <div className="nav-links">
            <Link to="/">Buy Phones</Link>
            <Link to="/sell">Sell Your Phone</Link>
            <a href="/login"
             className="login-btn">Login</a>
            </div>
        </nav>
    )
}

export default Navbar