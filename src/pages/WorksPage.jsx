import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import Navbar from '../components/layout/Navbar'
import { ALL_PROJECTS, pad } from '../data/projects'

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
}

const FILTERS = ['Development', 'UI / UX Design', 'Product Design']

// Lerp for smooth card follow
const lerp = (a, b, t) => a + (b - a) * t

export default function WorksPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('Development')
  const [hoveredId, setHoveredId] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const pageRef      = useRef(null)
  const headRef      = useRef(null)
  const metaRef      = useRef(null)
  const filterBarRef = useRef(null)
  const filterRefs   = useRef({})
  const listRef      = useRef(null)
  const isFirstRender = useRef(true)
  const isAnimating   = useRef(false)

  // Preview card refs
  const cardRef   = useRef(null)
  const imgRef    = useRef(null)
  const rafRef    = useRef(null)
  const mouse     = useRef({ x: 0, y: 0 })
  const cardPos   = useRef({ x: 0, y: 0 })
  const hoveredProject = useRef(null)

  const filtered = ALL_PROJECTS.filter((p) => p.category === activeFilter)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Smooth card follow loop
  useEffect(() => {
    const tick = () => {
      cardPos.current.x = lerp(cardPos.current.x, mouse.current.x, 0.1)
      cardPos.current.y = lerp(cardPos.current.y, mouse.current.y, 0.1)

      if (cardRef.current) {
        cardRef.current.style.left = `${cardPos.current.x}px`
        cardRef.current.style.top  = `${cardPos.current.y}px`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleMouseMove = (e) => {
    // Offset so card doesn't cover the row text
    mouse.current.x = e.clientX + 32
    mouse.current.y = e.clientY - 80
  }

  const handleRowEnter = (project) => {
    setHoveredId(project.id)

    if (!cardRef.current || !imgRef.current) return

    if (hoveredProject.current?.id === project.id) return

    if (hoveredProject.current === null) {
      // First hover — just show card
      imgRef.current.src = project.img
      gsap.to(cardRef.current, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' })
    } else {
      // Switch image: fade out → swap src → fade in
      gsap.to(imgRef.current, {
        opacity: 0, duration: 0.14, ease: 'power1.in',
        onComplete: () => {
          imgRef.current.src = project.img
          gsap.to(imgRef.current, { opacity: 1, duration: 0.18, ease: 'power1.out' })
        },
      })
    }

    hoveredProject.current = project
  }

  const handleRowLeave = () => {
    setHoveredId(null)
    hoveredProject.current = null
    gsap.to(cardRef.current, { opacity: 0, scale: 0.96, duration: 0.22, ease: 'power2.in' })
  }

  // Slide indicator to active filter tab
  useEffect(() => {
    const btn = filterRefs.current[activeFilter]
    const bar = filterBarRef.current
    if (!btn || !bar) return
    const barRect = bar.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    setIndicatorStyle({ left: btnRect.left - barRect.left, width: btnRect.width, opacity: 1 })
  }, [activeFilter])

  // Page entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(pageRef.current, { opacity: 0 },        { opacity: 1, duration: 0.35 })
        .fromTo(headRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.0 }, '-=0.15')
        .fromTo(metaRef.current, { opacity: 0 },        { opacity: 1, duration: 0.7 }, '-=0.6')
        .fromTo('.work-row',     { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6 }, '-=0.45')
    })
    return () => ctx.revert()
  }, [])

  const handleFilter = (f) => {
    if (f === activeFilter || isAnimating.current) return
    isAnimating.current = true
    // Hide card on filter switch
    handleRowLeave()
    const rows = listRef.current?.querySelectorAll('.work-row')
    if (!rows?.length) { setActiveFilter(f); return }
    gsap.to(rows, {
      opacity: 0, y: -12,
      stagger: { each: 0.025, from: 'start' },
      duration: 0.2, ease: 'power2.in',
      onComplete: () => setActiveFilter(f),
    })
  }

  // Animate rows in after filter switch
  useLayoutEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    const rows = listRef.current?.querySelectorAll('.work-row')
    if (!rows?.length) return
    gsap.fromTo(rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.045, duration: 0.5, ease: 'power3.out',
        onComplete: () => { isAnimating.current = false } }
    )
  }, [activeFilter])

  return (
    <div
      ref={pageRef}
      style={{ backgroundColor: '#F9F3E2', minHeight: '100vh', opacity: 0 }}
      onMouseMove={handleMouseMove}
    >
      <Navbar />

      {/* Floating preview card — fixed, follows cursor via rAF lerp */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          width: '300px',
          pointerEvents: 'none',
          zIndex: 200,
          opacity: 0,
          scale: 0.96,
          transform: 'translateZ(0)',
          willChange: 'left, top',
          backgroundColor: '#0c0c0c',
          border: '1px solid #2a2a2a',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', aspectRatio: '16 / 10', backgroundColor: '#1a1a1a', position: 'relative' }}>
          <img
            ref={imgRef}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          {/* Fallback pattern shown when no image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#333',
              }}
            >
              {hoveredProject.current?.type}
            </span>
          </div>
        </div>
      </div>

      <main style={{ padding: '120px 52px 80px' }}>

        {/* Heading */}
        <div ref={headRef} style={{ opacity: 0 }}>
          <h1
            style={{
              fontSize: 'clamp(5rem, 14vw, 25rem)',
              fontWeight: 300,
              lineHeight: 0.88,
              letterSpacing: '0.002em',
              margin: '0 0 20px',
              color: '#1a1a1a',
            }}
          >
            Works.
          </h1>
        </div>

        {/* Meta + filter bar */}
        <div
          ref={metaRef}
          style={{
            opacity: 0,
            borderTop: '1px solid rgba(26,26,26,0.15)',
            paddingTop: '12px',
            marginBottom: '0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ ...mono, fontSize: '0.62rem', color: '#aaa' }}>
            {filtered.length} Projects · 2022–2025
          </span>

          {/* Filter tabs */}
          <div ref={filterBarRef} style={{ display: 'flex', gap: '28px', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                bottom: -4,
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                height: '1px',
                backgroundColor: '#1a1a1a',
                opacity: indicatorStyle.opacity,
                transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: 'none',
              }}
            />
            {FILTERS.map((f) => (
              <button
                key={f}
                ref={(el) => { filterRefs.current[f] = el }}
                onClick={() => handleFilter(f)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 6px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: activeFilter === f ? 600 : 400,
                  color: activeFilter === f ? '#1a1a1a' : '#aaa',
                  transition: 'color 0.25s ease',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Project list */}
        <div ref={listRef} style={{ marginTop: '0' }}>
          {filtered.map((project) => (
            <div
              key={project.id}
              className="work-row"
              onMouseEnter={() => handleRowEnter(project)}
              onMouseLeave={handleRowLeave}
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{
                borderTop: '1px solid rgba(26,26,26,0.12)',
                padding: '22px 0',
                display: 'grid',
                gridTemplateColumns: '52px 1fr auto',
                gap: '0 24px',
                alignItems: 'start',
                cursor: 'pointer',
                backgroundColor: hoveredId === project.id ? 'rgba(26,26,26,0.04)' : 'transparent',
                transition: 'background-color 0.2s ease',
                marginLeft: '-8px',
                marginRight: '-8px',
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
            >
              {/* Index */}
              <span style={{ ...mono, fontSize: '0.62rem', color: '#bbb', paddingTop: '5px' }}>
                {pad(project.id)}
              </span>

              {/* Name + desc */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 'clamp(1.1rem, 2vw, 1.55rem)',
                    fontWeight: 300,
                    letterSpacing: '-0.01em',
                    color: '#1a1a1a',
                    lineHeight: 1.2,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {project.name}
                </span>
                <span
                  style={{
                    ...mono,
                    fontSize: '0.62rem',
                    color: hoveredId === project.id ? '#555' : '#aaa',
                    lineHeight: 1.7,
                    textTransform: 'none',
                    letterSpacing: '0.04em',
                    maxWidth: '540px',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {project.desc}
                </span>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      ...mono, fontSize: '0.58rem', color: '#888',
                      border: '1px solid rgba(26,26,26,0.18)',
                      padding: '2px 10px', borderRadius: '1px',
                    }}
                  >
                    {project.category}
                  </span>
                  <span
                    style={{
                      ...mono, fontSize: '0.58rem', color: '#888',
                      border: '1px solid rgba(26,26,26,0.18)',
                      padding: '2px 10px', borderRadius: '1px',
                    }}
                  >
                    {project.type}
                  </span>
                </div>
              </div>

              {/* Year + arrow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', paddingTop: '4px' }}>
                <span style={{ ...mono, fontSize: '0.65rem', color: '#999' }}>{project.year}</span>
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '1rem',
                    color: '#1a1a1a',
                    opacity: hoveredId === project.id ? 1 : 0,
                    transform: hoveredId === project.id ? 'translateX(0)' : 'translateX(-6px)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}
                >
                  ↗
                </span>
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(26,26,26,0.12)' }} />
        </div>

        {/* Footer */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ ...mono, fontSize: '0.55rem', color: '#ccc' }}>© 2025 Erisa Zaimi</span>
        </div>
      </main>
    </div>
  )
}
