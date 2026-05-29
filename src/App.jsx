import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function Home() {
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
  return (
    <BrowserRouter>
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
