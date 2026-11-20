import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_PUBLISHABLE_KEY } from '../config'

// Load Stripe with publishable key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

function StripeWrapper({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  )
}

export default StripeWrapper
