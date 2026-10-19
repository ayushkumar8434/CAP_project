import { useState } from 'react'
import { Link } from 'react-router-dom'

import SelectBrand from './selectbrand'
import './sellphone.css'

function SellPhone() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [step, setStep] = useState(1)

  return (
    <main className="sell-page">
      <div className="sell-page-inner">
        <Link className="sell-back-link" to="/">Home <span>/</span> Sell your phone</Link>

        <header className="sell-page-header">
          <div>
            <p className="sell-eyebrow">SELL YOUR PHONE</p>
            <h1 className="sell-page-title">Get a fair price for your phone.</h1>
            <p className="sell-page-description">
              Tell us about your device to get started. It only takes a few steps.
            </p>
          </div>
          <p className="sell-step-count">STEP {step} OF 6</p>
        </header>

        <div className="sell-progress" aria-label={`Step ${step} of 6`}>
          <span style={{ width: `${(step / 6) * 100}%` }} />
        </div>

      {step === 1 && (
        <SelectBrand
          selectedBrand={selectedBrand}
          onSelect={setSelectedBrand}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <section className="sell-next-step">
          <p className="sell-eyebrow">BRAND SELECTED</p>
          <h2>{selectedBrand}</h2>
          <p>Next, we will show the phone models available from this brand.</p>
          <button className="sell-back-button" type="button" onClick={() => setStep(1)}>
            Back to brands
          </button>
        </section>
      )}
      </div>
    </main>
  )
}

export default SellPhone