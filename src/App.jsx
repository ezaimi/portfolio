import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import TvSection from './components/sections/TvSection'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Contact from './components/sections/Contact'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* <TvSection /> */}
        {/* <About />
        <Projects />
        <Skills />
        <Contact /> */}
      </main>
      {/* <Footer /> */}
    </>
  )
}

export default App
