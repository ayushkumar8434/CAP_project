import { Link, useLocation } from 'react-router-dom'
import './Footer.css'

const helpfulLinks = [
  { label: 'Is This a Good Deal?', id: 'good-deal' },
]

function scrollToSection(id) {
  const section = document.getElementById(id)
  if (!section) return

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  section.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

function Footer() {
  const location = useLocation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <Link className="site-footer-logo" to="/" aria-label="PocketPhone home">
              PocketPhone<span aria-hidden="true">.</span>
            </Link>
            <p className="site-footer-tagline">Give Your Phone A New Life.</p>
            <p className="site-footer-description">
              A smarter place to buy and sell second-hand phones, with clear
              information to help you choose with confidence.
            </p>
          </div>

          <nav className="site-footer-nav" aria-label="Quick links">
            <h2 className="site-footer-heading">Quick Links</h2>
            <Link to="/">Home</Link>
            <Link to="/#popular-phones">Explore Phones</Link>
            <Link to="/sell">Sell Your Phone</Link>
          </nav>

          <nav className="site-footer-nav" aria-label="Helpful links">
            <h2 className="site-footer-heading">Helpful Links</h2>
            {helpfulLinks.map(({ label, id }) => (
              <Link
                key={id}
                to={`/#${id}`}
                onClick={() => {
                  if (location.pathname === '/' && location.hash === `#${id}`) {
                    scrollToSection(id)
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer-bottom">
          <p>© {currentYear} PocketPhone. All rights reserved.</p>
          <p>Made for smarter phone choices.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
