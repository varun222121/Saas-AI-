import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import AiTools from '../Components/AiTools'
import Testimonial from '../Components/Testimonial'
import Plans from '../Components/Plans'
import Footer from '../Components/Footer'

function Home() {
  return (
    <>
       <Navbar/>
       <Hero/>
       <AiTools/>
       <Testimonial/>
       <Plans/>
       <Footer/>
    </>
  )
}

export default Home

//connection of links in sidebar is not complete