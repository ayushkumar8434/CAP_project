import './PhoneCard.css'
import { Link } from 'react-router-dom'

function PhoneCard({ phone }) {
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

  // Use placeholder if no image available
  const phoneImage = phone.images && phone.images.length > 0
    ? phone.images[0]
    : `https://placehold.co/400x500/dcfce7/16a34a?text=${encodeURIComponent(phone.brand)}`

  return (
    <article className="phone-card">
      <div className="phone-card-image-wrapper">
        <img
          src={phoneImage}
          alt={phone.title}
          className="phone-card-image"
          loading="lazy"
        />
        <span className={`phone-card-condition ${getConditionClass(phone.condition)}`}>
          {phone.condition}
        </span>
      </div>

      <div className="phone-card-content">
        <div className="phone-card-header">
          <p className="phone-card-brand">{phone.brand}</p>
          <p className="phone-card-storage">{phone.storage}</p>
        </div>

        <h3 className="phone-card-title">{phone.title}</h3>

        <p className="phone-card-price">{formatPrice(phone.price)}</p>

        <Link
          to={`/phones/${phone._id}`}
          className="phone-card-button np-button np-button--secondary"
        >
          View Details
        </Link>
      </div>
    </article>
  )
}

export default PhoneCard
