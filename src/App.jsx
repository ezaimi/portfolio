import { useState, useCallback, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
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
import { ALL_PROJECTS } from './data/index'

function VisitTracker() {
  const location = useLocation()
  const pagesRef  = useRef([])
  const startRef  = useRef(0)
  const sentRef   = useRef(false)

  useEffect(() => {
    startRef.current = Date.now()
  }, [])

  useEffect(() => {
    const path = location.pathname
    if (!pagesRef.current.includes(path)) pagesRef.current = [...pagesRef.current, path]
  }, [location.pathname])

  useEffect(() => {
    const send = () => {
      if (sentRef.current) return
      const last = sessionStorage.getItem('lastTracked')
      if (last && Date.now() - Number(last) < 10000) return
      sentRef.current = true
      sessionStorage.setItem('lastTracked', String(Date.now()))
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pages:     pagesRef.current,
          duration:  Math.round((Date.now() - startRef.current) / 1000),
          referrer:  document.referrer || '',
          userAgent: navigator.userAgent,
        }),
        keepalive: true,
      }).catch(() => {})
    }

    const onVisibility = () => { if (document.visibilityState === 'hidden') send() }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', send)
    const timer = setTimeout(send, 10 * 60 * 1000)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', send)
      clearTimeout(timer)
    }
  }, [])

  return null
}

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

const queuedProjectImageLinks = new Set()

function queueProjectImageLink(src, rel = 'prefetch', fetchPriority = 'auto') {
  if (!src || src.startsWith('/images/projects/') || queuedProjectImageLinks.has(src)) return

  queuedProjectImageLinks.add(src)
  const link = document.createElement('link')
  link.rel = rel
  link.as = 'image'
  link.href = src
  if ('fetchPriority' in link) link.fetchPriority = fetchPriority
  document.head.appendChild(link)
}

function preloadProjectImages() {
  ALL_PROJECTS.forEach((p) => {
    queueProjectImageLink(p.img, 'preload', 'high')
  })

  const requestIdle = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 750))
  requestIdle(() => {
    ALL_PROJECTS.forEach((p) => {
      [p.pageImg, ...(p.images ?? []), ...(p.gallery ?? [])].forEach((src) => {
        queueProjectImageLink(src, 'prefetch', 'low')
      })
    })
  })
}

function App() {
  const [loading, setLoading] = useState(true)

  const handleLoaderDone = useCallback(() => {
    setLoading(false);
    preloadProjectImages();
  }, []);

  return (
    <BrowserRouter>
      <VisitTracker />
      {loading && <PageLoader onDone={handleLoaderDone} />}
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
