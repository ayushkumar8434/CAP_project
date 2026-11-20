import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './Checkout.css'

const API_BASE_URL = 'http://localhost:5001/api'

function Checkout() {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  
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
  const [paymentProcessing, setPaymentProcessing] = useState(false)

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (cart.length === 0) {
      navigate('/cart', { replace: true })
      return
    }

    if (!stripe || !elements) {
      setFormError('Stripe is not loaded yet. Please wait.')
      return
    }

    setPaymentProcessing(true)
    setLoading(true)

    try {
      // Get auth token
      const token = localStorage.getItem('authToken')
      if (!token) {
        setFormError('Please login to complete checkout.')
        setLoading(false)
        setPaymentProcessing(false)
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      // Step 1: Create payment intent
      const paymentIntentResponse = await fetch(`${API_BASE_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: total * 100, // Convert to paise (smallest unit)
          currency: 'inr',
        }),
      })

      const paymentIntentData = await paymentIntentResponse.json()

      if (!paymentIntentResponse.ok || !paymentIntentData.success) {
        throw new Error(paymentIntentData.message || 'Failed to create payment')
      }

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement)
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.pincode,
                country: 'IN',
              },
            },
          },
        }
      )

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful - create order
        const demoOrder = {
          customer: formData,
          items: cart,
          total,
          reference: `NP-${Date.now().toString().slice(-8)}`,
          date: new Date().toISOString(),
          paymentStatus: 'paid',
          paymentId: paymentIntent.id,
        }

        // Clear cart and save order
        localStorage.setItem('cart', JSON.stringify([]))
        localStorage.setItem('lastOrder', JSON.stringify(demoOrder))
        
        // Navigate to confirmation
        navigate('/order-confirmation', { state: { demoOrder } })
      } else {
        throw new Error('Payment was not successful')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setFormError(error.message || 'Payment failed. Please try again.')
      setPaymentProcessing(false)
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

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#111827',
        '::placeholder': {
          color: '#9ca3af',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#dc2626',
      },
    },
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page-inner">
        <Link className="checkout-back-link" to="/cart">
          ← Back to cart
        </Link>

        <header className="checkout-header">
          <p className="checkout-eyebrow">SECURE CHECKOUT</p>
          <h1>Payment Details</h1>
          <p>Complete your order with secure Stripe payment.</p>
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

            <div className="form-section">
              <h2>Payment Information</h2>
              <label>
                Card Details <span className="required">*</span>
                <div className="stripe-card-element">
                  <CardElement options={cardElementOptions} />
                </div>
              </label>
              <p className="payment-note">
                🔒 Your payment is secured by Stripe. We never store your card details.
              </p>
            </div>

            {formError && (
              <div className="form-error" role="alert">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="np-button np-button--primary checkout-submit-btn"
              disabled={loading || !stripe}
            >
              {paymentProcessing ? (
                <>
                  <span className="payment-spinner" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${formatPrice(total)}`
              )}
            </button>

            <p className="test-card-note">
              <strong>Test Card:</strong> 4242 4242 4242 4242 | Any future date | Any 3-digit CVC
            </p>
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

            <div className="secure-payment-badge">
              <span>🔒</span>
              <div>
                <strong>Secure Payment</strong>
                <p>Powered by Stripe</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Checkout
