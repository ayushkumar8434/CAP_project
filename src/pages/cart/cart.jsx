import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Cart.css'

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(savedCart)
    setLoading(false)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const updateCart = (nextCart) => {
    localStorage.setItem('cart', JSON.stringify(nextCart))
    setCart(nextCart)
  }

  const removeItem = (phoneId) => {
    const nextCart = cart.filter((item) => item._id !== phoneId)
    updateCart(nextCart)
  }

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      updateCart([])
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-page-inner">
          <p>Loading cart...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <div className="cart-page-inner">
        <div className="cart-header">
          <h1>Your Cart</h1>
          {cart.length > 0 && (
            <button
              type="button"
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <section className="cart-empty">
            <div className="empty-cart-icon" aria-hidden="true">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Start adding phones to your cart to see them here.</p>
            <Link to="/phones" className="np-button np-button--primary">
              Browse Phones
            </Link>
          </section>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((phone) => (
                <article className="cart-item" key={phone._id}>
                  <div className="cart-item-image">
                    <div className="cart-image-placeholder">
                      {phone.brand.charAt(0)}
                    </div>
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-brand">{phone.brand}</p>
                    <h2 className="cart-item-title">{phone.title}</h2>
                    <div className="cart-item-specs">
                      <span>{phone.storage}</span>
                      <span>•</span>
                      <span>{phone.condition}</span>
                    </div>
                    <p className="cart-item-price">{formatPrice(phone.price)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeItem(phone._id)}
                      aria-label={`Remove ${phone.title} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-summary-inner">
                <h2>Order Summary</h2>
                <div className="cart-summary-row">
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="cart-summary-row cart-summary-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  type="button"
                  className="np-button np-button--primary checkout-btn"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
                <Link to="/phones" className="continue-shopping-link">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Cart
