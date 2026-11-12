import './NewPhoneVerified.css'

const trustPrinciples = [
  {
    number: '01',
    title: 'Clear Condition Details',
    description: "Understand the phone's condition clearly before you decide.",
  },
  {
    number: '02',
    title: 'Upfront Price Information',
    description: 'Review the stated price and included items before deciding.',
  },
  {
    number: '03',
    title: 'Better Buying Decisions',
    description: 'Get useful information to help you choose with confidence.',
  },
]

function NewPhoneVerified() {
  return (
    <section className="verified-section" aria-labelledby="verified-heading">
      <div className="verified-inner">
        <div className="verified-header">
          <div>
            <p className="verified-eyebrow">BUY WITH CLARITY</p>
            <h2 className="verified-title" id="verified-heading">
              Know what to look for in a pre-owned phone.
            </h2>
          </div>
          <p className="verified-intro">
            Useful details to consider before choosing a pre-owned device.
          </p>
        </div>

        <div className="verified-principles">
          {trustPrinciples.map(({ number, title, description }) => (
            <article className="verified-principle" key={number}>
              <span className="verified-number" aria-hidden="true">
                {number}
              </span>
              <h3 className="verified-principle-title">{title}</h3>
              <p className="verified-principle-description">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewPhoneVerified
