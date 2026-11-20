// Backend URL. Set VITE_API_URL (for example https://your-api.onrender.com/api) when deploying.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '')

// Backend origin without "/api", used for uploaded photos at /uploads/...
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '')

export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51QRKg22LtjXn6jyX1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M'
