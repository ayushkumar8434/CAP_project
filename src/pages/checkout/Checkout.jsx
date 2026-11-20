import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './Checkout.css'

const API_BASE_URL = 'http://localhost:5001/api'

function makeReference() {
  return `NP-${Date.now().toString().slice(-8)}`
}

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  orders.unshift({ ...order, userEmail: user.email || order.customer.email })
  localStorage.setItem('orders', JSON.stringify(orders))
  localStorage.setItem('lastOrder', JSON.stringify(order))
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'wallet', label: 'Wallets', icon: '👛' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
]
const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda']
const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik', 'Freecharge']

function Checkout() {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  
  const [cart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))
  const [formData, setFormData] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return {
      fullName: user.name || '',
      email: user.email || '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
    }
  })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [upiId, setUpiId] = useState('')
  const [bank, setBank] = useState('')
  const [wallet, setWallet] = useState('')


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

    if (paymentMethod === 'upi' && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
      setFormError('Enter a valid UPI ID, e.g. name@okbank')
      return
    }
    if (paymentMethod === 'netbanking' && !bank) {
      setFormError('Please select your bank.')
      return
    }
    if (paymentMethod === 'wallet' && !wallet) {
      setFormError('Please select a wallet.')
      return
    }

    if (paymentMethod !== 'card') {
      // UPI / Net Banking / Wallet / COD are not processed by Stripe yet.
      // The order is recorded locally; UPI, Net Banking and Wallet are marked pending.
      const labels = { upi: `UPI (${upiId.trim()})`, netbanking: `Net Banking (${bank})`, wallet: `Wallet (${wallet})`, cod: 'Cash on Delivery' }
      const order = {
        customer: formData,
        items: cart,
        total,
        reference: makeReference(),
        date: new Date().toISOString(),
        paymentStatus: paymentMethod === 'cod' ? 'pay_on_delivery' : 'pending',
        paymentMethod: labels[paymentMethod],
      }
      localStorage.setItem('cart', JSON.stringify([]))
      saveOrder(order)
      navigate('/order-confirmation', { state: { demoOrder: order } })
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
          reference: makeReference(),
          date: new Date().toISOString(),
          paymentStatus: 'paid',
          paymentId: paymentIntent.id,
          paymentMethod: 'Card',
        }

        // Clear cart and save order
        localStorage.setItem('cart', JSON.stringify([]))
        saveOrder(demoOrder)
        
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
              <div className="payment-methods" role="radiogroup" aria-label="Payment method">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`payment-method${paymentMethod === m.id ? ' is-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      disabled={loading}
                    />
                    <span aria-hidden="true">{m.icon}</span>
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <>
                  <label>
                    Card Details <span className="required">*</span>
                    <div className="stripe-card-element">
                      <CardElement options={cardElementOptions} />
                    </div>
                  </label>
                  <p className="payment-note">
                    🔒 Your payment is secured by Stripe. We never store your card details.
                  </p>
                </>
              )}

              {paymentMethod === 'upi' && (
                <label>
                  UPI ID <span className="required">*</span>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@okbank"
                  />
                </label>
              )}

              {paymentMethod === 'netbanking' && (
                <label>
                  Select Bank <span className="required">*</span>
                  <select value={bank} onChange={(e) => setBank(e.target.value)} className="payment-select">
                    <option value="">Choose your bank</option>
                    {BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </label>
              )}

              {paymentMethod === 'wallet' && (
                <label>
                  Select Wallet <span className="required">*</span>
                  <select value={wallet} onChange={(e) => setWallet(e.target.value)} className="payment-select">
                    <option value="">Choose a wallet</option>
                    {WALLETS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </label>
              )}

              {paymentMethod === 'cod' && (
                <p className="payment-note">
                  Pay in cash when your phone is delivered.
                </p>
              )}
            </div>

            {formError && (
              <div className="form-error" role="alert">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="np-button np-button--primary checkout-submit-btn"
              disabled={loading || (paymentMethod === 'card' && !stripe)}
            >
              {paymentProcessing ? (
                <>
                  <span className="payment-spinner" />
                  Processing Payment...
                </>
              ) : paymentMethod === 'cod' ? (
                'Place Order'
              ) : (
                `Pay ${formatPrice(total)}`
              )}
            </button>

            {paymentMethod === 'card' && (
              <p className="test-card-note">
                <strong>Test Card:</strong> 4242 4242 4242 4242 | Any future date | Any 3-digit CVC
              </p>
            )}
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
