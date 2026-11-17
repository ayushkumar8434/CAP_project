const batteryOptions = [
  {
    name: 'Excellent',
    description: 'Battery health is 90% or higher.',
  },
  {
    name: 'Good',
    description: 'Battery health is between 80% and 89%.',
  },
  {
    name: 'Average',
    description: 'Battery health is between 70% and 79%.',
  },
  {
    name: 'Poor',
    description: 'Battery health is below 70% or drains quickly.',
  },
  {
    name: 'Not sure',
    description: 'I do not know how to check my battery health.',
  },
]

function BatteryHealth({ selectedBattery, onSelect, onNext, onBack }) {
  return (
    <section className="sell-brand-step">
      <div className="sell-section-heading">
        <h2>How is your battery health?</h2>
        <p>Choose the option that best describes how long your phone lasts.</p>
      </div>

      <div className="sell-condition-grid">
        {batteryOptions.map((option) => (
          <button
            key={option.name}
            type="button"
            className={`sell-condition-option${selectedBattery === option.name ? ' is-selected' : ''}`}
            aria-pressed={selectedBattery === option.name}
            onClick={() => onSelect(option.name)}
          >
            <span className="sell-condition-name">{option.name}</span>
            <span className="sell-condition-description">{option.description}</span>
          </button>
        ))}
      </div>

      <div className="sell-step-footer">
        <button className="sell-back-button" type="button" onClick={onBack}>
          Back
        </button>
        <p>{selectedBattery || 'Choose a battery condition to continue'}</p>
        <button
          className="sell-next-button"
          type="button"
          onClick={onNext}
          disabled={!selectedBattery}
        >
          Continue
        </button>
      </div>
    </section>
  )
}

export default BatteryHealth