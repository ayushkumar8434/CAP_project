import { useEffect, useRef, useState } from 'react'
import './NewPhoneJournal.css'

const articles = [
  {
    id: 'used-phone-checklist',
    category: 'BUYING SMART',
    readingTime: '4 min read',
    title: '5 Things to Check Before Buying a Used Smartphone',
    description:
      'A quick, practical checklist for checking condition, battery, network status, and more before you buy.',
    paragraphs: [
      'A second-hand phone can be a great upgrade, but take a few minutes to check the details before you commit.',
      'Start with the outside. Look over the screen, frame, and camera lenses in good light. Test the buttons, speakers, microphones, cameras, charging port, and biometrics. Small marks can be normal; damage that affects how the phone works deserves a closer look.',
      'Check battery health in the phone settings where available, and ask how long it lasts in everyday use. Confirm the exact model and storage in settings, then make sure the device is signed out of its previous account and can be reset and activated by you.',
      'Finally, check that it connects to your carrier, ask what accessories or proof of purchase are included, and agree on the price only after you have tested the phone. If anything feels unclear, take time to verify it.',
    ],
  },
  {
    id: 'battery-health',
    category: 'PHONE CARE',
    readingTime: '3 min read',
    title: "How to Check Your Phone's Battery Health",
    description:
      'Know where to find battery information, what it can tell you, and what to ask when it is not shown.',
    paragraphs: [
      'Battery health tools vary by phone model and software version, so there is no single percentage that tells the whole story.',
      'On supported iPhones, look in Settings under Battery for Battery Health. Android phones may provide battery information in Settings, a manufacturer support app, or built-in diagnostics. The exact menus differ by brand and model.',
      'If a health percentage is not available, test the phone unplugged for a while and ask about typical screen-on time, unexpected shutdowns, and charging behavior. Check for unusual heat during ordinary use and inspect for signs of battery swelling; do not use a device with a swollen battery.',
      'Treat the displayed figure as one useful clue, not a guarantee of how long the phone will last. Battery age, usage, temperature, and replacement history all matter.',
    ],
  },
  {
    id: 'iphone-vs-android',
    category: 'BUYING SMART',
    readingTime: '5 min read',
    title: 'iPhone vs Android: Which Is Better to Buy Second-Hand?',
    description:
      'The right choice depends on the phone you already use, the features you care about, and the device in front of you.',
    paragraphs: [
      '      There is no universal winner when buying a used iPhone or Android phone. The better pick is the one that fits your routine and has the clearest condition details.',
      'An iPhone may make sense if you already use Apple services and accessories. Check the model’s current software support, battery information, account lock status, and whether key parts or the battery have been replaced.',
      'Android offers a wide range of designs and prices. Verify the exact model and storage, check the manufacturer’s software support information for that model, and test the screen, cameras, ports, and carrier compatibility.',
      'Compare like for like: same model, storage, condition, and included accessories. Then choose the phone you can inspect, verify, and comfortably afford.',
    ],
  },
  {
    id: 'sell-old-phone',
    category: 'SELLING BETTER',
    readingTime: '4 min read',
    title: 'How to Get the Best Value When Selling Your Old Phone',
    description:
      'A few thoughtful steps can make your listing clearer and help buyers understand what they are getting.',
    paragraphs: [
      'A trustworthy listing starts with accurate details. Confirm the exact model and storage in settings, and describe the condition honestly, including scratches, repairs, or features that do not work.',
      'Back up your data, sign out of personal accounts, remove payment cards, and follow the manufacturer’s instructions to erase the phone before handing it over. Make sure you can still access any backup you need.',
      'Take clear photos in good light from several angles. Include useful accessories only if they are genuinely part of the sale, and mention them in the description.',
      'Set an asking price by comparing similar devices with the same model, storage, and condition. Be transparent about what is included and respond to questions clearly. Never share passwords or verification codes with a prospective buyer.',
    ],
  },
]

function NewPhoneJournal() {
  const [showAllArticles, setShowAllArticles] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const openerRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!selectedArticle || !dialog) return undefined

    dialog.showModal()
    closeButtonRef.current?.focus()

    return () => {
      if (dialog.open) dialog.close()
      openerRef.current?.focus()
    }
  }, [selectedArticle])

  function openArticle(article, event) {
    openerRef.current = event.currentTarget
    setSelectedArticle(article)
  }

  function closeArticle() {
    setSelectedArticle(null)
  }

  return (
    <section
      className="journal-section"
      id="newphone-journal"
      aria-labelledby="journal-heading"
    >
      <div className="journal-inner">
        <div className="journal-header">
          <div>
            <p className="journal-eyebrow">THE NEWPHONE JOURNAL</p>
            <h2 className="journal-title" id="journal-heading">
              Good tech.
              <br />
              <span>Good to know.</span>
            </h2>
          </div>
          <p className="journal-intro">
            Straight-up advice for buying, caring for, and passing on your
            next favourite phone.
          </p>
        </div>

        <div className="journal-list">
          {(showAllArticles ? articles : articles.slice(0, 3)).map(
            (article, index) => (
              <article
                className={`journal-article${index === 0 ? ' journal-article-featured' : ''}`}
                key={article.id}
              >
                <div className="journal-article-index" aria-hidden="true">
                  0{index + 1}
                </div>
                <div className="journal-article-content">
                  <div className="journal-article-meta">
                    <span className="journal-category">{article.category}</span>
                    <span className="journal-reading-time">
                      {article.readingTime}
                    </span>
                  </div>
                  <h3 className="journal-article-title">{article.title}</h3>
                  <p className="journal-article-description">
                    {article.description}
                  </p>
                  <button
                    className="journal-read-link np-button np-button--secondary"
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={`Read Article: ${article.title}`}
                    onClick={(event) => openArticle(article, event)}
                  >
                    Read Article <span aria-hidden="true">↗</span>
                  </button>
                </div>
                <span className="journal-article-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
            ),
          )}
        </div>

        <div className="journal-footer">
          <p>Less guesswork. Better phone decisions.</p>
          <button
            className="journal-view-all np-button np-button--secondary"
            type="button"
            aria-expanded={showAllArticles}
            onClick={() => setShowAllArticles((isShowing) => !isShowing)}
          >
            {showAllArticles ? 'Show Featured Articles' : 'View All Articles'}
            <span aria-hidden="true">{showAllArticles ? '↗' : '↓'}</span>
          </button>
        </div>
      </div>

      <dialog
        className="journal-dialog"
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby="journal-dialog-title"
        aria-describedby="journal-dialog-description"
        onCancel={(event) => {
          event.preventDefault()
          closeArticle()
        }}
      >
        {selectedArticle && (
          <div className="journal-dialog-content">
            <div className="journal-dialog-top">
              <p className="journal-dialog-meta">
                {selectedArticle.category}
                <span aria-hidden="true"> / </span>
                {selectedArticle.readingTime}
              </p>
              <button
                className="journal-dialog-close"
                type="button"
                ref={closeButtonRef}
                onClick={closeArticle}
                aria-label="Close article"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <h2 className="journal-dialog-title" id="journal-dialog-title">
              {selectedArticle.title}
            </h2>
            <p
              className="journal-dialog-description"
              id="journal-dialog-description"
            >
              {selectedArticle.description}
            </p>
            <div className="journal-dialog-body">
              {selectedArticle.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="journal-dialog-note">
              NewPhone Journal — practical advice for your next phone move.
            </p>
          </div>
        )}
      </dialog>
    </section>
  )
}

export default NewPhoneJournal
