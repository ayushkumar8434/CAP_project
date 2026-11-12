import './FindPerfectPhone.css'

function FindPerfectPhone() {
  return (
    <div className="find-section">

      <div className="find-header">
        <p className="find-label">
          FIND YOUR PERFECT PHONE
        </p>

        <h2 className="find-title">
          What kind of phone
          <div className="find-title-highlight">
            are you looking for?
          </div>
        </h2>

        <p className="find-description">
          Explore what to consider when choosing your next phone.
        </p>
      </div>


      <div className="find-container">

        <div className="find-question">
          What will you use your phone for?
        </div>

        <div className="find-options">

          <article className="find-option">
            <span className="option-icon" aria-hidden="true">01</span>
            <h3 className="option-title">Best Camera</h3>
            <p className="option-description">
              For photos & videos
            </p>
          </article>

          <article className="find-option">
            <span className="option-icon" aria-hidden="true">02</span>
            <h3 className="option-title">Gaming</h3>
            <p className="option-description">
              For gaming & performance
            </p>
          </article>

          <article className="find-option">
            <span className="option-icon" aria-hidden="true">03</span>
            <h3 className="option-title">Best Battery</h3>
            <p className="option-description">
              Long lasting battery
            </p>
          </article>

          <article className="find-option">
            <span className="option-icon" aria-hidden="true">04</span>
            <h3 className="option-title">Performance</h3>
            <p className="option-description">
              Fast & powerful
            </p>
          </article>

        </div>


        <div className="find-question budget-question">
          What's your budget?
        </div>

        <div className="budget-options">

          <div className="budget-option">
            Under ₹15K
          </div>

          <div className="budget-option">
            ₹15K - ₹25K
          </div>

          <div className="budget-option">
            ₹25K - ₹50K
          </div>

          <div className="budget-option">
            ₹50K+
          </div>

        </div>


        <p className="find-availability">
          Personalized matches will be available when live listings launch.
        </p>

      </div>

    </div>
  )
}

export default FindPerfectPhone