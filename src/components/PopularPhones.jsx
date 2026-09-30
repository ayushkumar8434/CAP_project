import './PopularPhones.css'

function PopularPhones() {
  return (
    <div className="popular-section">

      <div className="popular-header">
        <div className="popular-label">
          TRENDING NOW
        </div>

        <div className="popular-title">
          Popular Phones
        </div>

        <div className="popular-description">
          Top phones people are buying on NewPhone.
        </div>
      </div>


      <div className="popular-grid">

        {/* iPhone 15 */}
        <div className="phone-card">

          <div className="phone-image">
            <img
              src="/images/iphone15.jpg"
              alt="iPhone 15"
            />
          </div>

          <div className="phone-brand">
            Apple
          </div>

          <div className="phone-name">
            iPhone 15
          </div>

          <div className="phone-rating">
            ★ 4.8
          </div>

          <div className="phone-price">
            ₹48,999
          </div>

          <div className="phone-old-price">
            ₹79,900
          </div>

          <div className="phone-button">
            View Details
          </div>

        </div>


        {/* OnePlus 13 */}
        <div className="phone-card">

          <div className="phone-image">
            <img
              src="/images/oneplus.jpg"
              alt="OnePlus 13"
            />
          </div>

          <div className="phone-brand">
            OnePlus
          </div>

          <div className="phone-name">
            OnePlus 13
          </div>

          <div className="phone-rating">
            ★ 4.8
          </div>

          <div className="phone-price">
            ₹49,999
          </div>

          <div className="phone-old-price">
            ₹69,999
          </div>

          <div className="phone-button">
            View Details
          </div>

        </div>


        {/* Google Pixel 9 */}
        <div className="phone-card">

          <div className="phone-image">
            <img
              src="/images/pixel.jpg"
              alt="Google Pixel 9"
            />
          </div>

          <div className="phone-brand">
            Google
          </div>

          <div className="phone-name">
            Pixel 9
          </div>

          <div className="phone-rating">
            ★ 4.6
          </div>

          <div className="phone-price">
            ₹44,999
          </div>

          <div className="phone-old-price">
            ₹79,999
          </div>

          <div className="phone-button">
            View Details
          </div>

        </div>


        {/* Samsung Galaxy S24 */}
        <div className="phone-card">

          <div className="phone-image">
            <img
              src="/images/samsungS24.jpg"
              alt="Samsung Galaxy S24"
            />
          </div>

          <div className="phone-brand">
            Samsung
          </div>

          <div className="phone-name">
            Galaxy S24
          </div>

          <div className="phone-rating">
            ★ 4.7
          </div>

          <div className="phone-price">
            ₹52,999
          </div>

          <div className="phone-old-price">
            ₹74,999
          </div>

          <div className="phone-button">
            View Details
          </div>

        </div>

      </div>

    </div>
  )
}

export default PopularPhones