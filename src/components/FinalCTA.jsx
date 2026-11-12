import { Link } from 'react-router-dom'
import './FinalCTA.css'

function FinalCTA() {
  return (
    <section className="final-cta-section" aria-labelledby="final-cta-heading">
      <div className="final-cta-inner">
        <p className="final-cta-eyebrow">YOUR NEXT MOVE STARTS HERE</p>
        <h2 className="final-cta-title" id="final-cta-heading">
          Ready when
          <br />
          <span>you are.</span>
        </h2>
        <p className="final-cta-description">
          Find a phone that feels right, or give your current one a fresh start.
          Either way, make your next move a good one.
        </p>
        <div className="final-cta-actions">
          <Link className="final-cta-link final-cta-primary np-button np-button--primary" to="/#popular-phones">
            Explore Phones <span aria-hidden="true">↗</span>
          </Link>
          <Link className="final-cta-link final-cta-secondary np-button np-button--secondary" to="/sell">
            Sell Your Phone <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <span className="final-cta-mark" aria-hidden="true">✳</span>
      </div>
    </section>
  )
}

export default FinalCTA
