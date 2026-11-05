import './YourPhoneValue.css'
import { Link } from 'react-router-dom'

function YourPhoneValue() {
  return (
    <section className="value-section">

      <div className="value-top">
        <span>NEWPHONE PRESENTS</span>
        <span>THE UPGRADE CLUB®</span>
      </div>

      <div className="value-container">

        <div className="value-content">

          <p className="value-label">
            YOUR PHONE'S NEXT CHAPTER STARTS HERE
          </p>

          <h2>
            OLD PHONE.
            <br />
            <span>NEW BAG.</span>
          </h2>

          <div className="value-bottom">

            <p>
              That phone sitting in your drawer?
              Yeah, it still has value. Sell it,
              get paid and make room for your next upgrade.
            </p>

            <Link to="/sell" className="value-button">
              LET'S SELL <span>↗</span>
            </Link>

          </div>

        </div>

        <div className="value-visual">

          <div className="value-big-text">
            REUSE<br />RESELL<br />REPEAT.
          </div>

          <div className="value-phone">
            <img
              src="/images/iphone15.jpg"
              alt="Old phone ready to sell"
            />
          </div>

          <div className="value-sticker">
            STILL<br />WORTH<br />SOMETHING!
          </div>

          <div className="value-arrow">↙</div>

        </div>

      </div>

      <div className="value-footer">
        <span>DON'T BIN IT. BEGIN AGAIN.</span>
        <span>GIVE YOUR PHONE A NEW LIFE. ✳</span>
      </div>

    </section>
  )
}

export default YourPhoneValue