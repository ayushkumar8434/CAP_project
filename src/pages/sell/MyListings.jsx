import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firstImage, PLACEHOLDER_IMAGE } from '../../utils/images'
import './MyListings.css'

const API_BASE_URL = 'http://localhost:5001/api'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)

function MyListings() {
  const navigate = useNavigate()
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  })

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/phones/mine`, { headers: authHeaders() })
      if (res.status === 401) {
        navigate('/login')
        return
      }
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message)
      setPhones(data.data)
    } catch (err) {
      setError(err.message || 'Could not load your listings.')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    load()
  }, [load, navigate])

  const setStatus = async (id, status) => {
    setError('')
    const res = await fetch(`${API_BASE_URL}/phones/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    })
    if (res.ok) load()
    else setError('Could not update the listing.')
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    setError('')
    const res = await fetch(`${API_BASE_URL}/phones/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (res.ok) load()
    else setError('Could not delete the listing.')
  }

  const count = (status) => phones.filter((p) => p.status === status).length
  const stats = [
    { label: 'Total listings', value: phones.length },
    { label: 'Available', value: count('available') },
    { label: 'Sold', value: count('sold') },
  ]

  return (
    <main className="mylist-page">
      <div className="mylist-inner">
        <header className="mylist-head">
          <div>
            <p className="mylist-eyebrow">SELLER DASHBOARD</p>
            <h1>My Listings</h1>
            <p className="mylist-sub">Manage the phones you have put up for sale.</p>
          </div>
          <Link to="/sell" className="np-button np-button--primary">+ Sell another phone</Link>
        </header>

        {error && <div className="form-error" role="alert">{error}</div>}

        {!loading && phones.length > 0 && (
          <div className="mylist-stats">
            {stats.map((st) => (
              <div key={st.label} className="mylist-stat">
                <span className="mylist-stat-value">{st.value}</span>
                <span className="mylist-stat-label">{st.label}</span>
              </div>
            ))}
          </div>
        )}

        {loading && <p className="mylist-loading">Loading your listings...</p>}

        {!loading && phones.length === 0 && (
          <div className="mylist-empty">
            <div className="mylist-empty-icon" aria-hidden="true">📱</div>
            <h2>No listings yet</h2>
            <p>Put your old phone up for sale and reach buyers in minutes.</p>
            <Link to="/sell" className="np-button np-button--primary">Sell Your Phone</Link>
          </div>
        )}

        <div className="mylist-grid">
          {phones.map((p) => (
            <article key={p._id} className={`mylist-card${p.status === 'sold' ? ' is-sold' : ''}`}>
              <img className="mylist-thumb" src={firstImage(p)} alt="" onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }} />
              <div className="mylist-body">
                <div className="mylist-top">
                  <div>
                    <p className="mylist-brand">{p.brand}</p>
                    <Link to={`/phones/${p._id}`} className="mylist-title">{p.title}</Link>
                  </div>
                  <span className={`mylist-status mylist-status--${p.status}`}>{p.status}</span>
                </div>
                <div className="mylist-chips">
                  <span>{p.storage}</span>
                  <span>{p.condition}</span>
                  <span>Listed {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="mylist-bottom">
                  <p className="mylist-price">{formatPrice(p.price)}</p>
                  <div className="mylist-actions">
                    <Link to={`/phones/${p._id}`} className="mylist-btn">View</Link>
                    {p.status === 'available' ? (
                      <button type="button" className="mylist-btn mylist-btn--primary" onClick={() => setStatus(p._id, 'sold')}>
                        Mark as sold
                      </button>
                    ) : (
                      <button type="button" className="mylist-btn mylist-btn--primary" onClick={() => setStatus(p._id, 'available')}>
                        Mark available
                      </button>
                    )}
                    <button type="button" className="mylist-btn mylist-btn--danger" onClick={() => remove(p._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default MyListings
