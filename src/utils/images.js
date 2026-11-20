import { API_ORIGIN } from '../config'

// Inline placeholder, so a missing photo never depends on an external site.
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="#dcfce7"/>
      <rect x="130" y="110" width="140" height="280" rx="22" fill="none" stroke="#16a34a" stroke-width="8"/>
      <circle cx="200" cy="360" r="12" fill="#16a34a"/>
    </svg>`,
  )

// Turns a stored image value into a usable src.
export function imageUrl(value) {
  if (!value) return PLACEHOLDER_IMAGE
  return value.startsWith('/uploads/') ? `${API_ORIGIN}${value}` : value
}

export function firstImage(phone) {
  return imageUrl(phone?.images?.[0])
}
