import { Navigate, useLocation } from 'react-router-dom'

// Sends logged-out visitors to /login, then back to the page they wanted.
function RequireAuth({ children }) {
  const location = useLocation()
  const loggedIn = Boolean(localStorage.getItem('authToken') && localStorage.getItem('user'))

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return children
}

export default RequireAuth
