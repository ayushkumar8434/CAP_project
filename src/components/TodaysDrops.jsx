import './TodaysDrops.css'

function TodaysDrops() {

  const phones = [
    { image: '/images/iphone15.jpg', price: '₹48,999' },
    { image: '/images/oneplus.jpg', price: '₹49,999' },
    { image: '/images/pixel.jpg', price: '₹44,999' },
    { image: '/images/samsungS24.jpg', price: '₹52,999' },
    { image: '/images/iphone15.jpg', price: '₹45,999' },

    { image: '/images/oneplus.jpg', price: '₹42,999' },
    { image: '/images/pixel.jpg', price: '₹39,999' },
    { image: '/images/samsungS24.jpg', price: '₹47,999' },
    { image: '/images/iphone15.jpg', price: '₹43,999' },
    { image: '/images/oneplus.jpg', price: '₹46,999' },

    { image: '/images/pixel.jpg', price: '₹41,999' },
    { image: '/images/samsungS24.jpg', price: '₹49,999' },
    { image: '/images/iphone15.jpg', price: '₹46,999' },
    { image: '/images/oneplus.jpg', price: '₹44,999' },
    { image: '/images/pixel.jpg', price: '₹38,999' },

    { image: '/images/samsungS24.jpg', price: '₹51,999' },
    { image: '/images/iphone15.jpg', price: '₹47,999' },
    { image: '/images/oneplus.jpg', price: '₹48,999' },
    { image: '/images/pixel.jpg', price: '₹42,999' },
    { image: '/images/samsungS24.jpg', price: '₹50,999' }
  ]

  return (
    <div className="drops-section">

      <div className="drops-header">
        <div className="drops-label">
          TODAY'S PHONE DROPS
        </div>

        <div className="drops-title">
          Fresh phones. Fresh prices.
        </div>
      </div>

      <div className="drops-grid">

        {phones.map((phone, index) => (
          <div className="drop-phone" key={index}>

            <div className="drop-phone-image">
              <img
                src={phone.image}
                alt="Phone"
              />
            </div>

            <div className="drop-phone-price">
              {phone.price}
            </div>

            <div className="drop-phone-button">
              View Phone
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default TodaysDrops