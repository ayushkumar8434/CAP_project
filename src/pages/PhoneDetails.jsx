import { useEffect, useMemo, useState } from 'react'
import { imageUrl, PLACEHOLDER_IMAGE } from '../utils/images'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './PhoneDetails.css'

import { API_BASE_URL } from '../config'

function PhoneDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [phone, setPhone] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartVersion, setCartVersion] = useState(0)
  const [activeImage, setActiveImage] = useState(0)
  const addedToCart = useMemo(
    () => JSON.parse(localStorage.getItem('cart') || '[]').some((item) => item._id === id),
    // cartVersion changes whenever this page adds to the cart
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, cartVersion],
  )
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isOwner = Boolean(
    currentUser._id && phone?.seller?._id && currentUser._id === phone.seller._id,
  )


  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Check if already in cart
    if (cart.some((item) => item._id === phone._id)) {
      setCartVersion((v) => v + 1)
      return
    }

    // Add phone to cart
    cart.push(phone)
    localStorage.setItem('cart', JSON.stringify(cart))
    setCartVersion((v) => v + 1)

    // Show feedback
    setTimeout(() => {
      const goToCart = window.confirm('Added to cart! Go to cart now?')
      if (goToCart) {
        navigate('/cart')
      }
    }, 300)
  }

  const buyNow = () => {
    // Add to cart and go directly to checkout
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    if (!cart.some((item) => item._id === phone._id)) {
      cart.push(phone)
      localStorage.setItem('cart', JSON.stringify(cart))
    }
    
    navigate('/checkout')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getConditionClass = (condition) => {
    const conditionMap = {
      Excellent: 'excellent',
      Good: 'good',
      Fair: 'fair',
      Poor: 'poor',
    }
    return conditionMap[condition] || 'good'
  }

  useEffect(() => {
    const fetchPhoneDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        // Backend doesn't have GET /api/phones/:id yet
        // Using search as workaround: fetch all and filter by ID
        const response = await fetch(`${API_BASE_URL}/phones?limit=50`)

        if (!response.ok) {
          throw new Error('Failed to fetch phone details')
        }

        const data = await response.json()

        if (data.success) {
          const foundPhone = data.phones.find((p) => p._id === id)
          if (foundPhone) {
            setPhone(foundPhone)
          } else {
            throw new Error('Phone not found')
          }
        } else {
          throw new Error(data.message || 'Failed to fetch phone details')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPhoneDetails()
  }, [id])

  if (loading) {
    return (
      <main className="phone-details-page">
        <div className="phone-details-container">
          <div className="phone-details-state">
            <div className="loading-spinner" aria-label="Loading phone details">
              <span />
            </div>
            <p>Loading phone details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="phone-details-page">
        <div className="phone-details-container">
          <div className="phone-details-state">
            <div className="error-icon" aria-hidden="true">
              ⚠️
            </div>
            <h2>Phone not found</h2>
            <p>{error}</p>
            <Link to="/phones" className="np-button np-button--primary">
              Back to Browse
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!phone) {
    return null
  }

  const phoneImage = imageUrl(phone.images?.[activeImage] ?? phone.images?.[0])

  return (
    <main className="phone-details-page">
      <div className="phone-details-container">
        <Link to="/phones" className="back-link">
          ← Back to Browse
        </Link>

        <div className="phone-details-layout">
          {/* Image Section */}
          <div className="phone-details-image-section">
            <div className="phone-details-image-wrapper">
              <img
                src={phoneImage}
                alt={phone.title}
                className="phone-details-image"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
              />
            </div>
            {phone.images?.length > 1 && (
              <div className="phone-details-thumbs">
                {phone.images.map((img, i) => (
                  <button
                    type="button"
                    key={img}
                    className={`phone-details-thumb${i === activeImage ? ' is-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show photo ${i + 1}`}
                  >
                    <img src={imageUrl(img)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="phone-details-info">
            <div className="phone-details-header">
              <p className="phone-details-brand">{phone.brand}</p>
              <span
                className={`phone-details-condition ${getConditionClass(phone.condition)}`}
              >
                {phone.condition}
              </span>
            </div>

            <h1 className="phone-details-title">{phone.title}</h1>

            <p className="phone-details-price">{formatPrice(phone.price)}</p>

            <div className="phone-details-specs">
              <div className="spec-item">
                <span className="spec-label">Storage</span>
                <span className="spec-value">{phone.storage}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Condition</span>
                <span className="spec-value">{phone.condition}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Status</span>
                <span className="spec-value">
                  {phone.status === 'available' ? '✓ Available' : 'Sold'}
                </span>
              </div>
            </div>

            {phone.description && (
              <div className="phone-details-description">
                <h2>Description</h2>
                <p>{phone.description}</p>
              </div>
            )}

            {phone.seller && (
              <div className="phone-details-seller">
                <h2>Seller Information</h2>
                <p className="seller-name">{phone.seller.name}</p>
                <p className="seller-email">{phone.seller.email}</p>
              </div>
            )}

            {isOwner ? (
              <div className="phone-details-owner">
                <p>This is your listing, so buying is disabled.</p>
                <Link to="/my-listings" className="np-button np-button--primary">
                  Manage in My Listings
                </Link>
              </div>
            ) : (
              <div className="phone-details-actions">
                <button
                  type="button"
                  className="np-button np-button--primary"
                  onClick={buyNow}
                  disabled={phone.status !== 'available'}
                >
                  {phone.status === 'available' ? 'Buy Now' : 'Sold Out'}
                </button>
                <button
                  type="button"
                  className="np-button np-button--secondary"
                  onClick={addToCart}
                  disabled={phone.status !== 'available' || addedToCart}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}
            <div className="phone-details-extra-actions">
              <Link
                to="/phones"
                className="continue-browsing-link"
              >
                ← Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PhoneDetails
