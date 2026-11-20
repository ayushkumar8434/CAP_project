import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './PhoneDetails.css'

const API_BASE_URL = 'http://localhost:5001/api'

function PhoneDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [phone, setPhone] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedToCart, setAddedToCart] = useState(false)

  // Check if already in cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setAddedToCart(cart.some((item) => item._id === id))
  }, [id])

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Check if already in cart
    if (cart.some((item) => item._id === phone._id)) {
      setAddedToCart(true)
      return
    }

    // Add phone to cart
    cart.push(phone)
    localStorage.setItem('cart', JSON.stringify(cart))
    setAddedToCart(true)

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

  const phoneImage =
    phone.images && phone.images.length > 0
      ? phone.images[0]
      : `https://placehold.co/600x750/dcfce7/16a34a?text=${encodeURIComponent(phone.brand)}`

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
              />
            </div>
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
