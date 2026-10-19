const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Vivo', 'Oppo']

function SelectBrand({ selectedBrand, onSelect, onNext }) {
  return (
    <section className="sell-brand-step">
      <div className="sell-section-heading">
        <h2>What brand is your phone?</h2>
        <p>Select the brand to see the right models in the next step.</p>
      </div>

      <div className="sell-brand-grid">
        {brands.map((brand) => (
          <button
            key={brand}
            type="button"
            className={`sell-brand-option${selectedBrand === brand ? ' is-selected' : ''}`}
            aria-pressed={selectedBrand === brand}
            onClick={() => onSelect(brand)}
          >
            <span className="sell-brand-initial" aria-hidden="true">{brand.charAt(0)}</span>
            <span>{brand}</span>
          </button>
        ))}
      </div>

      <div className="sell-step-footer">
        <p>{selectedBrand ? `${selectedBrand} selected` : 'Choose one brand to continue'}</p>
        <button
          className="sell-next-button"
          type="button"
          onClick={onNext}
          disabled={!selectedBrand}
        >
          Continue
        </button>
      </div>
    </section>
  )
}

export default SelectBrand