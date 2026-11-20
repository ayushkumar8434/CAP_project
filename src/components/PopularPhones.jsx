import { Link } from 'react-router-dom'
import { useLivePhones } from '../hooks/useLivePhones'
import PhoneCard from './PhoneCard'
import './PopularPhones.css'

function PopularPhones() {
  const { phones, loading, error } = useLivePhones('limit=8&sort=newest')

  return (
    <section
      className="popular-section"
      id="popular-phones"
      aria-labelledby="popular-heading"
    >
      <div className="popular-header">
        <p className="popular-label">POCKETPHONE INVENTORY</p>
        <h2 className="popular-title" id="popular-heading">
          Popular Phones
        </h2>
        <p className="popular-description">
          Latest phones listed on PocketPhone, ready to buy.
        </p>
      </div>

      {loading && <p className="popular-status">Loading phones...</p>}

      {!loading && (error || phones.length === 0) && (
        <div className="popular-availability" role="status">
          <span className="availability-mark" aria-hidden="true"><span /></span>
          <div>
            <h3>{error ? 'Could not load phones' : 'No phones available right now'}</h3>
            <p>
              {error
                ? 'Please check that the server is running and try again.'
                : 'Check back soon as new phones are listed.'}
            </p>
          </div>
        </div>
      )}

      {!loading && phones.length > 0 && (
        <>
          <div className="popular-grid">
            {phones.map((phone) => (
              <PhoneCard key={phone._id} phone={phone} />
            ))}
          </div>
          <div className="popular-more">
            <Link to="/phones" className="np-button np-button--primary">
              View all phones
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

export default PopularPhones
