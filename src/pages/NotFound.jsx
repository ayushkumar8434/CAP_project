import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-card" aria-labelledby="not-found-heading">
        <p className="not-found-eyebrow">NEWPHONE / 404</p>
        <h1 id="not-found-heading">Page Not Found</h1>
        <p className="not-found-message">
          We couldn’t find the page you were looking for. Head home or explore
          the phones currently available.
        </p>
        <div className="not-found-actions">
          <Link
            className="np-button np-button--primary"
            to="/"
          >
            Back to Home
          </Link>
          <Link
            className="np-button np-button--secondary"
            to="/#popular-phones"
          >
            Explore Phones
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFound
