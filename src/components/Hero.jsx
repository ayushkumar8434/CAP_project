import './Hero.css'
import Phone3D from './Phone3D'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="hero">
      <div className="hero-container">

        <div className="hero-content">

          <div className="hero-label">
            THE SMARTER WAY TO BUY & SELL
          </div>

          <div className="hero-title">
            Give Your Phone
            <div className="hero-title-highlight">
              A New Life.
            </div>
          </div>

          <div className="hero-description">
            Buy verified second-hand phones or sell your old device
            at a fair price.
          </div>

          <div className="hero-buttons">

            <Link to="/" className="hero-button primary-button">
              Browse Phones
            </Link>

            <Link to="/sell" className="hero-button secondary-button">
              Sell Your Phone
            </Link>

          </div>

        </div>

        <div className="hero-visual">

            <Phone3D />

        </div>
      </div>
    </div>
  )
}

export default Hero