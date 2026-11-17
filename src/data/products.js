export const products = [
  {
    id: 'iphone-15',
    brand: 'Apple',
    name: 'iPhone 15',
    image: '/images/iphone15.jpg',
    rating: '4.8',
    price: 48999,
    originalPrice: 79900,
  },
  {
    id: 'oneplus-13',
    brand: 'OnePlus',
    name: 'OnePlus 13',
    image: '/images/oneplus.jpg',
    rating: '4.8',
    price: 49999,
    originalPrice: 69999,
  },
  {
    id: 'pixel-9',
    brand: 'Google',
    name: 'Pixel 9',
    image: '/images/pixel.jpg',
    rating: '4.6',
    price: 44999,
    originalPrice: 79999,
  },
  {
    id: 'galaxy-s24',
    brand: 'Samsung',
    name: 'Galaxy S24',
    image: '/images/samsungS24.jpg',
    rating: '4.7',
    price: 52999,
    originalPrice: 74999,
  },
]

export const CART_STORAGE_KEY = 'newphone-cart'
export const WISHLIST_STORAGE_KEY = 'newphone-wishlist'

export function readCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)

  if (!savedCart) {
    return []
  }

  try {
    const parsedCart = JSON.parse(savedCart)
    if (!Array.isArray(parsedCart)) {
      throw new Error('Saved cart data must be a list.')
    }

    return parsedCart.filter((item) => (
      item &&
      typeof item.id === 'string' &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    ))
  } catch (error) {
    throw new Error('Could not read the saved cart from browser storage.', { cause: error })
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

export function readWishlist() {
  const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)

  if (!savedWishlist) {
    return []
  }

  try {
    const parsedWishlist = JSON.parse(savedWishlist)
    if (!Array.isArray(parsedWishlist)) {
      throw new Error('Saved wishlist data must be a list.')
    }

    return [...new Set(parsedWishlist.filter((id) => (
      typeof id === 'string' && products.some((product) => product.id === id)
    )))]
  } catch (error) {
    throw new Error('Could not read the saved wishlist from browser storage.', { cause: error })
  }
}

export function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
}

export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`
}
