const linkClass = 'text-white text-[14px] tracking-wide uppercase font-light no-underline hover:opacity-50 transition-opacity duration-200'

export default function Navbar() {
  return (
    <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center gap-40 px-10 py-8 bg-black mix-blend-difference">
      <a href="#about" className={linkClass}>About Me</a>
      <a href="#works" className={linkClass}>Works</a>
      <a href="#contact" className={linkClass}>Contact</a>
    </nav>
  )
}
