import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import Navbar from '../components/layout/Navbar'
import { ALL_PROJECTS, pad } from '../data/projects'

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
}

const META_FIELDS = (p) => [
  { label: '// category', value: p.category },
  { label: '// type',     value: p.type     },
  { label: '// year',     value: p.year     },
  { label: '// status',   value: 'Completed' },
]

export default function ProjectPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const project  = ALL_PROJECTS.find((p) => p.id === Number(id))

  const pageRef = useRef(null)
  const backRef = useRef(null)
  const numRef  = useRef(null)
  const headRef = useRef(null)
  const metaRef = useRef(null)
  const imgRef  = useRef(null)
  const bodyRef = useRef(null)
  const navRef  = useRef(null)

  const prevProject = project ? ALL_PROJECTS.find((p) => p.id === project.id - 1) ?? null : null
  const nextProject = project ? ALL_PROJECTS.find((p) => p.id === project.id + 1) ?? null : null

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!project) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(pageRef.current, { opacity: 0 },              { opacity: 1, duration: 0.3 })
        .fromTo(backRef.current, { opacity: 0, x: -12 },      { opacity: 1, x: 0, duration: 0.6 }, '-=0.1')
        .fromTo(numRef.current,  { opacity: 0 },              { opacity: 1, duration: 0.5 }, '<')
        .fromTo(headRef.current, { opacity: 0, y: 40 },       { opacity: 1, y: 0, duration: 1.0 }, '-=0.3')
        .fromTo(metaRef.current, { opacity: 0 },              { opacity: 1, duration: 0.7 }, '-=0.55')
        .fromTo(imgRef.current,  { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 1.0 }, '-=0.5')
        .fromTo(bodyRef.current, { opacity: 0, y: 20 },       { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
        .fromTo(navRef.current,  { opacity: 0 },              { opacity: 1, duration: 0.5 }, '-=0.3')
    })
    return () => ctx.revert()
  }, [project])

  if (!project) {
    return (
      <div style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ padding: '160px 52px', flex: 1 }}>
          <p style={{ ...mono, fontSize: '0.85rem', color: '#909090' }}>Project not found.</p>
          <button onClick={() => navigate(-1)} style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2', background: 'none', border: 'none', cursor: 'pointer', marginTop: '24px' }}>
            Back
          </button>
        </main>
      </div>
    )
  }

  return (
    <div ref={pageRef} style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', opacity: 0, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ padding: '72px 52px 80px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 60 }}>
          <button
            ref={backRef}
            onClick={() => navigate('/#projects')}
            style={{ ...mono, fontSize: '0.78rem', color: '#909090', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '10px', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
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

        <div ref={headRef} style={{ opacity: 0, marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 9vw, 14rem)', fontWeight: 300, lineHeight: 0.9, letterSpacing: '0.002em', color: '#F9F3E2', margin: 0 }}>
            {project.name}
          </h1>
        </div>

        <div ref={metaRef} style={{ opacity: 0, borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '48px' }}>
          {META_FIELDS(project).map(({ label, value }, i) => (
            <div key={label} style={{ padding: '18px 0', borderRight: i < 3 ? '1px solid #2a2a2a' : 'none', paddingLeft: i === 0 ? 0 : '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ ...mono, fontSize: '0.72rem', color: '#909090' }}>{label}</span>
              <span style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2' }}>{value}</span>
            </div>
          ))}
        </div>

        <div ref={imgRef} style={{ opacity: 0, marginBottom: '48px', display: 'flex', justifyContent: 'center' }}>
          {!project.pageImg && project.imgSmall ? (
            <img src={project.img} alt={project.name} style={{ maxHeight: '520px', width: 'auto', display: 'block', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: project.pageImgRatio ?? '28 / 9', backgroundColor: '#1a1a1a', overflow: 'hidden', position: 'relative' }}>
              <img src={project.pageImg ?? project.img} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
          )}
        </div>

        <div ref={bodyRef} style={{ opacity: 0, maxWidth: '720px', marginBottom: project.gallery?.length ? '48px' : 'auto' }}>
          <span style={{ ...mono, fontSize: '0.85rem', color: '#909090', display: 'block', marginBottom: '20px' }}>// overview</span>
          <p style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 'clamp(1rem, 1.8vw, 1.35rem)', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.75, color: '#F9F3E2', margin: 0, textTransform: 'none' }}>
            {project.desc}
          </p>
        </div>

        {project.gallery?.length > 0 && (
          <div style={{ marginBottom: 'auto', display: 'grid', gridTemplateColumns: `repeat(${project.gallery.length === 4 ? 4 : 3}, 1fr)`, gap: '3px' }}>
            {project.gallery.map((src, i) => (
              <div key={i} style={{ backgroundColor: '#1a1a1a', overflow: 'hidden', aspectRatio: project.gallery.length === 3 ? '4 / 5' : project.gallery.length === 4 ? '4 / 5' : '3 / 2' }}>
                <img
                  src={src}
                  alt={`${project.name} — ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }}
                />
              </div>
            ))}
          </div>
        )}

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

      </main>
    </div>
  )
}
