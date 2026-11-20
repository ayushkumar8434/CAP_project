import { useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:5001/api'

// Fetches available phones from the backend. `query` is a URLSearchParams-style string.
export function useLivePhones(query) {
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_BASE_URL}/phones?${query}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setPhones(data.success ? data.phones : [])
        setError(!data.success)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(true)
        setLoading(false)
      })
    return () => controller.abort()
  }, [query])

  return { phones, loading, error }
}
