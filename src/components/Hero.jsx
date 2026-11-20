import './Hero.css'
import Phone3D from './Phone3D'
import SafeBoundary from './SafeBoundary'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="hero">
      <div className="hero-container">

        <div className="hero-content">

          <p className="hero-label">
            THE SMARTER WAY TO BUY & SELL
          </p>

          <h1 className="hero-title">
            Give Your Phone
            <div className="hero-title-highlight">
              A New Life.
            </div>
          </h1>

          <p className="hero-description">
            Explore pre-owned phones or sell your old device
            at a fair price.
          </p>

          <div className="hero-buttons">

            <Link to="/phones" className="hero-button np-button np-button--primary">
              Browse Phones
            </Link>

            <Link to="/sell" className="hero-button np-button np-button--secondary">
              Sell Your Phone
            </Link>

          </div>

        </div>

        <div className="hero-visual">

            <SafeBoundary>
              <Phone3D />
            </SafeBoundary>

        </div>
      </div>
    </div>
  )
}

export default Hero