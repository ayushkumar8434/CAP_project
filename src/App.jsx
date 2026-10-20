import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Phone3D from './components//Phone3D'
import WhyNewPhone from './components/WhyNewPhone'
import BrandSection from './components/BrandSection'
import PopularPhones from './components/PopularPhones'
import SellPhone from './pages/sell/sellphone'
import FindPerfectPhone from './components/FindPerfectPhone'
import TodaysDrops from './components/TodaysDrops'


function HomePage() {
  return (
    <>
      <Hero />
      <Phone3D />
      <BrandSection />
      <PopularPhones />
      <FindPerfectPhone />
      <TodaysDrops />
      <WhyNewPhone />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sell" element={<SellPhone />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App