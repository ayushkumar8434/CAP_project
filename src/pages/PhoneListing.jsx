import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PhoneCard from '../components/PhoneCard'
import './PhoneListing.css'

const API_BASE_URL = 'http://localhost:5001/api'

function PhoneListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    totalPhones: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 12,
  })

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || '')
  const [selectedStorage, setSelectedStorage] = useState(searchParams.get('storage') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

  const brands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Vivo', 'Oppo', 'Nothing', 'Realme', 'Motorola']
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor']
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']

  // Fetch phones from API
  const fetchPhones = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      // Get current page from URL or default to 1
      const page = searchParams.get('page') || '1'
      params.append('page', page)
      params.append('limit', '12')

      // Add filters only if they have values
      if (searchQuery.trim()) params.append('q', searchQuery.trim())
      if (selectedBrand) params.append('brand', selectedBrand)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (selectedCondition) params.append('condition', selectedCondition)
      if (selectedStorage) params.append('storage', selectedStorage)
      if (sortBy) params.append('sort', sortBy)

      const endpoint = searchQuery.trim() ? '/phones/search' : '/phones'
      const response = await fetch(`${API_BASE_URL}${endpoint}?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch phones')
      }

      const data = await response.json()

      if (data.success) {
        setPhones(data.phones)
        setPagination({
          totalPhones: data.totalPhones,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          limit: data.limit,
        })
      } else {
        throw new Error(data.message || 'Failed to fetch phones')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [searchParams, searchQuery, selectedBrand, minPrice, maxPrice, selectedCondition, selectedStorage, sortBy])

  // Fetch phones when URL params change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount/param change
    fetchPhones()
  }, [fetchPhones])

  // Apply filters
  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    // Reset to page 1 when filters change
    params.set('page', '1')

    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (selectedBrand) params.set('brand', selectedBrand)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (selectedCondition) params.set('condition', selectedCondition)
    if (selectedStorage) params.set('storage', selectedStorage)
    if (sortBy) params.set('sort', sortBy)

    setSearchParams(params)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedBrand('')
    setMinPrice('')
    setMaxPrice('')
    setSelectedCondition('')
    setSelectedStorage('')
    setSortBy('newest')
    setSearchParams({})
  }

  // Handle search on Enter key
  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleApplyFilters()
    }
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="phone-listing-page">
      <div className="phone-listing-container">
        {/* Page Header */}
        <header className="phone-listing-header">
          <p className="phone-listing-eyebrow">POCKETPHONE MARKETPLACE</p>
          <h1 className="phone-listing-title">Explore Phones</h1>
          <p className="phone-listing-description">
            Discover quality pre-owned phones at great prices. Each device is
            verified and ready for a new life.
          </p>
        </header>

        <div className="phone-listing-layout">
          {/* Filters Sidebar */}
          <aside className="phone-listing-filters">
            <div className="filters-header">
              <h2>Filters</h2>
              <button
                type="button"
                className="filters-clear-button"
                onClick={handleClearFilters}
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="filter-group">
              <label htmlFor="search-input" className="filter-label">
                Search
              </label>
              <input
                id="search-input"
                type="text"
                placeholder="Search by name, brand, model..."
                className="filter-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <label htmlFor="brand-select" className="filter-label">
                Brand
              </label>
              <select
                id="brand-select"
                className="filter-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div className="filter-price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  className="filter-price-input"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="filter-price-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Condition Filter */}
            <div className="filter-group">
              <label htmlFor="condition-select" className="filter-label">
                Condition
              </label>
              <select
                id="condition-select"
                className="filter-select"
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
              >
                <option value="">All Conditions</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Storage Filter */}
            <div className="filter-group">
              <label htmlFor="storage-select" className="filter-label">
                Storage
              </label>
              <select
                id="storage-select"
                className="filter-select"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
              >
                <option value="">All Storage</option>
                {storageOptions.map((storage) => (
                  <option key={storage} value={storage}>
                    {storage}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="filter-group">
              <label htmlFor="sort-select" className="filter-label">
                Sort By
              </label>
              <select
                id="sort-select"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <button
              type="button"
              className="filters-apply-button np-button np-button--primary"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </aside>

          {/* Main Content */}
          <div className="phone-listing-content">
            {/* Results Header */}
            {!loading && !error && (
              <div className="results-header">
                <p className="results-count">
                  {pagination.totalPhones > 0
                    ? `Showing ${(pagination.currentPage - 1) * pagination.limit + 1}–${Math.min(
                        pagination.currentPage * pagination.limit,
                        pagination.totalPhones
                      )} of ${pagination.totalPhones} phone${pagination.totalPhones !== 1 ? 's' : ''}`
                    : 'No phones found'}
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="phone-listing-state">
                <div className="loading-spinner" aria-label="Loading phones">
                  <span />
                </div>
                <p>Loading phones...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="phone-listing-state">
                <div className="error-icon" aria-hidden="true">
                  ⚠️
                </div>
                <h3>Something went wrong</h3>
                <p>{error}</p>
                <button
                  type="button"
                  className="retry-button np-button np-button--primary"
                  onClick={fetchPhones}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && phones.length === 0 && (
              <div className="phone-listing-state">
                <div className="empty-icon" aria-hidden="true">
                  📱
                </div>
                <h3>No phones found</h3>
                <p>
                  Try adjusting your filters or search query to find what you're
                  looking for.
                </p>
                <button
                  type="button"
                  className="clear-button np-button np-button--secondary"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Phone Grid */}
            {!loading && !error && phones.length > 0 && (
              <>
                <div className="phone-grid">
                  {phones.map((phone) => (
                    <PhoneCard key={phone._id} phone={phone} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      type="button"
                      className="pagination-button"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      aria-label="Previous page"
                    >
                      ← Previous
                    </button>

                    <div className="pagination-pages">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (pageNum) => {
                          // Show first, last, current, and adjacent pages
                          const showPage =
                            pageNum === 1 ||
                            pageNum === pagination.totalPages ||
                            Math.abs(pageNum - pagination.currentPage) <= 1

                          if (!showPage) {
                            // Show ellipsis for gaps
                            if (
                              pageNum === pagination.currentPage - 2 ||
                              pageNum === pagination.currentPage + 2
                            ) {
                              return (
                                <span key={pageNum} className="pagination-ellipsis">
                                  ...
                                </span>
                              )
                            }
                            return null
                          }

                          return (
                            <button
                              key={pageNum}
                              type="button"
                              className={`pagination-page${
                                pageNum === pagination.currentPage ? ' active' : ''
                              }`}
                              onClick={() => handlePageChange(pageNum)}
                              aria-label={`Page ${pageNum}`}
                              aria-current={
                                pageNum === pagination.currentPage ? 'page' : undefined
                              }
                            >
                              {pageNum}
                            </button>
                          )
                        }
                      )}
                    </div>

                    <button
                      type="button"
                      className="pagination-button"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      aria-label="Next page"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default PhoneListing
