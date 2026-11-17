import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice, products, readCart, saveCart } from '../../data/products'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const cart = readCart()
  const cartProducts = cart
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.id),
    }))
    .filter((item) => item.product)
  const total = cartProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const [formError, setFormError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (cartProducts.length === 0) {
      navigate('/cart', { replace: true })
      return
    }

    const formData = new FormData(event.currentTarget)
    const customer = Object.fromEntries(formData.entries())
    const demoOrder = {
      customer,
      items: cartProducts.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        quantity,
        price: product.price,
      })),
      total,
      reference: `DEMO-${Date.now().toString().slice(-8)}`,
    }

    try {
      saveCart([])
    } catch {
      setFormError('Could not finish the demo checkout. Please try again.')
      return
    }

    navigate('/order-confirmation', { state: { demoOrder } })
  }

  if (cartProducts.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add a phone to your cart before starting checkout.</p>
          <Link to="/">Browse phones</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page-inner">
        <Link className="checkout-back-link" to="/cart">← Back to cart</Link>
        <header className="checkout-header">
          <p className="checkout-eyebrow">DEMO CHECKOUT</p>
          <h1>Delivery details</h1>
          <p>Enter where you would like your demo order delivered.</p>
        </header>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input name="fullName" type="text" autoComplete="name" required maxLength={80} />
            </label>

            <label>
              Mobile number
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                pattern="[0-9]{10}"
                maxLength={10}
                title="Enter a 10-digit mobile number"
                required
              />
            </label>

            <label>
              House / street address
              <textarea
                name="address"
                autoComplete="street-address"
                rows="3"
                maxLength={200}
                required
              />
            </label>

            <div className="checkout-field-row">
              <label>
                City
                <input name="city" type="text" autoComplete="address-level2" maxLength={60} required />
              </label>
              <label>
                State
                <input name="state" type="text" autoComplete="address-level1" maxLength={60} required />
              </label>
            </div>

            <label className="checkout-pincode">
              PIN code
              <input
                name="pincode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="[0-9]{6}"
                maxLength={6}
                title="Enter a 6-digit PIN code"
                required
              />
            </label>

            {formError && <p className="checkout-error" role="alert">{formError}</p>}

            <button className="checkout-submit-button" type="submit">
              Place demo order
            </button>
            <p className="checkout-disclaimer">
              This is a frontend demo only. No real order is submitted and no payment is taken.
            </p>
          </form>

          <aside className="checkout-order-summary">
            <h2>Order summary</h2>
            {cartProducts.map(({ product, quantity }) => (
              <div className="checkout-item" key={product.id}>
                <img src={product.image} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <span>Qty: {quantity}</span>
                </div>
                <strong>{formatPrice(product.price * quantity)}</strong>
              </div>
            ))}
            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Checkout
