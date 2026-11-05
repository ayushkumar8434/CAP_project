import './NewPhoneVerified.css'

const trustPrinciples = [
  {
    number: '01',
    title: 'Transparent Phone Condition',
    description: "Understand the phone's condition clearly before you decide.",
  },
  {
    number: '02',
    title: 'Honest Pricing',
    description: 'See clear prices without confusing hidden charges.',
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
            <p className="verified-eyebrow">NEWPHONE VERIFIED</p>
            <h2 className="verified-title" id="verified-heading">
              A smarter way to buy pre-owned phones.
            </h2>
          </div>
          <p className="verified-intro">
            The details that matter, made easier to understand before you buy.
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
