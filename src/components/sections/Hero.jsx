import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const BORDER_PX = 160

export default function Hero() {
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const textTopRef = useRef(null)
  const textBottomRef = useRef(null)
  const topHalfRef = useRef(null)
  const bottomHalfRef = useRef(null)
  const scrollHintRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const textTop = textTopRef.current
      const textBottom = textBottomRef.current
      const stickyEl = stickyRef.current
      const sectionEl = sectionRef.current
      const topHalf = topHalfRef.current
      const bottomHalf = bottomHalfRef.current
      const scrollHint = scrollHintRef.current
      if (!textTop || !textBottom || !stickyEl || !sectionEl || !topHalf || !bottomHalf) return

      const viewportH = window.innerHeight
      const scrollY = window.scrollY

      const phase1Scroll = viewportH * 0.8
      const phase2Scroll = viewportH * 0.8

      const phase1Progress = Math.min(1, Math.max(0, scrollY / phase1Scroll))
      const phase2Progress = Math.min(1, Math.max(0, (scrollY - phase1Scroll) / phase2Scroll))

      // Phase 1: text rises to center, border shrinks, navbar fades
      const textH = textTop.offsetHeight
      const bottomOffset = 80
      const maxUpward = viewportH / 2 - bottomOffset - textH / 2
      const translateY = -phase1Progress * maxUpward

      textTop.style.transform = `translateY(${translateY}px)`
      textBottom.style.transform = `translateY(${translateY}px)`

      stickyEl.style.borderWidth = `${BORDER_PX * (1 - phase1Progress)}px`

      const navbar = document.getElementById('navbar')
      if (navbar) navbar.style.backgroundColor = `rgba(0,0,0,${1 - phase1Progress})`

      // Phase 2: top half slides up, bottom half slides down
      const halfH = viewportH / 2
      topHalf.style.transform = `translateY(${-phase2Progress * halfH}px)`
      bottomHalf.style.transform = `translateY(${phase2Progress * halfH}px)`

      // Top edge of text element in viewport coordinates (accounts for shrinking border)
      const currentBorder = BORDER_PX * (1 - phase1Progress)
      const textTopViewport = viewportH - currentBorder - bottomOffset - textH + translateY

      // Visible bottom edge of top half and visible top edge of bottom half, in viewport Y
      const topHalfEnd = halfH * (1 - phase2Progress)
      const bottomHalfStart = halfH * (1 + phase2Progress)

      // Convert to the text element's local coordinate space for clip-path
      const topCutY = topHalfEnd - textTopViewport
      const bottomCutY = bottomHalfStart - textTopViewport

      // Top copy: reveal only the slice overlapping the top image half
      textTop.style.clipPath = `polygon(0 0, 100% 0, 100% ${topCutY}px, 0 ${topCutY}px)`
      // Bottom copy: reveal only the slice overlapping the bottom image half
      textBottom.style.clipPath = `polygon(0 ${bottomCutY}px, 100% ${bottomCutY}px, 100% 100%, 0 100%)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const textInner = (
    <div className="w-fit mx-auto flex flex-col">
      <h1 className="text-[clamp(5rem,14vw,25rem)] text-center font-light leading-[0.88] tracking-[0.02em] text-[#F9F3E2]">
        Erisa Zaimi
      </h1>
      <div className="flex justify-between items-center pt-4 pb-6 px-10">
        <span className="text-[1rem] font-medium tracking-[0.12em] uppercase text-[#F9F3E2]">Developer &amp; Designer</span>
        <span className="text-[1rem] font-medium tracking-[0.12em] uppercase text-[#F9F3E2]">Based in Germany</span>
        <span className="text-[1rem] font-medium tracking-[0.12em] uppercase text-[#F9F3E2]">Available for Projects</span>
        <span className="text-[1rem] font-medium tracking-[0.12em] uppercase text-[#F9F3E2]">erisa.zaimi2@mail.com</span>
      </div>
    </div>
  )

  return (
    // 100vh sticky + 80vh phase1 + 80vh phase2 + 20vh buffer = 280vh
    <section ref={sectionRef} id="hero" className="relative h-[280vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen border-black"
        style={{ borderWidth: `${BORDER_PX}px`, borderStyle: 'solid' }}
      >
        {/* Clipping wrapper so image halves don't bleed outside the content area */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Cream page revealed as the image halves slide apart */}
          <div className="absolute inset-0 bg-[#F9F3E2] flex items-center justify-center">
            <img src="/images/tv.png" alt="" className="w-[60%] object-contain" />
          </div>

          {/* Top half */}
          <div
            ref={topHalfRef}
            className="absolute top-0 left-0 right-0"
            style={{ height: '50%', overflow: 'hidden', willChange: 'transform' }}
          >
            <div
              className="absolute top-0 left-0 right-0 bg-cover bg-center bg-[#1a1a1a] grayscale-25"
              style={{ backgroundImage: "url('/images/bg-p.png')", height: '200%' }}
            />
          </div>

          {/* Bottom half */}
          <div
            ref={bottomHalfRef}
            className="absolute bottom-0 left-0 right-0"
            style={{ height: '50%', overflow: 'hidden', willChange: 'transform' }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-cover bg-center bg-[#1a1a1a] grayscale-25"
              style={{ backgroundImage: "url('/images/bg-p.png')", height: '200%' }}
            />
          </div>
        </div>

        {/* Text copy clipped to the top image half */}
        <div
          ref={textTopRef}
          className="absolute bottom-20 w-full"
          style={{ willChange: 'transform' }}
        >
          {textInner}
        </div>

        {/* Text copy clipped to the bottom image half */}
        <div
          ref={textBottomRef}
          className="absolute bottom-20 w-full"
          style={{ willChange: 'transform' }}
        >
          {textInner}
        </div>
      </div>

      {createPortal(
        <div
          ref={scrollHintRef}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-50 bg-black mix-blend-difference"
        >
          <span className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-white">Scroll to explore</span>
          <svg
            className="animate-bounce text-white"
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>,
        document.body
      )}
    </section>
  )
}
