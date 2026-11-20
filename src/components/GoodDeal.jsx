import { useState } from 'react'
import './GoodDeal.css'

const phonesByBrand = {
  Apple: [
    { name: 'iPhone 15', excellentRange: [42000, 48000] },
    { name: 'iPhone 15 Pro', excellentRange: [65000, 74000] },
    { name: 'iPhone 13', excellentRange: [25000, 32000] },
  ],
  OnePlus: [
    { name: 'OnePlus 13', excellentRange: [43000, 50000] },
    { name: 'OnePlus 12', excellentRange: [35000, 42000] },
    { name: 'OnePlus 12R', excellentRange: [24000, 30000] },
  ],
  Google: [
    { name: 'Pixel 9', excellentRange: [38000, 45000] },
    { name: 'Google Pixel 8 Pro', excellentRange: [35000, 42000] },
  ],
  Samsung: [
    { name: 'Galaxy S24', excellentRange: [44000, 52000] },
    { name: 'Samsung Galaxy S23', excellentRange: [30000, 37000] },
    { name: 'Samsung Galaxy S23 Ultra', excellentRange: [42000, 50000] },
  ],
}

const conditionFactors = {
  Excellent: [1, 1],
  Good: [0.88, 0.92],
  Fair: [0.74, 0.82],
}

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function getReferenceRange(phone, condition) {
  const [lowFactor, highFactor] = conditionFactors[condition]
  const [low, high] = phone.excellentRange

  return {
    low: Math.round((low * lowFactor) / 1000) * 1000,
    high: Math.round((high * highFactor) / 1000) * 1000,
  }
}

function getDealResult(askingPrice, range) {
  if (askingPrice < range.low) {
    return {
      label: 'GOOD DEAL',
      kind: 'good',
      explanation:
        'This asking price is below the illustrative range. Check the phone, seller, and listing details carefully before deciding.',
    }
  }

  if (askingPrice <= range.high) {
    return {
      label: 'FAIR PRICE',
      kind: 'fair',
      explanation:
        'This asking price falls within the illustrative range for the selected condition.',
    }
  }

  return {
    label: 'OVERPRICED',
    kind: 'high',
    explanation:
      'This asking price is above the illustrative range for the selected condition.',
  }
}

function GoodDeal() {
  const [brand, setBrand] = useState('')
  const [modelName, setModelName] = useState('')
  const [condition, setCondition] = useState('')
  const [askingPrice, setAskingPrice] = useState('')
  const [result, setResult] = useState(null)

  const availablePhones = brand ? phonesByBrand[brand] : []

  function handleBrandChange(event) {
    setBrand(event.target.value)
    setModelName('')
    setResult(null)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const phone = availablePhones.find(({ name }) => name === modelName)
    const price = Number(askingPrice)
    if (!phone || !condition || !Number.isFinite(price) || price <= 0) {
      return
    }

    const range = getReferenceRange(phone, condition)
    setResult({
      ...getDealResult(price, range),
      range,
      phoneName: phone.name,
      condition,
    })
  }

  return (
    <section
      className="good-deal-section"
      id="good-deal"
      aria-labelledby="good-deal-heading"
    >
      <div className="good-deal-inner">
        <div className="good-deal-heading">
          <div>
            <p className="good-deal-eyebrow">A LITTLE PRICE CHECK</p>
            <h2 className="good-deal-title" id="good-deal-heading">
              Is this a
              <br />
              <span>good deal?</span>
            </h2>
          </div>
          <p className="good-deal-intro">
            Compare against an illustrative range, not a live PocketPhone
            valuation.
          </p>
        </div>

        <div className="good-deal-card">
          <form className="good-deal-form" onSubmit={handleSubmit}>
            <div className="good-deal-fields">
              <label className="good-deal-field">
                <span className="good-deal-field-label">01 / BRAND</span>
                <select
                  required
                  value={brand}
                  onChange={handleBrandChange}
                  aria-label="Brand"
                >
                  <option value="">Choose a brand</option>
                  {Object.keys(phonesByBrand).map((brandName) => (
                    <option key={brandName} value={brandName}>
                      {brandName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="good-deal-field">
                <span className="good-deal-field-label">02 / MODEL</span>
                <select
                  required
                  value={modelName}
                  onChange={(event) => {
                    setModelName(event.target.value)
                    setResult(null)
                  }}
                  disabled={!brand}
                  aria-label="Phone model"
                >
                  <option value="">Choose a model</option>
                  {availablePhones.map(({ name }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="good-deal-field">
                <span className="good-deal-field-label">03 / CONDITION</span>
                <select
                  required
                  value={condition}
                  onChange={(event) => {
                    setCondition(event.target.value)
                    setResult(null)
                  }}
                  aria-label="Phone condition"
                >
                  <option value="">Choose condition</option>
                  {Object.keys(conditionFactors).map((conditionName) => (
                    <option key={conditionName} value={conditionName}>
                      {conditionName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="good-deal-field">
                <span className="good-deal-field-label">04 / ASKING PRICE</span>
                <span className="good-deal-price-input">
                  <span aria-hidden="true">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    inputMode="numeric"
                    placeholder="Enter amount"
                    value={askingPrice}
                    onChange={(event) => {
                      setAskingPrice(event.target.value)
                      setResult(null)
                    }}
                    aria-label="Asking price in Indian rupees"
                  />
                </span>
              </label>
            </div>

            <div className="good-deal-form-footer">
              <p>Four details. One clearer call.</p>
              <button
                className="good-deal-submit np-button np-button--primary"
                type="submit"
              >
                Check Deal <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>

          <div
            className={`good-deal-result${result ? ` is-${result.kind}` : ''}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {result ? (
              <>
                <p className="good-deal-result-kicker">
                  {result.phoneName} <span>/</span> {result.condition}
                </p>
                <p className="good-deal-result-label">{result.label}</p>
                <p className="good-deal-range-label">ILLUSTRATIVE REFERENCE RANGE</p>
                <p className="good-deal-range">
                  {currency.format(result.range.low)}
                  <span aria-hidden="true"> — </span>
                  {currency.format(result.range.high)}
                </p>
                <p className="good-deal-explanation">{result.explanation}</p>
              </>
            ) : (
              <div className="good-deal-empty">
                <span className="good-deal-spark" aria-hidden="true">✳</span>
                <p className="good-deal-empty-title">Your price check starts here.</p>
                <p className="good-deal-empty-copy">
                  Pick a phone and condition to see how its asking price compares.
                </p>
              </div>
            )}
          </div>

          <p className="good-deal-disclaimer">
            Demo estimates only — these illustrative ranges are not live market
            data, appraisals, or guaranteed valuations. Actual prices vary with
            storage, age, accessories, and device condition.
          </p>
        </div>
      </div>
    </section>
  )
}

export default GoodDeal
