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
<<<<<<< HEAD
import FindPerfectPhone from './components/FindPerfectPhone'
import TodaysDrops from './components/TodaysDrops'
import YourPhoneValue from './components/YourPhoneValue'
import NewPhoneVerified from './components/NewPhoneVerified'
import ShopByNeed from './components/ShopByNeed'
import GoodDeal from './components/GoodDeal'
import NewPhoneJournal from './components/NewPhoneJournal'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

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
=======
import ProductDetails from './pages/product/ProductDetails'
import Cart from './pages/cart/cart'
import Checkout from './pages/checkout/Checkout'
import OrderConfirmation from './pages/checkout/OrderConfirmation'
import Wishlist from './pages/wishlist/wishlist'
>>>>>>> 7b9301d (pages)


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
      <NewPhoneVerified />
      <ShopByNeed />
      <NewPhoneJournal />
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
        <Route path="/sell" element={<SellPhone />} />
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
<<<<<<< HEAD
      <AppContent />
=======
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sell" element={<SellPhone />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
>>>>>>> 7b9301d (pages)
    </BrowserRouter>
  )
}

export default App