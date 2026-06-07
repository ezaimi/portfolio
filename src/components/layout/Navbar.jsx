import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const lc = 'text-[#F9F3E2] text-[13px] min-[1400px]:text-[15px] tracking-wide uppercase font-light no-underline hover:opacity-50 transition-opacity duration-200 font-mono'

const QUICK_LINKS = [
  { label: 'GitHub',      href: 'https://github.com/ezaimi',        icon: '↗', external: true  },
  { label: 'LinkedIn',    href: 'https://www.linkedin.com/in/erisazaimi/', icon: '↗', external: true  },
  { label: 'Email',       href: 'mailto:erisazaimi22@gmail.com',    icon: '→'                  },
]

const NAV_LINKS = [
  { label: 'Home',     to: '/'        },
  { label: 'About',    to: '/about'   },
  { label: 'Works',    to: '/works'   },
  { label: 'Contact',  to: '/contact' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef(null)
  const triggerRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const desktopNavRef = useRef(null)
  const mobileNavRef  = useRef(null)

  useEffect(() => {
    if (window.__loaderDone) return
    const els = [desktopNavRef.current, mobileNavRef.current].filter(Boolean)
    gsap.set(els, { opacity: 0, y: -14 })
    const onDone = () => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0 })
    window.addEventListener('loader:done', onDone, { once: true })
    return () => window.removeEventListener('loader:done', onDone)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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
      {/* Desktop nav */}
      <nav ref={desktopNavRef} id="navbar" className="fixed top-0 left-0 right-0 z-50 hidden min-[600px]:flex justify-center items-center py-8 lg:py-6 xl:py-8 bg-black mix-blend-difference">
        <div className="grid w-[min(78%,32rem)] min-[900px]:w-[42rem] grid-cols-3 items-center justify-items-center">
          <div>{leftLink}</div>
          <div>{midLink}</div>
          <div>{rightLink}</div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div ref={mobileNavRef} id="navbar" className="fixed top-0 left-0 right-0 z-50 flex min-[600px]:hidden items-center px-6 py-6 bg-black mix-blend-difference">
        <div className="flex-1" />
        <span className="text-[#F9F3E2] text-[12px] tracking-[0.3em] uppercase font-mono">Erisa Zaimi</span>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="flex flex-col justify-center items-end gap-[5px] w-8 h-8"
            aria-label="Toggle menu"
          >
            <span className={`block h-[1.5px] w-6 bg-[#F9F3E2] transition-all duration-300 ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] w-6 bg-[#F9F3E2] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-6 bg-[#F9F3E2] transition-all duration-300 ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-10 bg-black min-[600px]:hidden"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        {NAV_LINKS.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className="text-[#F9F3E2] text-[2rem] font-light tracking-[0.15em] uppercase font-mono no-underline hover:opacity-50 transition-opacity duration-200"
          >
            {label}
          </Link>
        ))}
        <div className="mt-8 flex flex-col items-center gap-4">
          {QUICK_LINKS.map(({ label, href, icon, download, external }) => (
            <a
              key={label}
              href={href}
              {...(download ? { download: true } : {})}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="text-[#F9F3E2]/60 text-[0.75rem] tracking-[0.18em] uppercase font-mono no-underline hover:text-[#F9F3E2] transition-colors duration-200 flex gap-3"
            >
              <span>{label}</span>
              <span className="opacity-60">{icon}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Desktop dropdown */}
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
