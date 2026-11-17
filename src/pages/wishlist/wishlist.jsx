import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, products, readWishlist, saveWishlist } from '../../data/products'
import './Wishlist.css'

function Wishlist() {
  const [savedIds, setSavedIds] = useState(readWishlist)
  const savedProducts = savedIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean)

  function removeFromWishlist(productId) {
    const nextWishlist = savedIds.filter((id) => id !== productId)
    saveWishlist(nextWishlist)
    setSavedIds(nextWishlist)
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-page-inner">
        <header className="wishlist-header">
          <p className="wishlist-eyebrow">SAVED FOR LATER</p>
          <h1>Your wishlist</h1>
          <p>Your saved phones are stored in this browser.</p>
        </header>

        {savedProducts.length === 0 ? (
          <section className="wishlist-empty">
            <span aria-hidden="true">♡</span>
            <h2>Your wishlist is empty</h2>
            <p>Save a phone from its card or details page to find it here.</p>
            <Link to="/">Browse phones</Link>
          </section>
        ) : (
          <div className="wishlist-grid">
            {savedProducts.map((product) => (
              <article className="wishlist-card" key={product.id}>
                <Link
                  className="wishlist-card-link"
                  to={`/product/${product.id}`}
                  aria-label={`View details for ${product.brand} ${product.name}`}
                >
                  <div className="wishlist-card-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <p className="wishlist-card-brand">{product.brand}</p>
                  <h2>{product.name}</h2>
                  <p className="wishlist-card-price">{formatPrice(product.price)}</p>
                </Link>
                <div className="wishlist-card-actions">
                  <Link to={`/product/${product.id}`}>View details</Link>
                  <button type="button" onClick={() => removeFromWishlist(product.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Wishlist