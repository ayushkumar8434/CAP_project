import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice, products, readCart, saveCart } from '../../data/products'
import './Cart.css'

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(readCart)
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

  function updateCart(nextCart) {
    saveCart(nextCart)
    setCart(nextCart)
  }

  function changeQuantity(productId, amount) {
    updateCart(cart.flatMap((item) => {
      if (item.id !== productId) {
        return [item]
      }

      const quantity = item.quantity + amount
      return quantity > 0 ? [{ ...item, quantity }] : []
    }))
  }

  function removeItem(productId) {
    updateCart(cart.filter((item) => item.id !== productId))
  }

  return (
    <main className="cart-page">
      <div className="cart-page-inner">
        <h1>Your cart</h1>

        {cartProducts.length === 0 ? (
          <section className="cart-empty">
            <p>Your cart is empty.</p>
            <Link to="/">Browse phones</Link>
          </section>
        ) : (
          <>
            <div className="cart-items">
              {cartProducts.map(({ product, quantity }) => (
                <article className="cart-item" key={product.id}>
                  <div className="cart-item-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div>
                    <p className="cart-item-brand">{product.brand}</p>
                    <h2>{product.name}</h2>
                    <p className="cart-item-price">{formatPrice(product.price)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-quantity-controls" aria-label={`Quantity for ${product.name}`}>
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, -1)}
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, 1)}
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-remove-button"
                      type="button"
                      onClick={() => removeItem(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button
                className="cart-checkout-button"
                type="button"
                onClick={() => navigate('/checkout')}
              >
                Proceed to checkout
              </button>
              <p className="cart-checkout-note">
                Demo checkout only. No payment will be taken.
                <Link to="/">Continue shopping</Link>
              </p>
            </aside>
          </>
        )}
      </div>
    </main>
  )
}

export default Cart