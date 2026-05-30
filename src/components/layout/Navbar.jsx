import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const lc = 'text-[#F9F3E2] text-[14px] tracking-wide uppercase font-light no-underline hover:opacity-50 transition-opacity duration-200 font-mono'

const QUICK_LINKS = [
  { label: 'CV / Resume', href: '/cv.pdf',                          icon: '↓', download: true  },
  { label: 'GitHub',      href: 'https://github.com/',              icon: '↗', external: true  },
  { label: 'LinkedIn',    href: 'https://linkedin.com/in/',         icon: '↗', external: true  },
  { label: 'Email',       href: 'mailto:erisa.zaimi2@mail.com',     icon: '→'                  },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(null)
  const triggerRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, right: 0 })

  const handleEnter = () => {
    clearTimeout(closeTimer.current)
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 10, right: window.innerWidth - r.right })
    }
    setOpen(true)
  }

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  const isProjectPage = pathname.startsWith('/projects/')

  const leftLink = pathname === '/'
    ? <Link to="/about" className={lc}>About Me</Link>
    : <Link to="/" className={lc}>{isProjectPage ? 'Home' : '← Home'}</Link>

  const midLink = (pathname === '/works' || pathname === '/contact')
    ? <Link to="/about" className={lc}>About Me</Link>
    : <Link to="/works" className={lc}>Works</Link>

  const rightLink = pathname === '/contact'
    ? <Link to="/works" className={lc}>Works</Link>
    : (
      <div ref={triggerRef} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <Link to="/contact" className={lc}>Contact</Link>
      </div>
    )

  return (
    <>
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center gap-40 px-10 py-8 lg:py-6 xl:py-8 bg-black mix-blend-difference">
        {leftLink}
        {midLink}
        {rightLink}
      </nav>

      {/* Dropdown rendered outside the blended nav so mix-blend-difference doesn't apply */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'fixed',
          top: pos.top,
          right: pos.right,
          zIndex: 100,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
          backgroundColor: '#0d0d0d',
          border: '1px solid #222',
          minWidth: '168px',
          padding: '8px 0',
        }}
      >
        {QUICK_LINKS.map(({ label, href, icon, download, external }) => (
          <a
            key={label}
            href={href}
            {...(download ? { download: true } : {})}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 20px',
              textDecoration: 'none',
              color: '#F9F3E2',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontFamily: '"Courier New", Courier, monospace',
              transition: 'color 0.16s',
              gap: '24px',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#F9F3E2' }}
          >
            <span>{label}</span>
            <span style={{ opacity: 0.6, fontSize: '0.82rem' }}>{icon}</span>
          </a>
        ))}
      </div>
    </>
  )
}
