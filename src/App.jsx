import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import NowSection from './components/sections/NowSection'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import AboutPage from './pages/AboutPage'
import WorksPage from './pages/WorksPage'
import ContactPage from './pages/ContactPage'
import ProjectPage from './pages/ProjectPage'
import CustomCursor from './components/CustomCursor'
import PageLoader from './components/PageLoader'

function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NowSection />
        <Projects />
        <Contact />
      </main>
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  return (
    <BrowserRouter>
      {loading && <PageLoader onDone={() => setLoading(false)} />}
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
