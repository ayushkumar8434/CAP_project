import { products } from '../data/products'
import './BrandSection.css'

const brands = [
  { name: 'Apple', mark: 'A' },
  { name: 'Samsung', mark: 'S' },
  { name: 'OnePlus', mark: '1+' },
  { name: 'Google', mark: 'G' },
  { name: 'Xiaomi', mark: 'Mi' },
  { name: 'Nothing', mark: 'N' },
  { name: 'Oppo', mark: 'O' },
  { name: 'Vivo', mark: 'V' },
  { name: 'Realme', mark: 'R' },
  { name: 'Motorola', mark: 'M' },
]

function BrandCard({ name, mark, decorative = false }) {
  return (
<<<<<<< HEAD
    <div className="brand-item" aria-hidden={decorative || undefined}>
      <span className="brand-image" aria-hidden="true">{mark}</span>
      <span className="brand-name">{name}</span>
    </div>
  )
}

function BrandSection() {
  return (
    <section className="brand-section" aria-labelledby="brand-heading">
      <header className="brand-header">
        <p className="brand-label">EXPLORE BRANDS</p>
        <h2 className="brand-title" id="brand-heading">Shop By Brand</h2>
        <p className="brand-description">Find the phone that's right for you.</p>
      </header>

      <div className="brand-slider">
        <div className="brand-track">
          {brands.map((brand) => (
            <BrandCard key={brand.name} {...brand} />
          ))}
          {brands.map((brand) => (
            <BrandCard
              key={`duplicate-${brand.name}`}
              {...brand}
              decorative
            />
          ))}
        </div>
      </div>
    </section>
  )
}

=======
    <section className="brand-section">
      <div className="brand-header">
        <p className="brand-label">EXPLORE BRANDS</p>
        <h2 className="brand-title">Shop By Brand</h2>
        <p className="brand-description">Find the phone that's right for you.</p>
      </div>

      <div className="brand-slider">
        <div className="brand-track">
          {[0, 1].map((set) => (
            <div
              className="brand-set"
              key={set}
              aria-hidden={set === 1 ? 'true' : undefined}
            >
              {products.map((product) => (
                <div className="brand-item" key={product.id}>
                  <div className="brand-image">
                    <img src={product.image} alt="" />
                  </div>
                  <p className="brand-name">{product.brand}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

>>>>>>> 7b9301d (pages)
export default BrandSection
