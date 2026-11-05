import { useState } from 'react'
import './ShopByNeed.css'

const categories = [
  {
    id: 'camera',
    number: '01',
    name: 'Camera Lovers',
    shortName: 'Camera',
    description: 'Photography & video',
    recommendationHeading: 'Made for the camera obsessed.',
  },
  {
    id: 'gaming',
    number: '02',
    name: 'Gaming',
    shortName: 'Gaming',
    description: 'Play without limits',
    recommendationHeading: 'Ready for your next gaming session.',
  },
  {
    id: 'battery',
    number: '03',
    name: 'All-Day Battery',
    shortName: 'Battery',
    description: 'Go further, charge less',
    recommendationHeading: 'Power that keeps up with you.',
  },
  {
    id: 'performance',
    number: '04',
    name: 'Performance',
    shortName: 'Performance',
    description: 'Speed through your day',
    recommendationHeading: 'Built for the power users.',
  },
  {
    id: 'content',
    number: '05',
    name: 'Content Creation',
    shortName: 'Create',
    description: 'Make it. Edit it. Share it.',
    recommendationHeading: 'Your content deserves better.',
  },
  {
    id: 'everyday',
    number: '06',
    name: 'Everyday Use',
    shortName: 'Everyday',
    description: 'Made for your daily rhythm',
    recommendationHeading: 'Everyday phones, everyday wins.',
  },
]

const recommendationsByCategory = {
  camera: [
    {
      name: 'Google Pixel 8 Pro',
      reason: 'A camera-focused pick for photos, portraits, and video.',
    },
    {
      name: 'iPhone 15 Pro',
      reason: 'A versatile choice for capturing and sharing video.',
    },
    {
      name: 'Samsung Galaxy S23 Ultra',
      reason: 'A flexible camera setup for a range of shots.',
    },
  ],
  gaming: [
    {
      name: 'iQOO Neo 9 Pro',
      reason: 'A performance-oriented option to explore for gaming.',
    },
    {
      name: 'OnePlus 12R',
      reason: 'A powerful all-rounder to consider for mobile play.',
    },
    {
      name: 'POCO F6',
      reason: 'A gaming-minded pick for fast-paced sessions.',
    },
  ],
  battery: [
    {
      name: 'OnePlus 12R',
      reason: 'A good starting point when battery life is a priority.',
    },
    {
      name: 'iQOO Neo 9 Pro',
      reason: 'A performance pick to explore for long days of use.',
    },
    {
      name: 'OnePlus 15R',
      reason: 'Another OnePlus option to compare for everyday endurance.',
    },
  ],
  performance: [
    {
      name: 'Samsung Galaxy S23 Ultra',
      reason: 'A flagship-style option for demanding everyday tasks.',
    },
    {
      name: 'OnePlus 12',
      reason: 'A speed-focused pick for switching between apps.',
    },
    {
      name: 'iQOO Neo 9 Pro',
      reason: 'A performance-oriented option for responsive use.',
    },
  ],
  content: [
    {
      name: 'iPhone 15 Pro',
      reason: 'A creator-friendly choice for capturing and editing video.',
    },
    {
      name: 'Google Pixel 8 Pro',
      reason: 'A camera-focused option for creating on the go.',
    },
    {
      name: 'Samsung Galaxy S23 Ultra',
      reason: 'A versatile pick for recording and working with content.',
    },
  ],
  everyday: [
    {
      name: 'Nothing Phone 2a',
      reason: 'A distinctive option to consider for everyday essentials.',
    },
    {
      name: 'iPhone 13',
      reason: 'An approachable Apple pick for familiar daily use.',
    },
    {
      name: 'Samsung Galaxy S23',
      reason: 'A versatile choice to explore for daily routines.',
    },
  ],
}

function RecommendationVisual({ index }) {
  return (
    <div className="need-product-visual" aria-hidden="true">
      <span className="need-product-index">
        {String(index).padStart(2, '0')}
      </span>
      <span className="need-phone-placeholder">
        <span className="need-phone-speaker" />
        <span className="need-phone-screen">
          <span className="need-phone-screen-mark" />
        </span>
        <span className="need-phone-home-mark" />
      </span>
    </div>
  )
}

function ShopByNeed() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const selected = categories.find(
    (category) => category.id === selectedCategory,
  )
  const recommendations = selectedCategory
    ? recommendationsByCategory[selectedCategory] ?? []
    : []

  return (
    <section className="need-section" aria-labelledby="need-heading">
      <div className="need-inner">
        <div className="need-heading">
          <div>
            <p className="need-eyebrow">
              FIND YOUR PERFECT MATCH <span aria-hidden="true">✳</span>
            </p>
            <h2 className="need-title" id="need-heading">
              Your next phone
              <br />
              has a type.
            </h2>
          </div>
          <p className="need-intro">
            Camera obsessed? Gaming all night? Creating content? There’s a phone
            for your vibe.
          </p>
        </div>

        <div className="need-category-wrap">
          <span className="need-category-prompt">I'M HERE FOR</span>
          <div className="need-categories" aria-label="Choose a phone category">
            {categories.map(({ id, number, name, description }) => (
              <button
                className={`need-category${selectedCategory === id ? ' is-selected' : ''}`}
                type="button"
                key={id}
                aria-pressed={selectedCategory === id}
                onClick={() => setSelectedCategory(id)}
              >
                <span className="need-category-number" aria-hidden="true">
                  {number}
                </span>
                <span className="need-category-name">{name}</span>
                <span className="need-category-description">{description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="need-results" aria-live="polite">
          {selected ? (
            <>
              <div className="need-results-heading">
                <div className="need-results-title-group">
                  <p className="need-results-eyebrow">YOUR MATCH, IN THREE</p>
                  <h3 className="need-results-title">
                    {selected.recommendationHeading}
                  </h3>
                </div>
                <span className="need-sample-label">
                  SAMPLE PICKS <span aria-hidden="true">↘</span>
                </span>
              </div>

              {recommendations.length > 0 ? (
                <div className="need-products">
                  {recommendations.map((recommendation, index) => (
                    <article
                      className="need-product"
                      key={recommendation.name}
                    >
                      <RecommendationVisual index={index + 1} />
                      <div className="need-product-info">
                        <span className="need-product-kicker">
                          {selected.shortName} PICK{' '}
                          <span aria-hidden="true">/</span> 0{index + 1}
                        </span>
                        <h4 className="need-product-name">
                          {recommendation.name}
                        </h4>
                        <p className="need-product-reason">
                          {recommendation.reason}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="need-empty">
                  <span className="need-empty-mark" aria-hidden="true">
                    ＋
                  </span>
                  <h4>No recommendations yet</h4>
                  <p>
                    We don’t have sample suggestions for this category just
                    yet. Check back as phone recommendations are added.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="need-empty-prompt">
              <span className="need-empty-prompt-index">01 — 06</span>
              <h3>What’s your phone personality?</h3>
              <p>
                Pick a category up top. We’ll show you three phones to explore.
              </p>
              <span className="need-empty-prompt-arrow" aria-hidden="true">
                ↓
              </span>
            </div>
          )}
        </div>

        <p className="need-disclaimer">
          Curated recommendations to help you find your match. Actual listings
          and availability may vary.
        </p>
      </div>
    </section>
  )
}

export default ShopByNeed
