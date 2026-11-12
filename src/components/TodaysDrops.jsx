import './TodaysDrops.css'

function TodaysDrops() {
  return (
    <section className="drops-section" aria-labelledby="drops-heading">
      <div className="drops-header">
        <p className="drops-label">
          TODAY'S PHONE DROPS
        </p>

        <h2 className="drops-title" id="drops-heading">
          Fresh phones. Fresh prices.
        </h2>
      </div>

      <div className="drops-availability" role="status">
        <span className="drops-availability-index" aria-hidden="true">01</span>
        <p>
          No live listings are available right now. Current NewPhone stock will
          appear here when available.
        </p>
      </div>
    </section>
  )
}

export default TodaysDrops