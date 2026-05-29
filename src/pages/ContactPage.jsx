import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Navbar from '../components/layout/Navbar'

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
}

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
  { label: 'Dribbble', href: 'https://dribbble.com/' },
]

const LOOKING_FOR = [
  'Good problems',
  'Creative work',
  'Early-stage products',
  'Interesting tech',
]

export default function ContactPage() {
  const pageRef   = useRef(null)
  const headRef   = useRef(null)
  const metaRef   = useRef(null)
  const emailRef  = useRef(null)
  const gridRef   = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(pageRef.current,  { opacity: 0 },        { opacity: 1, duration: 0.35 })
        .fromTo(headRef.current,  { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.0 }, '-=0.15')
        .fromTo(metaRef.current,  { opacity: 0 },        { opacity: 1, duration: 0.7 }, '-=0.6')
        .fromTo(emailRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.55')
        .fromTo('.contact-col',   { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7 }, '-=0.5')
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={pageRef}
      style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', opacity: 0, display: 'flex', flexDirection: 'column' }}
    >
      <Navbar />

      <main style={{ padding: '120px 52px 60px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* ── Heading ── */}
        <div ref={headRef} style={{ opacity: 0 }}>
          <h1
            style={{
              fontSize: 'clamp(5rem, 14vw, 25rem)',
              fontWeight: 300,
              lineHeight: 0.88,
              letterSpacing: '0.002em',
              margin: '0 0 20px',
              color: '#F9F3E2',
            }}
          >
            Let's talk.
          </h1>
        </div>

        {/* ── Meta bar ── */}
        <div
          ref={metaRef}
          style={{
            opacity: 0,
            borderTop: '1px solid rgba(249,243,226,0.1)',
            paddingTop: '12px',
            marginBottom: '48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ ...mono, fontSize: '0.78rem', color: '#aaa' }}>
            Available for new work
          </span>
          <span style={{ ...mono, fontSize: '0.78rem', color: '#aaa' }}>
            Germany · CET (GMT+1)
          </span>
        </div>

        {/* ── Big email link ── */}
        <div ref={emailRef} style={{ opacity: 0, marginBottom: '60px' }}>
          <a
            href="mailto:erisa.zaimi2@mail.com"
            style={{
              display: 'inline-block',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 'clamp(1.4rem, 3.5vw, 3.2rem)',
              fontWeight: 400,
              letterSpacing: '0.03em',
              color: '#F9F3E2',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(249,243,226,0.2)',
              paddingBottom: '6px',
              transition: 'color 0.25s ease, border-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(249,243,226,0.45)'
              e.currentTarget.style.borderBottomColor = 'rgba(249,243,226,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#F9F3E2'
              e.currentTarget.style.borderBottomColor = 'rgba(249,243,226,0.2)'
            }}
          >
            erisa.zaimi2@mail.com ↗
          </a>
        </div>

        {/* ── Spacer pushes grid toward bottom ── */}
        <div style={{ flex: 1 }} />

        {/* ── 4-column info grid ── */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            border: '1px solid #2a2a2a',
          }}
        >
          {/* Looking for */}
          <div
            className="contact-col"
            style={{
              opacity: 0,
              borderRight: '1px solid #2a2a2a',
              padding: '24px 26px 30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <span style={{ ...mono, fontSize: '0.85rem', color: '#909090' }}>// looking for</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {LOOKING_FOR.map((s) => (
                <span key={s} style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div
            className="contact-col"
            style={{
              opacity: 0,
              borderRight: '1px solid #2a2a2a',
              padding: '24px 26px 30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <span style={{ ...mono, fontSize: '0.85rem', color: '#909090' }}>// connect</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...mono,
                    fontSize: '0.85rem',
                    color: '#999',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F9F3E2')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
                >
                  {label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div
            className="contact-col"
            style={{
              opacity: 0,
              borderRight: '1px solid #2a2a2a',
              padding: '24px 26px 30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <span style={{ ...mono, fontSize: '0.85rem', color: '#909090' }}>// availability</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <span style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2' }}>Freelance</span>
              <span style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2' }}>Full-time</span>
              <span style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2' }}>Contract</span>
            </div>
          </div>

          {/* Status */}
          <div
            className="contact-col"
            style={{
              opacity: 0,
              padding: '24px 26px 30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <span style={{ ...mono, fontSize: '0.85rem', color: '#909090' }}>// status</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#4ade80',
                    flexShrink: 0,
                  }}
                />
                <span style={{ ...mono, fontSize: '0.85rem', color: '#F9F3E2' }}>Open to work</span>
              </div>
              <span style={{ ...mono, fontSize: '0.72rem', color: '#909090' }}>Response within 48h</span>
            </div>
          </div>
        </div>

        {/* ── Footer line ── */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ ...mono, fontSize: '0.72rem', color: '#666' }}>
            © 2025 Erisa Zaimi
          </span>
        </div>
      </main>
    </div>
  )
}
