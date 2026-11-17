import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../../data/products'
import './Checkout.css'

function OrderConfirmation() {
  const { state } = useLocation()
  const demoOrder = state?.demoOrder

  if (!demoOrder) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <h1>No demo order to show</h1>
          <p>Start at the cart to try the checkout demo.</p>
          <Link to="/cart">Go to cart</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <section className="order-confirmation">
        <span className="order-confirmation-icon" aria-hidden="true">✓</span>
        <p className="checkout-eyebrow">DEMO ORDER COMPLETE</p>
        <h1>Thanks, {demoOrder.customer.fullName}!</h1>
        <p className="order-confirmation-copy">
          Your demo checkout is complete. No real order was placed and no payment was taken.
        </p>
        <div className="order-reference">
          <span>Demo reference</span>
          <strong>{demoOrder.reference}</strong>
        </div>
        <div className="order-confirmation-items">
          {demoOrder.items.map((item) => (
            <div className="checkout-total" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="checkout-total order-confirmation-total">
            <span>Total</span>
            <strong>{formatPrice(demoOrder.total)}</strong>
          </div>
        </div>
        <Link className="checkout-home-link" to="/">Continue shopping</Link>
      </section>
    </main>
  )
}

export default OrderConfirmation
