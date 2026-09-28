import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Phone3D from './components//Phone3D'
import WhyNewPhone from './components/WhyNewPhone'
import BrandSection from './components/BrandSection'


function App(){
  return (
    <div>
      <Navbar />
      <Hero />
      <Phone3D />
      <BrandSection />
      <WhyNewPhone />
    </div>
  )
}
export default App