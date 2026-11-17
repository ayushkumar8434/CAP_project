import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  formatPrice,
  products,
  readCart,
  readWishlist,
  saveCart,
  saveWishlist,
} from '../../data/products'
import './ProductDetails.css'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((item) => item.id === id)
  const [wishlist, setWishlist] = useState(readWishlist)

  function toggleWishlist() {
    const nextWishlist = wishlist.includes(product.id)
      ? wishlist.filter((productId) => productId !== product.id)
      : [...wishlist, product.id]

    saveWishlist(nextWishlist)
    setWishlist(nextWishlist)
  }

  function addToCart() {
    const cart = readCart()
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      saveCart(cart.map((item) => (
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )))
    } else {
      saveCart([...cart, { id: product.id, quantity: 1 }])
    }

    navigate('/cart')
  }

  if (!product) {
    return (
      <main className="product-page">
        <div className="product-not-found">
          <h1>Phone not found</h1>
          <p>That phone is not in the demo catalog.</p>
          <Link to="/">Back to phones</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="product-page">
      <div className="product-page-inner">
        <Link className="product-breadcrumb" to="/">Buy Phones <span>/</span> {product.name}</Link>

        <div className="product-details-layout">
          <div className="product-main-image">
            <img src={product.image} alt={product.name} />
          </div>

          <section className="product-information">
            <p className="product-brand">{product.brand}</p>
            <h1>{product.name}</h1>
            <p className="product-rating">★ {product.rating} <span>Customer rating</span></p>

            <div className="product-pricing">
              <strong>{formatPrice(product.price)}</strong>
              <del>{formatPrice(product.originalPrice)}</del>
            </div>

            <p className="product-demo-note">
              Demo catalog listing. Product condition and full specifications are not provided yet.
            </p>

            <div className="product-facts">
              <div><span>Brand</span><strong>{product.brand}</strong></div>
              <div><span>Model</span><strong>{product.name}</strong></div>
              <div><span>Listing price</span><strong>{formatPrice(product.price)}</strong></div>
            </div>

            <button className="product-add-button" type="button" onClick={addToCart}>
              Add to cart
            </button>
            <button
              className={`product-wishlist-button${wishlist.includes(product.id) ? ' is-saved' : ''}`}
              type="button"
              aria-pressed={wishlist.includes(product.id)}
              onClick={toggleWishlist}
            >
              {wishlist.includes(product.id) ? '♥ Saved to wishlist' : '♡ Add to wishlist'}
            </button>
            <Link className="product-continue-link" to="/">Continue shopping</Link>
          </section>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails
