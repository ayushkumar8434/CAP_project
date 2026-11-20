import { Link } from 'react-router-dom'
import { useLivePhones } from '../hooks/useLivePhones'
import PhoneCard from './PhoneCard'
import './TodaysDrops.css'

function TodaysDrops() {
  const { phones, loading, error } = useLivePhones('limit=4&sort=price_asc')

  return (
    <section className="drops-section" aria-labelledby="drops-heading">
      <div className="drops-header">
        <p className="drops-label">TODAY'S PHONE DROPS</p>
        <h2 className="drops-title" id="drops-heading">
          Fresh phones. Fresh prices.
        </h2>
        <p className="drops-subtitle">The lowest-priced phones available right now.</p>
      </div>

      {loading && <p className="drops-status">Loading offers...</p>}

      {!loading && (error || phones.length === 0) && (
        <div className="drops-availability" role="status">
          <span className="drops-availability-index" aria-hidden="true">01</span>
          <p>
            {error
              ? 'Could not load offers. Please try again shortly.'
              : 'No live listings are available right now. New phones will appear here.'}
          </p>
        </div>
      )}

      {!loading && phones.length > 0 && (
        <>
          <div className="drops-grid">
            {phones.map((phone) => (
              <div key={phone._id} className="drops-item">
                <span className="drops-badge">Best price</span>
                <PhoneCard phone={phone} />
              </div>
            ))}
          </div>
          <div className="drops-more">
            <Link to="/phones?sort=price_asc" className="np-button np-button--secondary">
              See more deals
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

export default TodaysDrops
