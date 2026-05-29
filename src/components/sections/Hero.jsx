import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function AnimatedWords({ words, charClassName, charStyle, gap = '0.2em', triggerRef: externalTriggerRef, autoTrigger = true }) {
  const containerRef = useRef(null)

  const runIntro = () => {
    const el = containerRef.current
    if (!el) return
    const chars = el.querySelectorAll('[data-char]')
    chars.forEach((char, i) => {
      setTimeout(() => {
        char.classList.remove('char-animating')
        void char.offsetWidth
        char.classList.add('char-animating')
        char.addEventListener('animationend', () => char.classList.remove('char-animating'), { once: true })
      }, i * 60)
    })
  }

  useEffect(() => {
    if (externalTriggerRef) externalTriggerRef.current = runIntro
    if (autoTrigger) runIntro()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const triggerChar = (span) => {
    span.classList.remove('char-animating')
    void span.offsetWidth
    span.classList.add('char-animating')
    span.addEventListener('animationend', () => span.classList.remove('char-animating'), { once: true })
  }

  return (
    <div ref={containerRef} className="flex" style={{ gap }}>
      {words.map((word, wi) => (
        <div key={wi} className="flex">
          {[...word].map((ch, ci) => (
            <div
              key={ci}
              className="overflow-hidden"
              style={{ lineHeight: 0.88, cursor: 'default' }}
              onMouseEnter={(e) => triggerChar(e.currentTarget.querySelector('[data-char]'))}
            >
              <span
                data-char
                className={`block ${charClassName}`}
                style={charStyle}
              >
                {ch}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const getBorderPx = () => window.innerWidth >= 1024 ? 150 : 20
const FRAME_COUNT = 62
const frameSrc = (i) => {
  if (i === 61) return '/images/tv2.png'
  if (i === 62) return '/images/tvshadow.png'
  return `/frames/tv-frame-${String(i).padStart(4, '0')}.webp`
}

// TV screen region as fractions of canvas dimensions
const SCREEN  = { x: 0.27, y: 0.16, w: 0.44, h: 0.55 }
const FLICKER = { x: 0.27, y: 0.20, w: 0.44, h: 0.55 }

const SUBTITLE_LINES = [
  { text: 'First workstation, 2004.', italic: false },
  { text: 'Started early. Still waiting for the computer to finish booting.', italic: false },
  { text: 'Obviously, 20 years of experience.', italic: false },
]

export default function Hero() {
  const borderPxRef      = useRef(getBorderPx())
  const sectionRef       = useRef(null)
  const stickyRef        = useRef(null)
  const textTopRef       = useRef(null)
  const textBottomRef    = useRef(null)
  const topHalfRef       = useRef(null)
  const bottomHalfRef    = useRef(null)
  const scrollHintRef    = useRef(null)
  const canvasRef        = useRef(null)
  const imagesRef        = useRef([])
  const headerRef        = useRef(null)
  const subtitleRef      = useRef(null)
  const typewriterTimerRef = useRef(null)
  const tvGroupRef              = useRef(null)
  const heroBgRef               = useRef(null)
  const originStoryTriggerRef   = useRef(null)
  const subtitlesDoneRef    = useRef(false)
  const scrollLockedRef     = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    // --- youngme image ---
    const youngMeImg = new Image()
    youngMeImg.src = '/images/youngme.png'

    // --- offscreen canvas for animated noise ---
    const noiseOffscreen = document.createElement('canvas')
    noiseOffscreen.width  = 256
    noiseOffscreen.height = 256
    const noiseCtx = noiseOffscreen.getContext('2d')

    const updateNoise = () => {
      const { width: w, height: h } = noiseOffscreen
      const imageData = noiseCtx.createImageData(w, h)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 220
      }
      noiseCtx.putImageData(imageData, 0, 0)
    }

    // --- transition state (GSAP animates these values) ---
    const ts = { black: 0, noise: 0, scan: 0, brightness: 0, rgb: 0 }

    const drawEffects = (sx, sy, sw, sh) => {
      // 1. Black flicker / dim
      if (ts.black > 0) {
        ctx.save()
        ctx.globalAlpha = ts.black
        ctx.fillStyle = '#000'
        ctx.fillRect(sx, sy, sw, sh)
        ctx.restore()
      }
      // 2. Noise (screened over content)
      if (ts.noise > 0) {
        updateNoise()
        ctx.save()
        ctx.globalAlpha = ts.noise
        ctx.globalCompositeOperation = 'screen'
        ctx.drawImage(noiseOffscreen, sx, sy, sw, sh)
        ctx.restore()
      }
      // 3. Horizontal scanlines
      if (ts.scan > 0) {
        ctx.save()
        ctx.globalAlpha = ts.scan * 0.25
        ctx.fillStyle = '#fff'
        for (let y = sy; y < sy + sh; y += 6) ctx.fillRect(sx, y + 4, sw, 2)
        ctx.restore()
      }
      // 4. Brightness flash
      if (ts.brightness > 0) {
        ctx.save()
        ctx.globalAlpha = ts.brightness
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = '#fff'
        ctx.fillRect(sx, sy, sw, sh)
        ctx.restore()
      }
      // 5. RGB channel separation
      if (ts.rgb > 0) {
        ctx.save()
        ctx.globalAlpha = ts.rgb
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = 'rgb(255,20,20)'
        ctx.fillRect(sx + 4, sy, sw, sh)
        ctx.fillStyle = 'rgb(20,255,255)'
        ctx.fillRect(sx - 4, sy, sw, sh)
        ctx.restore()
      }
    }

    // --- main draw function ---
    const drawFrame = (progress) => {
      const p   = lockedProgressRef.current ?? progress
      const idx = Math.round(Math.max(0, Math.min(1, p)) * (FRAME_COUNT - 1))
      const img = imagesRef.current[idx]
      if (!img?.complete || img.naturalWidth === 0) return

      const sx = canvas.width  * SCREEN.x
      const sy = canvas.height * SCREEN.y
      const sw = canvas.width  * SCREEN.w
      const sh = canvas.height * SCREEN.h

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (idx === FRAME_COUNT - 1) {
        // Layer 1: youngme photo
        if (youngMeImg.complete && youngMeImg.naturalWidth > 0) {
          const scale = Math.min(sw / youngMeImg.naturalWidth, sh / youngMeImg.naturalHeight)
          const yw = youngMeImg.naturalWidth  * scale
          const yh = youngMeImg.naturalHeight * scale
          ctx.drawImage(youngMeImg, sx + (sw - yw) / 2, sy + (sh - yh) / 2 + sh * 0.12, yw, yh)
        }
        // Layer 2: transition effects (above photo, below TV frame)
        drawEffects(
          canvas.width  * FLICKER.x,
          canvas.height * FLICKER.y,
          canvas.width  * FLICKER.w,
          canvas.height * FLICKER.h,
        )
      }

      // Layer 3: TV frame (transparent screen reveals layers below)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    // --- overlay (header + subtitle) shown when frame 62 is reached ---
    const startTypewriter = () => {
      const el = subtitleRef.current
      if (!el) return
      if (typewriterTimerRef.current) clearTimeout(typewriterTimerRef.current)
      el.innerHTML = ''

      const lineEls = SUBTITLE_LINES.map(({ italic }) => {
        const div = document.createElement('div')
        if (italic) {
          div.style.fontStyle = 'italic'
          div.style.fontWeight = '200'
          div.style.marginTop = '1.2em'
        } else {
          div.style.textTransform = 'uppercase'
        }
        el.appendChild(div)
        return div
      })

      let lineIdx = 0
      let charIdx = 0

      const UNLOCK_AFTER = 17 // "First workstation" — first two words of line 0

      const onComplete = () => {
        subtitlesDoneRef.current = true
        if (scrollHintRef.current) scrollHintRef.current.style.opacity = '1'
      }

      const tick = () => {
        const { text } = SUBTITLE_LINES[lineIdx]
        if (charIdx < text.length) {
          lineEls[lineIdx].textContent += text[charIdx]
          charIdx++
          if (lineIdx === 0 && charIdx === UNLOCK_AFTER) scrollLockedRef.current = false
          typewriterTimerRef.current = setTimeout(tick, 38)
        } else {
          lineIdx++
          charIdx = 0
          if (lineIdx < SUBTITLE_LINES.length) {
            typewriterTimerRef.current = setTimeout(tick, 120)
          } else {
            onComplete()
          }
        }
      }
      tick()
    }

    const showOverlay = () => {
      const header   = headerRef.current
      const subtitle = subtitleRef.current
      if (!header || !subtitle) return
      if (typewriterTimerRef.current) clearTimeout(typewriterTimerRef.current)
      if (subtitle) subtitle.innerHTML = ''

      gsap.fromTo(header,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', onStart: () => originStoryTriggerRef.current?.() }
      )
      gsap.fromTo(subtitle,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, delay: 0.15, ease: 'power2.out', onComplete: startTypewriter }
      )
    }

    const hideOverlay = () => {
      subtitlesDoneRef.current = false
      scrollLockedRef.current = false
      if (typewriterTimerRef.current) clearTimeout(typewriterTimerRef.current)
      const header   = headerRef.current
      const subtitle = subtitleRef.current
      if (header)   gsap.set(header,   { opacity: 0, y: -10 })
      if (subtitle) { gsap.set(subtitle, { opacity: 0 }); subtitle.innerHTML = '' }
    }

    // --- channel-switch GSAP transition ---
    const phase3ProgressRef = { current: 0 }
    const activeChannelRef  = { current: 0 }
    const currentTl         = { current: null }
    const lockedProgressRef = { current: null } // non-null while transition plays

    const triggerTransition = (toChannel) => {
      if (currentTl.current) currentTl.current.kill()
      if (toChannel === 1) scrollLockedRef.current = true
      lockedProgressRef.current = 1.0 // freeze canvas at frame 62 for both directions
      Object.assign(ts, { black: 1, noise: 0, scan: 0, brightness: 0, rgb: 0 })

      const redraw = () => drawFrame(phase3ProgressRef.current)
      const tl = gsap.timeline({
        onUpdate: redraw,
        onComplete: () => {
          lockedProgressRef.current = null
          redraw()
          if (toChannel === 1) showOverlay()
        },
      })
      currentTl.current = tl

      // A: CRT arc flicker
      tl.to(ts, { black: 0.25, duration: 0.04, ease: 'none' })
        .to(ts, { black: 0.9,  duration: 0.03, ease: 'none' })
        .to(ts, { black: 0.05, duration: 0.04, ease: 'none' })
      // B: Static noise + scanlines
      tl.to(ts, { noise: 0.8, duration: 0.06, ease: 'none' }, '-=0.02')
      tl.to(ts, { scan:  1,   duration: 0.05, ease: 'none' }, '<')
      tl.to(ts, { black: 0,   duration: 0.04, ease: 'none' })
      // C: Brightness surge + RGB split
      tl.to(ts, { brightness: 0.35, duration: 0.04, ease: 'none' })
        .to(ts, { brightness: 0,    duration: 0.04, ease: 'none' })
      tl.to(ts, { rgb: 0.35, duration: 0.04, ease: 'none' }, '-=0.02')
        .to(ts, { rgb: 0,    duration: 0.04, ease: 'none' })
      // D: Deep dim
      tl.to(ts, { black: 0.9, duration: 0.07, ease: 'none' })
      // E: Reveal
      tl.to(ts, { black: 0, duration: 0.14, ease: 'power2.out' })
      tl.to(ts, { noise: 0, duration: 0.12, ease: 'power2.out' }, '-=0.10')
      tl.to(ts, { scan:  0, duration: 0.12, ease: 'power2.out' }, '<')
    }

    // --- preload frames ---
    imagesRef.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image()
      img.src = frameSrc(i + 1)
      if (i === 0) img.onload = () => {
        canvas.width  = img.naturalWidth
        canvas.height = img.naturalHeight
        drawFrame(0)
      }
      return img
    })

    // --- scroll handler ---
    const onScroll = () => {
      const textTop    = textTopRef.current
      const textBottom = textBottomRef.current
      const stickyEl   = stickyRef.current
      const sectionEl  = sectionRef.current
      const topHalf    = topHalfRef.current
      const bottomHalf = bottomHalfRef.current
      if (!textTop || !textBottom || !stickyEl || !sectionEl || !topHalf || !bottomHalf) return

      const viewportH = window.innerHeight
      const scrollY   = window.scrollY

      const phase1Scroll = viewportH * 0.8
      const phase2Scroll = viewportH * 0.8
      const phase3Scroll = viewportH * 1.5

      const phase1Progress = Math.min(1, Math.max(0, scrollY / phase1Scroll))
      const phase2Progress = Math.min(1, Math.max(0, (scrollY - phase1Scroll) / phase2Scroll))
      const phase3Start    = phase1Scroll + phase2Scroll * 0.3
      const phase3Progress = Math.min(1, Math.max(0, (scrollY - phase3Start) / phase3Scroll))

      // Phase 1: text rises, border shrinks, navbar fades
      const textH       = textTop.offsetHeight
      const bottomOffset = 80
      const maxUpward   = viewportH / 2 - bottomOffset - textH / 2
      const translateY  = -phase1Progress * maxUpward

      textTop.style.transform    = `translateY(${translateY}px)`
      textBottom.style.transform = `translateY(${translateY}px)`
      stickyEl.style.borderWidth = `${borderPxRef.current * (1 - phase1Progress)}px`

      const navbar = document.getElementById('navbar')
      if (navbar) navbar.style.backgroundColor = `rgba(0,0,0,${1 - phase1Progress})`

      // Phase 2: halves split apart
      const halfH = viewportH / 2
      topHalf.style.transform    = `translateY(${-phase2Progress * halfH}px)`
      bottomHalf.style.transform = `translateY(${phase2Progress * halfH}px)`

      const currentBorder    = borderPxRef.current * (1 - phase1Progress)
      const textTopViewport  = viewportH - currentBorder - bottomOffset - textH + translateY
      const topHalfEnd       = halfH * (1 - phase2Progress)
      const bottomHalfStart  = halfH * (1 + phase2Progress)

      textTop.style.clipPath    = `polygon(0 0, 100% 0, 100% ${topHalfEnd - textTopViewport}px, 0 ${topHalfEnd - textTopViewport}px)`
      textBottom.style.clipPath = `polygon(0 ${bottomHalfStart - textTopViewport}px, 100% ${bottomHalfStart - textTopViewport}px, 100% 100%, 0 100%)`

      // Phase 3: advance frame sequence + detect channel switch
      phase3ProgressRef.current = phase3Progress
      drawFrame(phase3Progress)

      const frameIdx = Math.round(phase3Progress * (FRAME_COUNT - 1))
      const scrollHint = scrollHintRef.current
      const pastSticky = scrollY > sectionEl.offsetHeight - viewportH
      if (scrollHint) scrollHint.style.opacity = (pastSticky || (frameIdx >= 60 && !subtitlesDoneRef.current)) ? '0' : '1'

      const newChannel = frameIdx === FRAME_COUNT - 1 ? 1 : 0
      if (newChannel !== activeChannelRef.current) {
        if (newChannel === 0) hideOverlay()
        activeChannelRef.current = newChannel
        triggerTransition(newChannel)
      }

    }

    const preventScroll = (e) => { if (scrollLockedRef.current) e.preventDefault() }
    const preventScrollKey = (e) => {
      if (!scrollLockedRef.current) return
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) e.preventDefault()
    }

    const updateBorderPx = () => {
      borderPxRef.current = getBorderPx()
      if (stickyRef.current) stickyRef.current.style.borderWidth = `${borderPxRef.current}px`
    }
    updateBorderPx()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventScrollKey)
    window.addEventListener('resize', updateBorderPx)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventScrollKey)
      window.removeEventListener('resize', updateBorderPx)
      currentTl.current?.kill()
      if (typewriterTimerRef.current) clearTimeout(typewriterTimerRef.current)
    }
  }, [])


  const textInner = (
    <div className="w-fit mx-auto flex flex-col">
      <AnimatedWords
        words={['Erisa', 'Zaimi']}
        charClassName="text-[clamp(5rem,14vw,25rem)] font-light leading-[0.88] tracking-[0.06em] text-[#F9F3E2]"
        gap="3.5vw"
      />
      <div className="grid grid-cols-2 lg:flex lg:justify-between items-center pt-4 pb-6 px-6 lg:px-8 gap-y-1">
        <span className="text-[0.75rem] lg:text-[1rem] font-medium tracking-widest lg:tracking-[0.12em] uppercase text-[#F9F3E2]">Developer &amp; Designer</span>
        <span className="text-[0.75rem] lg:text-[1rem] font-medium tracking-widest lg:tracking-[0.12em] uppercase text-[#F9F3E2] text-right lg:text-left">Based in Germany</span>
        <span className="text-[0.75rem] lg:text-[1rem] font-medium tracking-widest lg:tracking-[0.12em] uppercase text-[#F9F3E2]">Available for Projects</span>
        <span className="text-[0.75rem] lg:text-[1rem] font-medium tracking-widest lg:tracking-[0.12em] uppercase text-[#F9F3E2] text-right lg:text-left">erisa.zaimi2@mail.com</span>
      </div>
    </div>
  )

  return (
    // 100vh sticky + 80vh phase1 + 80vh phase2 + 150vh phase3 + 20vh buffer = 430vh
    <section ref={sectionRef} id="hero" className="relative h-[430vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen border-black"
        style={{ borderWidth: `${borderPxRef.current}px`, borderStyle: 'solid' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* TV Group — slides out to the left in phase 4 */}
          <div ref={tvGroupRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
            {/* Cream background with canvas frame sequence */}
            <div
              ref={heroBgRef}
              className="absolute inset-0 bg-[#F9F3E2] flex items-center justify-center"
              style={{ '--c1': '#1a1a1a' }}
            >
              {/* Channel header — behind TV frame, appears when frame 62 is reached */}
              <div
                ref={headerRef}
                className="absolute left-0 right-0 text-center flex justify-center"
                style={{ top: '14%', opacity: 0 }}
              >
                <AnimatedWords
                  words={['ORIGIN', 'STORY']}
                  charClassName="text-[clamp(5rem,14vw,25rem)] font-light leading-[0.88] tracking-[0.002em]"
                  charStyle={{ color: 'var(--c1)' }}
                  autoTrigger={false}
                  triggerRef={originStoryTriggerRef}
                />
              </div>
              <canvas
                ref={canvasRef}
                className="block w-[75%] lg:w-[60%]"
                style={{
                  height: 'auto',
                  pointerEvents: 'none',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'destination-in',
                }}
              />
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

            {/* Subtitle — typewriter animation below the TV */}
            <div
              ref={subtitleRef}
              className="absolute left-0 right-0 pointer-events-none z-10 text-center"
              style={{
                top: '76%',
                opacity: 0,
                fontFamily: 'courier new',
                fontSize: '16px',
                fontWeight: 700,
                lineHeight: '1.8',
                color: '#1a1a1a',
                letterSpacing: '0.025em',
              }}
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
          style={{ transition: 'opacity 0.4s ease' }}
        >
          <span className="text-[14px] font-light tracking-wide uppercase text-[#F9F3E2] font-mono">SCROLL TO EXPLORE</span>
          <svg
            className="animate-bounce text-[#F9F3E2]"
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
