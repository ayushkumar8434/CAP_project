import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)

    // Auto-fill user info if logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.name && user.email) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }))
    }
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError('')
    setLoading(true)

    if (cart.length === 0) {
      navigate('/cart', { replace: true })
      return
    }

    // Create demo order
    const demoOrder = {
      customer: formData,
      items: cart,
      total,
      reference: `NP-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
    }

    try {
      // Clear cart after order
      localStorage.setItem('cart', JSON.stringify([]))
      localStorage.setItem('lastOrder', JSON.stringify(demoOrder))
      
      setTimeout(() => {
        navigate('/order-confirmation', { state: { demoOrder } })
      }, 1000)
    } catch (error) {
      setFormError('Could not complete checkout. Please try again.')
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-page-inner">
          <section className="checkout-empty">
            <div className="empty-icon" aria-hidden="true">🛒</div>
            <h1>Your cart is empty</h1>
            <p>Add phones to your cart before checking out.</p>
            <Link to="/phones" className="np-button np-button--primary">
              Browse Phones
            </Link>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page-inner">
        <Link className="checkout-back-link" to="/cart">
          ← Back to cart
        </Link>

        <header className="checkout-header">
          <p className="checkout-eyebrow">CHECKOUT</p>
          <h1>Delivery Details</h1>
          <p>Enter your delivery information to complete your order.</p>
        </header>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Contact Information</h2>

              <label>
                Full Name <span className="required">*</span>
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>

              <label>
                Email Address <span className="required">*</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>

              <label>
                Mobile Number <span className="required">*</span>
                <input
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                  disabled={loading}
                />
              </label>
            </div>

            <div className="form-section">
              <h2>Delivery Address</h2>

              <label>
                Address <span className="required">*</span>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Flat No., Street, Area"
                  required
                  disabled={loading}
                />
              </label>

              <div className="form-row">
                <label>
                  City <span className="required">*</span>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </label>

                <label>
                  PIN Code <span className="required">*</span>
                  <input
                    name="pincode"
                    type="text"
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 digits"
                    required
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            {formError && (
              <div className="form-error" role="alert">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="np-button np-button--primary checkout-submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order (${formatPrice(total)})`}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="checkout-items">
              {cart.map((phone) => (
                <div key={phone._id} className="checkout-item">
                  <div className="checkout-item-info">
                    <p className="checkout-item-brand">{phone.brand}</p>
                    <p className="checkout-item-title">{phone.title}</p>
                    <p className="checkout-item-specs">
                      {phone.storage} • {phone.condition}
                    </p>
                  </div>
                  <p className="checkout-item-price">{formatPrice(phone.price)}</p>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="checkout-total-row">
                <span>Delivery</span>
                <span className="free-delivery">FREE</span>
              </div>
              <div className="checkout-total-row checkout-grand-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Checkout
