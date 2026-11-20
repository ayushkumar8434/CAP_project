import './PhoneCard.css'
import { Link } from 'react-router-dom'
import { firstImage, PLACEHOLDER_IMAGE } from '../utils/images'

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

  const phoneImage = firstImage(phone)

  return (
    <article className="phone-card">
      <div className="phone-card-image-wrapper">
        <img
          src={phoneImage}
          alt={phone.title}
          className="phone-card-image"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
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
