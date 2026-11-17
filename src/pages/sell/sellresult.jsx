function SellResult({ brand, model, condition, battery, photoCount, onBack, onStartOver }) {
  const details = [
    ['Brand', brand],
    ['Model', model],
    ['Condition', condition],
    ['Battery health', battery],
    ['Photos', `${photoCount} added`],
  ]

  return (
    <section className="sell-next-step sell-result">
      <p className="sell-eyebrow">DEVICE SUMMARY</p>
      <h2>Your phone details are ready.</h2>
      <p>Review the information you shared before continuing with your sale.</p>

      <dl className="sell-result-details">
        {details.map(([label, value]) => (
          <div className="sell-result-detail" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <p className="sell-result-note">
        This demo does not generate a price estimate or submit a sale request yet.
      </p>

      <div className="sell-result-actions">
        <button className="sell-back-button" type="button" onClick={onBack}>
          Edit photos
        </button>
        <button className="sell-next-button" type="button" onClick={onStartOver}>
          Start over
        </button>
      </div>
    </section>
  )
}

export default SellResult