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
          We'll show current NewPhone stock here when it's available.
        </p>
      </div>

      <div className="popular-availability" role="status">
        <span className="availability-mark" aria-hidden="true">
          <span />
        </span>
        <div>
          <h3>No phones available right now</h3>
          <p>
            We don't have live inventory to display. Check back as phones are
            inspected and approved for sale.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PopularPhones
