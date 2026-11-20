import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './OrderConfirmation.css'

function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const demoOrder = location.state?.demoOrder

  useEffect(() => {
    // If no order data, redirect to home
    if (!demoOrder) {
      navigate('/', { replace: true })
    }
  }, [demoOrder, navigate])

  if (!demoOrder) {
    return null
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <main className="order-confirmation-page">
      <div className="order-confirmation-inner">
        <div className="confirmation-card">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>

          <h1>Order Placed Successfully!</h1>
          <p className="confirmation-message">
            Thank you for your order. We'll process it shortly.
          </p>

          <div className="order-reference">
            <span className="reference-label">Order Reference:</span>
            <span className="reference-number">{demoOrder.reference}</span>
          </div>

          <div className="order-details-section">
            <h2>Order Summary</h2>

            <div className="order-items">
              {demoOrder.items.map((item) => (
                <div key={item._id} className="order-item">
                  <div className="order-item-info">
                    <p className="order-item-brand">{item.brand}</p>
                    <p className="order-item-title">{item.title}</p>
                    <p className="order-item-specs">
                      {item.storage} • {item.condition}
                    </p>
                  </div>
                  <p className="order-item-price">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>

            <div className="order-total">
              <span>Total Amount:</span>
              <span className="order-total-amount">{formatPrice(demoOrder.total)}</span>
            </div>
          </div>

          <div className="delivery-info">
            <h2>Delivery Information</h2>
            <div className="delivery-details">
              <p><strong>Name:</strong> {demoOrder.customer.fullName}</p>
              <p><strong>Email:</strong> {demoOrder.customer.email}</p>
              <p><strong>Phone:</strong> {demoOrder.customer.phone}</p>
              <p><strong>Address:</strong></p>
              <p className="address-text">
                {demoOrder.customer.address}<br />
                {demoOrder.customer.city}, {demoOrder.customer.pincode}
              </p>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="np-button np-button--primary">
              View Your Orders
            </Link>
            <Link to="/phones" className="np-button np-button--secondary">
              Continue Shopping
            </Link>
            <Link to="/" className="np-button np-button--secondary">
              Go to Home
            </Link>
          </div>

          <p className="confirmation-note">
            This is a demo order. No actual payment has been processed.
          </p>
        </div>
      </div>
    </main>
  )
}

export default OrderConfirmation
