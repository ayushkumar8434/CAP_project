import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './sellphone.css'

import { API_BASE_URL } from '../../config'

function SellPhone() {
  const navigate = useNavigate()
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    price: '',
    condition: '',
    storage: '',
    description: '',
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [photos, setPhotos] = useState([])
  const [validationErrors, setValidationErrors] = useState({})

  // Enum values from backend
  const brands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Vivo', 'Oppo', 'Nothing', 'Realme', 'Motorola']
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor']
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }

    if (!formData.brand) {
      errors.brand = 'Please select a brand'
    }

    if (!formData.model.trim()) {
      errors.model = 'Model is required'
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = 'Please enter a valid price'
    }

    if (!formData.condition) {
      errors.condition = 'Please select a condition'
    }

    if (!formData.storage) {
      errors.storage = 'Please select storage'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit form
  const handlePhotos = (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = ''
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    const bad = picked.find((f) => !allowed.includes(f.type) || f.size > 5 * 1024 * 1024)
    if (bad) {
      setError('Photos must be JPG, PNG or WEBP, up to 5MB each.')
      return
    }
    if (photos.length + picked.length > 4) {
      setError('You can add up to 4 photos.')
      return
    }
    setError('')
    setPhotos((prev) => [
      ...prev,
      ...picked.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ])
  }

  const removePhoto = (index) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validate form
    if (!validateForm()) {
      return
    }

    // Check authentication
    const token = localStorage.getItem('authToken')
    if (!token) {
      setError('You must be logged in to sell a phone. Please login first.')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      return
    }

    setLoading(true)

    try {
      let imageUrls = []
      if (photos.length > 0) {
        const body = new FormData()
        photos.forEach((p) => body.append('images', p.file))
        const uploadRes = await fetch(`${API_BASE_URL}/uploads`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body,
        })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok || !uploadData.success) {
          setError(uploadData.message || 'Photo upload failed. Please try again.')
          setLoading(false)
          return
        }
        imageUrls = uploadData.urls
      }
      const response = await fetch(`${API_BASE_URL}/phones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          brand: formData.brand,
          model: formData.model.trim(),
          price: parseFloat(formData.price),
          condition: formData.condition,
          storage: formData.storage,
          description: formData.description.trim() || undefined,
          images: imageUrls,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
        photos.forEach((p) => URL.revokeObjectURL(p.preview))
        setPhotos([])
        // Reset form
        setFormData({
          title: '',
          brand: '',
          model: '',
          price: '',
          condition: '',
          storage: '',
          description: '',
        })
        
        // Redirect to phone listing page after 2 seconds
        setTimeout(() => {
          navigate('/my-listings')
        }, 2000)
      } else if (response.status === 401) {
        setError('Your session has expired. Please login again.')
        localStorage.removeItem('authToken')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(data.message || 'Failed to create listing. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="sell-page">
      <div className="sell-page-inner">
        <Link className="sell-back-link" to="/">Home <span>/</span> Sell your phone</Link>

        <header className="sell-page-header">
          <div>
            <p className="sell-eyebrow">SELL YOUR PHONE</p>
            <h1 className="sell-page-title">List Your Phone for Sale</h1>
            <p className="sell-page-description">
              Fill in the details below to create your phone listing. Be accurate to attract buyers.
            </p>
          </div>
        </header>

        {/* Success Message */}
        {success && (
          <div className="sell-message sell-message-success" role="alert">
            <span className="sell-message-icon">✓</span>
            <div>
              <h3>Listing Created Successfully!</h3>
              <p>Your phone is now listed on PocketPhone. Redirecting to browse page...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="sell-message sell-message-error" role="alert">
            <span className="sell-message-icon">⚠</span>
            <div>
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="sell-form" onSubmit={handleSubmit}>
          <div className="sell-form-section">
            <h2 className="sell-form-section-title">Phone Details</h2>

            {/* Title */}
            <div className="sell-form-field">
              <label htmlFor="title" className="sell-form-label">
                Listing Title <span className="sell-form-required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`sell-form-input ${validationErrors.title ? 'error' : ''}`}
                placeholder="e.g., iPhone 15 Pro Max - Excellent Condition"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.title && (
                <span className="sell-form-error">{validationErrors.title}</span>
              )}
            </div>

            {/* Brand */}
            <div className="sell-form-field">
              <label htmlFor="brand" className="sell-form-label">
                Brand <span className="sell-form-required">*</span>
              </label>
              <select
                id="brand"
                name="brand"
                className={`sell-form-input ${validationErrors.brand ? 'error' : ''}`}
                value={formData.brand}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {validationErrors.brand && (
                <span className="sell-form-error">{validationErrors.brand}</span>
              )}
            </div>

            {/* Model */}
            <div className="sell-form-field">
              <label htmlFor="model" className="sell-form-label">
                Model <span className="sell-form-required">*</span>
              </label>
              <input
                id="model"
                name="model"
                type="text"
                className={`sell-form-input ${validationErrors.model ? 'error' : ''}`}
                placeholder="e.g., iPhone 15 Pro Max"
                value={formData.model}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.model && (
                <span className="sell-form-error">{validationErrors.model}</span>
              )}
            </div>

            {/* Price */}
            <div className="sell-form-field">
              <label htmlFor="price" className="sell-form-label">
                Price (₹) <span className="sell-form-required">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="100"
                className={`sell-form-input ${validationErrors.price ? 'error' : ''}`}
                placeholder="e.g., 75000"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
              />
              {validationErrors.price && (
                <span className="sell-form-error">{validationErrors.price}</span>
              )}
            </div>

            {/* Condition */}
            <div className="sell-form-field">
              <label htmlFor="condition" className="sell-form-label">
                Condition <span className="sell-form-required">*</span>
              </label>
              <select
                id="condition"
                name="condition"
                className={`sell-form-input ${validationErrors.condition ? 'error' : ''}`}
                value={formData.condition}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select condition</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
              {validationErrors.condition && (
                <span className="sell-form-error">{validationErrors.condition}</span>
              )}
              <p className="sell-form-hint">
                Excellent: Like new | Good: Minor wear | Fair: Visible wear | Poor: Heavy wear
              </p>
            </div>

            {/* Storage */}
            <div className="sell-form-field">
              <label htmlFor="storage" className="sell-form-label">
                Storage <span className="sell-form-required">*</span>
              </label>
              <select
                id="storage"
                name="storage"
                className={`sell-form-input ${validationErrors.storage ? 'error' : ''}`}
                value={formData.storage}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select storage</option>
                {storageOptions.map((storage) => (
                  <option key={storage} value={storage}>
                    {storage}
                  </option>
                ))}
              </select>
              {validationErrors.storage && (
                <span className="sell-form-error">{validationErrors.storage}</span>
              )}
            </div>

            {/* Photos */}
            <div className="sell-form-field">
              <label htmlFor="photos" className="sell-form-label">
                Photos (Optional, up to 4)
              </label>
              <input
                id="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sell-form-input"
                onChange={handlePhotos}
                disabled={loading || photos.length >= 4}
              />
              {photos.length > 0 && (
                <div className="sell-photo-grid">
                  {photos.map((p, i) => (
                    <div key={p.preview} className="sell-photo">
                      <img src={p.preview} alt={`Selected photo ${i + 1}`} />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        disabled={loading}
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="sell-form-hint">JPG, PNG or WEBP, up to 5MB each. The first photo is the cover.</p>
            </div>
            {/* Description */}
            <div className="sell-form-field">
              <label htmlFor="description" className="sell-form-label">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                className="sell-form-input sell-form-textarea"
                placeholder="Provide additional details about your phone..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="sell-form-hint">
                Include any relevant information like accessories, warranty, or reason for selling.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="sell-form-footer">
            <button
              type="submit"
              className="sell-submit-button np-button np-button--primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="sell-spinner" />
                  Creating Listing...
                </>
              ) : (
                'Create Listing'
              )}
            </button>
            <p className="sell-form-note">
              By submitting, you agree to list your phone on PocketPhone marketplace.
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SellPhone