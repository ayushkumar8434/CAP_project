import './FindPerfectPhone.css'

function FindPerfectPhone() {
  return (
    <div className="find-section">

      <div className="find-header">
        <div className="find-label">
          FIND YOUR PERFECT PHONE
        </div>

        <div className="find-title">
          What kind of phone
          <div className="find-title-highlight">
            are you looking for?
          </div>
        </div>

        <div className="find-description">
          Tell us what matters to you and we'll help you find
          the right phone.
        </div>
      </div>


      <div className="find-container">

        <div className="find-question">
          What will you use your phone for?
        </div>

        <div className="find-options">

          <div className="find-option">
            <div className="option-icon">📸</div>
            <div className="option-title">Best Camera</div>
            <div className="option-description">
              For photos & videos
            </div>
          </div>

          <div className="find-option">
            <div className="option-icon">🎮</div>
            <div className="option-title">Gaming</div>
            <div className="option-description">
              For gaming & performance
            </div>
          </div>

          <div className="find-option">
            <div className="option-icon">🔋</div>
            <div className="option-title">Best Battery</div>
            <div className="option-description">
              Long lasting battery
            </div>
          </div>

          <div className="find-option">
            <div className="option-icon">⚡</div>
            <div className="option-title">Performance</div>
            <div className="option-description">
              Fast & powerful
            </div>
          </div>

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


        <div className="find-button">
          Find My Phone
        </div>

      </div>

    </div>
  )
}

export default FindPerfectPhone