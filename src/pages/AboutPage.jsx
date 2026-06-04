import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Navbar from '../components/layout/Navbar'

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: '0.85rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
}

const EXPERIENCE = [
  { role: 'Internship',                  company: 'Vodafone',       years: 'May 2022 – June 2022' },
  { role: 'Freelance Full-Stack Developer', company: 'Self-employed', years: '2022 – 2025' },
  { role: 'Visual Designer',             company: 'Studit',         years: '2025 – 2026' },
]

const EDUCATION = [
  { num: '01', degree: 'B.Sc.', field: 'Software Engineering', years: '2021 – 2024' },
  { num: '02', degree: 'M.Sc.', field: 'Web Engineering',      years: '2024 – 2026' },
]

const FOCUS = [
  'Web Development',
  'UI / UX Design',
  'Frontend Systems',
  'Design Systems',
]

export default function AboutPage() {
  const pageRef     = useRef(null)
  const headRef     = useRef(null)
  const metaRef     = useRef(null)
  const portraitRef = useRef(null)
  const bioRef      = useRef(null)
  const expRef      = useRef(null)
  const eduRef      = useRef(null)
  const focusRef    = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(pageRef.current,     { opacity: 0 },              { opacity: 1, duration: 0.35 })
        .fromTo(headRef.current,     { opacity: 0, y: 40 },       { opacity: 1, y: 0, duration: 1.0 },       '-=0.15')
        .fromTo(metaRef.current,     { opacity: 0 },              { opacity: 1, duration: 0.7 },              '-=0.6')
        .fromTo(portraitRef.current, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.1 },   '-=0.5')
        .fromTo(bioRef.current,      { opacity: 0, x: -16 },      { opacity: 1, x: 0, duration: 0.8 },       '-=0.9')
        .fromTo(expRef.current,      { opacity: 0, y: 14 },       { opacity: 1, y: 0, duration: 0.7 },       '-=0.5')
        .fromTo(eduRef.current,      { opacity: 0, y: 14 },       { opacity: 1, y: 0, duration: 0.7 },       '-=0.55')
        .fromTo(focusRef.current,    { opacity: 0 },              { opacity: 1, duration: 0.6 },              '-=0.4')
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={pageRef}
      style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', opacity: 0 }}
    >
      <Navbar />

      <main style={{ padding: '80px 52px 80px' }}>

        {/* Heading */}
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
            About.
          </h1>
        </div>

        {/* Meta bar */}
        <div
          ref={metaRef}
          style={{
            opacity: 0,
            borderTop: '1px solid #2a2a2a',
            paddingTop: '10px',
            marginBottom: '3px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '36px' }}>
            <span style={{ ...mono, color: '#aaa' }}>Based in Germany</span>
            <span style={{ ...mono, color: '#aaa' }}>CET (GMT +1)</span>
          </div>
          <span style={{ ...mono, color: '#999' }}>Available for new projects</span>
        </div>

        {/* Portrait + Bio */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40fr 60fr',
            borderTop: '1px solid #2a2a2a',
            marginBottom: '3px',
          }}
        >
          {/* Portrait */}
          <div
            ref={portraitRef}
            style={{
              opacity: 0,
              position: 'relative',
              overflow: 'hidden',
              height: '60vh',
              minHeight: '400px',
            }}
          >
            <img
              src="/images/old.png"
              alt="Erisa Zaimi"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 50%, rgba(12,12,12,0.9) 100%)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ ...mono, fontSize: '0.72rem', color: '#F9F3E2', opacity: 0.75 }}>Hi, it's me!</span>
              <span style={{ ...mono, fontSize: '0.72rem', color: '#F9F3E2', opacity: 0.55 }}>Germany, 2025</span>
            </div>
          </div>

          {/* Bio */}
          <div
            ref={bioRef}
            style={{
              opacity: 0,
              borderLeft: '1px solid #2a2a2a',
              padding: '36px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '36px',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ ...mono, color: '#909090' }}>// currently</span>
              <p
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  color: '#F9F3E2',
                  margin: 0,
                  letterSpacing: '0.04em',
                  textTransform: 'none',
                }}
              >
                Full-stack developer with a strong eye for UI/UX and visual design.
                I build polished digital products from backend logic to beautiful user interfaces.
              </p>
              <p
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  color: '#999',
                  margin: 0,
                  letterSpacing: '0.04em',
                  textTransform: 'none',
                }}
              >
                Open to full-time opportunities and freelance.
              </p>
            </div>

            <div style={{ height: '1px', backgroundColor: '#2a2a2a' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ ...mono, color: '#909090' }}>// stack</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GSAP', 'Figma', 'PostgreSQL', 'Python', 'Git', 'Framer', 'After Effects'].map((s) => (
                  <span
                    key={s}
                    style={{
                      ...mono,
                      fontSize: '0.78rem',
                      color: '#F9F3E2',
                      border: '1px solid #3a3a3a',
                      padding: '3px 12px',
                      borderRadius: '1px',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience + Education */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            border: '1px solid #2a2a2a',
            marginBottom: '3px',
          }}
        >
          <div
            ref={expRef}
            style={{
              opacity: 0,
              borderRight: '1px solid #2a2a2a',
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <span style={{ ...mono, color: '#909090' }}>// experience</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {EXPERIENCE.map(({ role, company, years }, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ ...mono, color: '#F9F3E2' }}>{role}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ ...mono, color: '#999' }}>{company}</span>
                    <span style={{ ...mono, color: '#999', whiteSpace: 'nowrap' }}>{years}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={eduRef}
            style={{
              opacity: 0,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <span style={{ ...mono, color: '#909090' }}>// education</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {EDUCATION.map(({ num, degree, field, years }) => (
                <div key={num} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '24px 46px 1fr', alignItems: 'center', gap: '0 10px' }}>
                    <span style={{ ...mono, color: '#888' }}>{num}</span>
                    <span style={{ ...mono, color: '#F9F3E2' }}>{degree}</span>
                    <span style={{ ...mono, color: '#F9F3E2' }}>{field}</span>
                  </div>
                  <div style={{ paddingLeft: '24px' }}>
                    <span style={{ ...mono, color: '#999' }}>{years}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Focus */}
        <div
          ref={focusRef}
          style={{
            opacity: 0,
            border: '1px solid #2a2a2a',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <span style={{ ...mono, color: '#909090' }}>// focus</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {FOCUS.map((s) => (
              <span
                key={s}
                style={{
                  ...mono,
                  color: '#F9F3E2',
                  border: '1px solid #3a3a3a',
                  padding: '3px 14px',
                  borderRadius: '1px',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ ...mono, fontSize: '0.55rem', color: '#333' }}>© 2025 Erisa Zaimi</span>
        </div>
      </main>
    </div>
  )
}
