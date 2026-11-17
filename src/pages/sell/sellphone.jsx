import { useState } from 'react'
import { Link } from 'react-router-dom'

import SelectBrand from './selectbrand'
import SelectModel from './selectmodel'
import SelectCondition from './condition'
import BatteryHealth from './battery'
import PhonePhotos from './photos'
import SellResult from './sellresult'
import './sellphone.css'

function SellPhone() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [selectedBattery, setSelectedBattery] = useState('')
  const [photos, setPhotos] = useState([])
  const [step, setStep] = useState(1)

  function handleBrandSelect(brand) {
    setSelectedBrand(brand)
    setSelectedModel('')
    setSelectedCondition('')
    setSelectedBattery('')
    setPhotos([])
  }

  function handleModelSelect(model) {
    setSelectedModel(model)
    setSelectedCondition('')
    setSelectedBattery('')
    setPhotos([])
  }

  function startOver() {
    setSelectedBrand('')
    setSelectedModel('')
    setSelectedCondition('')
    setSelectedBattery('')
    setPhotos([])
    setStep(1)
  }

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
          onSelect={handleBrandSelect}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <SelectModel
          brand={selectedBrand}
          selectedModel={selectedModel}
          onSelect={handleModelSelect}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <SelectCondition
          selectedCondition={selectedCondition}
          onSelect={setSelectedCondition}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <BatteryHealth
          selectedBattery={selectedBattery}
          onSelect={setSelectedBattery}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <PhonePhotos
          photos={photos}
          onPhotosChange={setPhotos}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <SellResult
          brand={selectedBrand}
          model={selectedModel}
          condition={selectedCondition}
          battery={selectedBattery}
          photoCount={photos.length}
          onBack={() => setStep(5)}
          onStartOver={startOver}
        />
      )}
      </div>
    </main>
  )
}

export default SellPhone