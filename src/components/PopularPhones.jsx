import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, products, readWishlist, saveWishlist } from '../data/products'
import './PopularPhones.css'

function PopularPhones() {
  const [wishlist, setWishlist] = useState(readWishlist)

  function toggleWishlist(productId) {
    const nextWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId]

    saveWishlist(nextWishlist)
    setWishlist(nextWishlist)
  }

  return (
    <section
      className="popular-section"
      id="popular-phones"
      aria-labelledby="popular-heading"
    >
      <div className="popular-header">
        <p className="popular-label">NEWPHONE INVENTORY</p>
        <h2 className="popular-title" id="popular-heading">
          Popular Phones
        </h2>
        <p className="popular-description">
          We’ll show current NewPhone stock here when it’s available.
        </p>
      </div>

<<<<<<< HEAD
      <div className="popular-availability" role="status">
        <span className="availability-mark" aria-hidden="true">
          <span />
        </span>
        <div>
          <h3>No phones available right now</h3>
          <p>
            We don’t have live inventory to display. Check back as phones are
            inspected and approved for sale.
          </p>
        </div>
=======

      <div className="popular-grid">
        {products.map((product) => (
          <article className="phone-card" key={product.id}>
            <button
              className={`phone-wishlist-button${wishlist.includes(product.id) ? ' is-saved' : ''}`}
              type="button"
              aria-pressed={wishlist.includes(product.id)}
              aria-label={`${wishlist.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${wishlist.includes(product.id) ? 'from' : 'to'} wishlist`}
              onClick={() => toggleWishlist(product.id)}
            >
              {wishlist.includes(product.id) ? '♥' : '♡'}
            </button>
            <Link
              className="phone-card-link"
              to={`/product/${product.id}`}
              aria-label={`View details for ${product.brand} ${product.name}`}
            >
              <div className="phone-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="phone-brand">{product.brand}</div>
              <div className="phone-name">{product.name}</div>
              <div className="phone-rating" aria-label={`Rating ${product.rating} out of 5`}>
                ★ {product.rating}
              </div>
              <div className="phone-price">{formatPrice(product.price)}</div>
              <div className="phone-old-price">{formatPrice(product.originalPrice)}</div>
              <span className="phone-button">View Details</span>
            </Link>
          </article>
        ))}
>>>>>>> 7b9301d (pages)
      </div>
    </section>
  )
}

export default PopularPhones
