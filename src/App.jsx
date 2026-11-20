import './App.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Hero from './components/Hero'
import BrandSection from './components/BrandSection'
import PopularPhones from './components/PopularPhones'
import SellPhone from './pages/sell/sellphone'
import FindPerfectPhone from './components/FindPerfectPhone'
import TodaysDrops from './components/TodaysDrops'
import YourPhoneValue from './components/YourPhoneValue'
import GoodDeal from './components/GoodDeal'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import PhoneListing from './pages/PhoneListing'
import PhoneDetails from './pages/PhoneDetails'
import Cart from './pages/cart/cart'
import Checkout from './pages/checkout/Checkout'
import OrderConfirmation from './pages/checkout/OrderConfirmation'
import Orders from './pages/orders/Orders'
import MyListings from './pages/sell/MyListings'
import RequireAuth from './components/RequireAuth'
import StripeWrapper from './components/StripeWrapper'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname !== '/' || !hash) return undefined

    let secondFrame
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const section = document.getElementById(hash.slice(1))
        if (!section) return

        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        section.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        })
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      if (secondFrame !== undefined) window.cancelAnimationFrame(secondFrame)
    }
  }, [pathname, hash])

  return null
}

function HomePage() {
  return (
    <>
      <Hero />
      <BrandSection />
      <PopularPhones />
      <FindPerfectPhone />
      <TodaysDrops />
      <GoodDeal />
      <YourPhoneValue />
      <FinalCTA />
    </>
  )
}

function AppContent() {
  const { pathname } = useLocation()

  return (
    <>
      <Navbar />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/phones" element={<RequireAuth><PhoneListing /></RequireAuth>} />
        <Route path="/phones/:id" element={<RequireAuth><PhoneDetails /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route 
          path="/checkout" 
          element={
            <RequireAuth>
              <StripeWrapper>
                <Checkout />
              </StripeWrapper>
            </RequireAuth>
          } 
        />
        <Route path="/order-confirmation" element={<RequireAuth><OrderConfirmation /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
        <Route path="/my-listings" element={<RequireAuth><MyListings /></RequireAuth>} />
        <Route path="/sell" element={<RequireAuth><SellPhone /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {pathname !== '/login' && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App