import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import Navbar from '../../components/layout/Navbar'
import { ALL_PROJECTS, pad } from '../../data/index'

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
}

const META_FIELDS = (p) => [
  { label: '// category', value: p.category },
  { label: '// type',     value: p.type     },
  { label: '// year',     value: p.year     },
  { label: '// status',   value: p.status ?? 'Completed' },
]

export default function DevProjectPage({ project, prevProject, nextProject }) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [imgIndex, setImgIndex] = useState(0)
  const images = project.images ?? [project.img]

  const pageRef       = useRef(null)
  const backRef       = useRef(null)
  const numRef        = useRef(null)
  const headRef       = useRef(null)
  const metaRef       = useRef(null)
  const imgRef        = useRef(null)
  const bodyRef       = useRef(null)
  const navRef        = useRef(null)
  const currentImgRef  = useRef(null)
  const userNavigated  = useRef(false)

  useEffect(() => {
    userNavigated.current = false
    setImgIndex(0)
  }, [project.id])

  useEffect(() => {
    if (!userNavigated.current || !currentImgRef.current) return
    gsap.fromTo(currentImgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
  }, [imgIndex])

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(pageRef.current, { opacity: 0 },              { opacity: 1, duration: 0.3 })
        .fromTo(imgRef.current,  { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 1.0 }, '-=0.1')
        .fromTo(backRef.current, { opacity: 0, x: -12 },      { opacity: 1, x: 0, duration: 0.6 }, '<')
        .fromTo(numRef.current,  { opacity: 0 },              { opacity: 1, duration: 0.5 }, '<')
        .fromTo(headRef.current, { opacity: 0, y: 40 },       { opacity: 1, y: 0, duration: 1.0 }, '-=0.3')
        .fromTo(metaRef.current, { opacity: 0 },              { opacity: 1, duration: 0.7 }, '-=0.55')
        .fromTo(bodyRef.current, { opacity: 0, y: 20 },       { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo(navRef.current,  { opacity: 0 },              { opacity: 1, duration: 0.5 }, '-=0.3')
    })
    return () => ctx.revert()
  }, [project])

  return (
    <div ref={pageRef} style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', opacity: 0 }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: isMobile ? 'auto' : 'calc(100vh - 60px)' }}>

        {/* Image — top on mobile, right sticky on desktop */}
        {isMobile && (
          <div ref={imgRef} style={{ opacity: 0, width: '100%', aspectRatio: '4 / 3', backgroundColor: '#111', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <img
              ref={currentImgRef}
              src={images[imgIndex]}
              alt={project.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => { userNavigated.current = true; setImgIndex(i => (i - 1 + images.length) % images.length) }}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontFamily: '"Courier New", Courier, monospace', fontSize: '1rem', color: '#F9F3E2', background: 'rgba(12,12,12,0.55)', border: '1px solid rgba(249,243,226,0.15)', borderRadius: '50%', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >←</button>
                <button
                  onClick={() => { userNavigated.current = true; setImgIndex(i => (i + 1) % images.length) }}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontFamily: '"Courier New", Courier, monospace', fontSize: '1rem', color: '#F9F3E2', background: 'rgba(12,12,12,0.55)', border: '1px solid rgba(249,243,226,0.15)', borderRadius: '50%', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >→</button>
                <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '7px' }}>
                  {images.map((_, i) => (
                    <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: i === imgIndex ? '#F9F3E2' : 'rgba(249,243,226,0.25)', transition: 'background-color 0.3s' }} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Left — scrollable info */}
        <div style={{ flex: 1, padding: isMobile ? '32px 20px 60px' : '72px 52px 80px', display: 'flex', flexDirection: 'column' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 200 }}>
            <button
              ref={backRef}
              onClick={() => navigate('/#projects', { state: { filter: project.category } })}
              style={{ ...mono, fontSize: '0.78rem', color: '#909090', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 20px 12px 12px', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F9F3E2')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#909090')}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>←</span>
              <span>Back</span>
            </button>
            <span ref={numRef} style={{ ...mono, fontSize: '0.78rem', color: '#333' }}>
              {pad(project.id)} / {pad(ALL_PROJECTS.length)}
            </span>
          </div>

          <div ref={headRef} style={{ opacity: 0, marginBottom: '32px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 7rem)', fontWeight: 300, lineHeight: 0.9, letterSpacing: '0.002em', color: '#F9F3E2', margin: 0 }}>
              {project.name}
            </h1>
          </div>

          <div ref={metaRef} style={{ opacity: 0, borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '48px' }}>
            {META_FIELDS(project).map(({ label, value }, i) => (
              <div key={label} style={{ padding: '16px 0', borderRight: i % 2 === 0 ? '1px solid #2a2a2a' : 'none', paddingLeft: i % 2 === 0 ? 0 : '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ ...mono, fontSize: '0.72rem', color: '#909090' }}>{label}</span>
                <span style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2' }}>{value}</span>
              </div>
            ))}
          </div>

          <div ref={bodyRef} style={{ opacity: 0, marginBottom: 'auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>

            <div>
              <span style={{ ...mono, fontSize: '0.72rem', color: '#909090', display: 'block', marginBottom: '16px' }}>// overview</span>
              <p style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.85, color: '#F9F3E2', margin: 0, textTransform: 'none' }}>
                {project.overview ?? project.desc}
              </p>
            </div>

            {project.features?.length > 0 && (
              <div>
                <span style={{ ...mono, fontSize: '0.72rem', color: '#909090', display: 'block', marginBottom: '16px' }}>// what it does</span>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {project.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <span style={{ ...mono, fontSize: '0.65rem', color: '#555', flexShrink: 0, paddingTop: '3px' }}>—</span>
                      <span style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)', letterSpacing: '0.02em', lineHeight: 1.7, color: '#c0c0c0', textTransform: 'none' }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.stack && (
              <div>
                <span style={{ ...mono, fontSize: '0.72rem', color: '#909090', display: 'block', marginBottom: '12px' }}>// stack</span>
                <p style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)', letterSpacing: '0.02em', lineHeight: 1.75, color: '#777', margin: 0, textTransform: 'none' }}>
                  {project.stack}
                </p>
              </div>
            )}

            {project.role && (
              <div>
                <span style={{ ...mono, fontSize: '0.72rem', color: '#909090', display: 'block', marginBottom: '12px' }}>// role & context</span>
                <p style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(0.8rem, 1.1vw, 0.9rem)', letterSpacing: '0.02em', lineHeight: 1.75, color: '#c0c0c0', margin: 0, textTransform: 'none' }}>
                  {project.role}
                </p>
              </div>
            )}

            {project.github && (
              <div>
                <span style={{ ...mono, fontSize: '0.72rem', color: '#909090', display: 'block', marginBottom: '10px' }}>// code</span>
                <a
                  href={`https://${project.github}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...mono, fontSize: '0.78rem', color: '#F9F3E2', textDecoration: 'none', borderBottom: '1px solid #333', paddingBottom: '2px', transition: 'border-color 0.2s, color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#bd8589'; e.currentTarget.style.borderColor = '#bd8589' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#F9F3E2'; e.currentTarget.style.borderColor = '#333' }}
                >
                  {project.github} ↗
                </a>
              </div>
            )}

          </div>

          <div ref={navRef} style={{ opacity: 0, borderTop: '1px solid #2a2a2a', marginTop: '64px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
            {prevProject ? (
              <button
                onClick={() => navigate('/projects/' + prevProject.id)}
                style={{ ...mono, fontSize: '0.78rem', color: '#909090', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}
                onMouseEnter={(e) => Array.from(e.currentTarget.children).forEach(c => (c.style.color = '#F9F3E2'))}
                onMouseLeave={(e) => { e.currentTarget.children[0].style.color = '#909090'; e.currentTarget.children[1].style.color = '#555' }}
              >
                <span style={{ color: '#909090' }}>Back</span>
                <span style={{ ...mono, fontSize: '0.72rem', color: '#555' }}>{prevProject.name}</span>
              </button>
            ) : <div />}
            {nextProject ? (
              <button
                onClick={() => navigate('/projects/' + nextProject.id)}
                style={{ ...mono, fontSize: '0.78rem', color: '#909090', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}
                onMouseEnter={(e) => Array.from(e.currentTarget.children).forEach(c => (c.style.color = '#F9F3E2'))}
                onMouseLeave={(e) => { e.currentTarget.children[0].style.color = '#909090'; e.currentTarget.children[1].style.color = '#555' }}
              >
                <span style={{ color: '#909090' }}>Next</span>
                <span style={{ ...mono, fontSize: '0.72rem', color: '#555' }}>{nextProject.name}</span>
              </button>
            ) : <div />}
          </div>

        </div>

        {/* Right — sticky image / mini gallery (desktop only) */}
        {!isMobile && <div ref={imgRef} style={{ opacity: 0, position: 'sticky', top: 0, width: '50vw', height: '100vh', flexShrink: 0, backgroundColor: '#111' }}>
          <img
            ref={currentImgRef}
            src={images[imgIndex]}
            alt={project.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() => { userNavigated.current = true; setImgIndex(i => (i - 1 + images.length) % images.length) }}
                style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontFamily: '"Courier New", Courier, monospace', fontSize: '1rem', color: '#F9F3E2', background: 'rgba(12,12,12,0.55)', border: '1px solid rgba(249,243,226,0.15)', borderRadius: '50%', cursor: 'pointer', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, border-color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(12,12,12,0.85)'; e.currentTarget.style.borderColor = 'rgba(249,243,226,0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(12,12,12,0.55)'; e.currentTarget.style.borderColor = 'rgba(249,243,226,0.15)' }}
              >←</button>

              <button
                onClick={() => { userNavigated.current = true; setImgIndex(i => (i + 1) % images.length) }}
                style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontFamily: '"Courier New", Courier, monospace', fontSize: '1rem', color: '#F9F3E2', background: 'rgba(12,12,12,0.55)', border: '1px solid rgba(249,243,226,0.15)', borderRadius: '50%', cursor: 'pointer', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, border-color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(12,12,12,0.85)'; e.currentTarget.style.borderColor = 'rgba(249,243,226,0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(12,12,12,0.55)'; e.currentTarget.style.borderColor = 'rgba(249,243,226,0.15)' }}
              >→</button>

              <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                {images.map((_, i) => (
                  <div
                    key={i}
                    style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: i === imgIndex ? '#F9F3E2' : 'rgba(249,243,226,0.25)', transition: 'background-color 0.3s' }}
                  />
                ))}
              </div>
            </>
          )}
        </div>}

      </div>
    </div>
  )
}
