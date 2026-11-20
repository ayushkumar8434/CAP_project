import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Login.css'

const API_BASE_URL = 'http://localhost:5001/api'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSignup, setIsSignup] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    if (!form.checkValidity()) {
      const emailValidity = emailRef.current.validity
      const passwordValidity = passwordRef.current.validity
      const nameValidity = isSignup ? nameRef.current.validity : { valueMissing: false }

      if (nameValidity.valueMissing) {
        setFeedback('Please enter your name.')
      } else if (emailValidity.valueMissing) {
        setFeedback('Please enter your email address.')
      } else if (emailValidity.typeMismatch) {
        setFeedback('Please enter a valid email address.')
      } else if (passwordValidity.valueMissing) {
        setFeedback('Please enter your password.')
      } else if (isSignup && passwordRef.current.value.length < 6) {
        setFeedback('Password must be at least 6 characters long.')
      }

      form.reportValidity()
      return
    }

    setLoading(true)
    setFeedback('')

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const name = isSignup ? nameRef.current.value : undefined

    try {
      const endpoint = isSignup ? '/auth/register' : '/auth/login'
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (isSignup) {
          // After signup, switch to login or auto-login
          setFeedback('Account created successfully! Please login.')
          setIsSignup(false)
          // Clear password field
          passwordRef.current.value = ''
        } else if (data.token) {
          // Login successful
          localStorage.setItem('authToken', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))

          setFeedback('Login successful! Redirecting...')
          
          setTimeout(() => {
            navigate(location.state?.from || '/', { replace: true })
          }, 1000)
        }
      } else {
        setFeedback(data.message || `${isSignup ? 'Signup' : 'Login'} failed. Please try again.`)
      }
    } catch {
      setFeedback('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-layout" aria-label="Log in to PocketPhone">
        <div className="login-story">
          <div className="login-story-copy">
            <p className="login-eyebrow"><span /> YOUR NEXT PHONE, YOUR WAY</p>
            <h1>A fresh start<br />for your <em>next</em> phone.</h1>
            <p className="login-story-description">
              Good tech should feel good, too. Pick up where you left off and
              find a phone that feels like you.
            </p>
          </div>

          <div className="login-phone-scene" aria-hidden="true">
            <div className="login-orbit login-orbit-one" />
            <div className="login-orbit login-orbit-two" />
            <div className="login-phone">
              <div className="login-phone-screen">
                <div className="login-phone-camera" />
                <div className="login-phone-art">
                  <span className="login-phone-sun" />
                  <span className="login-phone-hill login-phone-hill-back" />
                  <span className="login-phone-hill login-phone-hill-front" />
                </div>
              </div>
            </div>
            <div className="login-scene-note">
              <span className="login-note-dot" />
              A little more life in every device
            </div>
          </div>

          <p className="login-story-footer">BETTER TECH. BETTER CYCLES.</p>
        </div>

        <div className="login-form-side">
          <div className="login-card">
            <div className="login-card-heading">
              <p className="login-card-kicker">{isSignup ? 'JOIN POCKETPHONE' : 'GOOD TO HAVE YOU BACK'}</p>
              <h2>{isSignup ? 'Create Account' : 'Welcome Back!'}</h2>
              <p>{isSignup ? 'Sign up to start your PocketPhone journey.' : 'Login to continue your PocketPhone journey.'}</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {isSignup && (
                <div className="login-field">
                  <label htmlFor="login-name">Full Name</label>
                  <input
                    autoComplete="name"
                    id="login-name"
                    name="name"
                    placeholder="Your full name"
                    ref={nameRef}
                    required
                    type="text"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="login-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  autoComplete="email"
                  id="login-email"
                  name="email"
                  placeholder="you@example.com"
                  ref={emailRef}
                  required
                  type="email"
                  disabled={loading}
                />
              </div>

              <div className="login-field">
                <div className="login-password-label">
                  <label htmlFor="login-password">Password</label>
                  {!isSignup && (
                    <span className="login-coming-soon">Forgot password? <span>Coming soon</span></span>
                  )}
                </div>
                <div className="login-password-input">
                  <input
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    id="login-password"
                    name="password"
                    placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
                    ref={passwordRef}
                    required
                    minLength={isSignup ? 6 : undefined}
                    type={passwordVisible ? 'text' : 'password'}
                    disabled={loading}
                  />
                  <button
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={passwordVisible}
                    className="login-password-toggle"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    type="button"
                    disabled={loading}
                  >
                    {passwordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {!isSignup && (
                <label className="login-remember">
                  <input name="remember" type="checkbox" disabled={loading} />
                  <span>Remember me</span>
                </label>
              )}

              <button className="login-submit" type="submit" disabled={loading}>
                {loading ? (isSignup ? 'Creating account...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')} <span aria-hidden="true">&rarr;</span>
              </button>

              <p className="login-feedback" aria-live="polite" role="status">
                {feedback}
              </p>
            </form>

            <p className="login-signup">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="login-toggle-link"
                    onClick={() => {
                      setIsSignup(false)
                      setFeedback('')
                    }}
                    disabled={loading}
                  >
                    Login here
                  </button>
                </>
              ) : (
                <>
                  New to PocketPhone?{' '}
                  <button 
                    type="button"
                    className="login-toggle-link"
                    onClick={() => {
                      setIsSignup(true)
                      setFeedback('')
                    }}
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>
          </div>

          <p className="login-form-note">A more thoughtful way to find your next phone.</p>
        </div>
      </section>
    </main>
  )
}

export default Login
