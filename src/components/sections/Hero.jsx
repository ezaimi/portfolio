import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function AnimatedWords({ words, charClassName, charStyle, charWrapStyle, gap = '0.2em', direction = 'row', triggerRef: externalTriggerRef, autoTrigger = true }) {
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
              style={{ lineHeight: 0.88, cursor: 'default', ...charWrapStyle }}
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

const getBorderPx = () => window.innerWidth >= 600 ? 40 : 0
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

const DETAIL_ITEMS = [
  'Developer & Designer',
  'Based in Germany',
  'Available for Projects',
  'erisa.zaimi2@mail.com',
]

const MEDIUM_DETAIL_ITEMS = [
  'Developer & Designer',
  'Available for Projects',
  'Based in Germany',
  'erisa.zaimi2@mail.com',
]

const HERO_SERIF_FONT = "'Cormorant Hero', Georgia, 'Times New Roman', serif"
const HERO_MONO_FONT = "'Space Mono Hero', 'Courier New', monospace"

export default function Hero() {
  const [isMobileHero,     setIsMobileHero]     = useState(() => window.innerWidth < 600)
  const [isMediumHero,     setIsMediumHero]     = useState(() => window.innerWidth >= 600 && window.innerWidth < 900)
  const [isWideHero,       setIsWideHero]       = useState(() => window.innerWidth >= 1200)
  const [isXWideHero,      setIsXWideHero]      = useState(() => window.innerWidth >= 1800)
  const [isMediumTallHero, setIsMediumTallHero] = useState(() => window.innerWidth >= 600 && window.innerWidth < 900 && window.innerHeight > 800)
  const [isMediumMidHero,   setIsMediumMidHero]   = useState(() => window.innerWidth >= 600 && window.innerWidth < 900 && window.innerHeight >= 700 && window.innerHeight <= 800)
  const [isMediumShortHero, setIsMediumShortHero] = useState(() => window.innerWidth >= 600 && window.innerWidth < 900 && window.innerHeight >= 600 && window.innerHeight < 700)
  const [isMedWidthMid,     setIsMedWidthMid]     = useState(() => window.innerWidth >= 700 && window.innerWidth < 800)
  const [isMedWidthNarrow,  setIsMedWidthNarrow]  = useState(() => window.innerWidth >= 580 && window.innerWidth < 700)
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
  const mobileOriginRef        = useRef(null)
  const mobileStoryRef         = useRef(null)
  const mobileBadgeRef         = useRef(null)
  const mobileOriginTriggerRef = useRef(null)
  const mobileStoryTriggerRef  = useRef(null)
  const subtitleRef      = useRef(null)
  const typewriterTimerRef = useRef(null)
  const tvGroupRef              = useRef(null)
  const heroBgRef               = useRef(null)
  const originStoryTriggerRef   = useRef(null)
  const subtitlesDoneRef    = useRef(false)
  const scrollLockedRef     = useRef(false)
  const shadowOverlayRef    = useRef(null)
  const loaderDoneRef       = useRef(false)
  const scrollHintMediumRef = useRef(null)

  useEffect(() => {
    const updateBreakpoint = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      setIsMobileHero(w < 600)
      setIsMediumHero(w >= 600 && w < 900)
      setIsWideHero(w >= 1200)
      setIsXWideHero(w >= 1800)
      setIsMediumTallHero(w >= 600 && w < 900 && h > 800)
      setIsMediumMidHero(w >= 600 && w < 900 && h >= 700 && h <= 800)
      setIsMediumShortHero(w >= 600 && w < 900 && h >= 600 && h < 700)
      setIsMedWidthMid(w >= 700 && w < 800)
      setIsMedWidthNarrow(w >= 580 && w < 700)
    }
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

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

    const hasReachedNextSection = () => {
      const section = sectionRef.current
      if (!section) return false
      return window.scrollY + window.innerHeight >= section.offsetTop + section.offsetHeight - 1
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
        if (!hasReachedNextSection()) {
          if (scrollHintRef.current) scrollHintRef.current.style.opacity = '1'
          if (scrollHintMediumRef.current) scrollHintMediumRef.current.style.opacity = '1'
        }
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
      const isMobile = window.innerWidth < 600
      if (!subtitle) return
      if (typewriterTimerRef.current) clearTimeout(typewriterTimerRef.current)
      if (subtitle) subtitle.innerHTML = ''

      if (isMobile) {
        const origin = mobileOriginRef.current
        const story  = mobileStoryRef.current
        if (origin) gsap.fromTo(origin, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', onStart: () => mobileOriginTriggerRef.current?.() })
        if (story)  gsap.fromTo(story,  { opacity: 0, y: 10  }, { opacity: 1, y: 0, duration: 0.55, delay: 0.1, ease: 'power2.out', onStart: () => mobileStoryTriggerRef.current?.() })
      } else {
        if (!header) return
        gsap.fromTo(header, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', onStart: () => originStoryTriggerRef.current?.() })
      }
      gsap.fromTo(subtitle, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.15, ease: 'power2.out', onComplete: startTypewriter })
    }

    const hideOverlay = () => {
      subtitlesDoneRef.current = false
      scrollLockedRef.current = false
      if (typewriterTimerRef.current) clearTimeout(typewriterTimerRef.current)
      const header   = headerRef.current
      const subtitle = subtitleRef.current
      const origin   = mobileOriginRef.current
      const story    = mobileStoryRef.current
      if (header)  gsap.set(header,  { opacity: 0, y: -10 })
      if (origin)  gsap.set(origin,  { opacity: 0, y: -10 })
      if (story)   gsap.set(story,   { opacity: 0, y: 10  })
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
      const isMediumViewport = window.innerWidth >= 600 && window.innerWidth < 900

      const phase1Scroll = viewportH * 0.8
      const phase2Scroll = viewportH * 0.8
      const phase3Scroll = viewportH * 1.5

      const phase1Progress = Math.min(1, Math.max(0, scrollY / phase1Scroll))
      const phase2Progress = Math.min(1, Math.max(0, (scrollY - phase1Scroll) / phase2Scroll))
      const phase3Start    = phase1Scroll + phase2Scroll * 0.3
      const phase3Progress = Math.min(1, Math.max(0, (scrollY - phase3Start) / phase3Scroll))

      // Phase 1: text rises, border shrinks, navbar fades
      const textH       = textTop.offsetHeight
      const bottomOffset = isMediumViewport ? 120 : window.innerWidth >= 600 ? 80 : 100
      const maxUpward   = viewportH / 2 - bottomOffset - textH / 2
      const translateY  = -phase1Progress * (isMediumViewport ? maxUpward * 0.58 : maxUpward)

      textTop.style.transform    = `translateY(${translateY}px)`
      textBottom.style.transform = `translateY(${translateY}px)`
      const b = borderPxRef.current * (1 - phase1Progress)
      const isMobileViewport = window.innerWidth < 600
      const isDesktopViewport = window.innerWidth >= 900
      const isWideViewport = window.innerWidth >= 1200
      const isMonitorViewport = window.innerWidth >= 1400
      const isXWideViewport = window.innerWidth >= 1800
      const mobileTopBand = isMobileViewport ? 80 * (1 - phase1Progress) : 0
      const xWideExtraY = isXWideViewport ? 20 * (1 - phase1Progress) : 0
      const xWideExtraX = isXWideViewport ? 40 * (1 - phase1Progress) : 0
      const extraYTop = isDesktopViewport ? 60 * (1 - phase1Progress) : 0
      const extraYBot = isDesktopViewport ? 50 * (1 - phase1Progress) : 0
      const extraX = isWideViewport ? extraYBot : 0
      const monitorYBorder = 150 * (1 - phase1Progress)
      const topBorder = isMobileViewport ? mobileTopBand : isMediumViewport ? b + 35 * (1 - phase1Progress) : isMonitorViewport ? monitorYBorder : b + extraYTop + xWideExtraY
      const bottomBorder = isMonitorViewport ? monitorYBorder : b + extraYBot + xWideExtraY
      stickyEl.style.borderTopWidth = `${topBorder}px`
      stickyEl.style.borderRightWidth = `${b + extraX + xWideExtraX}px`
      stickyEl.style.borderBottomWidth = `${bottomBorder}px`
      stickyEl.style.borderLeftWidth = `${b + extraX + xWideExtraX}px`

      const navbar = document.getElementById('navbar')
      if (navbar) navbar.style.backgroundColor = `rgba(0,0,0,${1 - phase1Progress})`

      // Phase 2: halves split apart
      const currentBorder    = borderPxRef.current * (1 - phase1Progress)
      const halfH            = viewportH / 2
      topHalf.style.transform    = `translateY(${-phase2Progress * halfH}px)`
      bottomHalf.style.transform = `translateY(${phase2Progress * halfH}px)`

      const textTopViewport  = viewportH - currentBorder - bottomOffset - textH + translateY
      const topHalfEnd       = halfH * (1 - phase2Progress)
      const bottomHalfStart  = halfH * (1 + phase2Progress)

      textTop.style.opacity = '1'
      textBottom.style.opacity = '1'

      if (window.innerWidth > 900) {
        const topSplitY = topHalf.getBoundingClientRect().bottom - textTop.getBoundingClientRect().top
        const bottomSplitY = bottomHalf.getBoundingClientRect().top - textBottom.getBoundingClientRect().top
        textTop.style.clipPath    = `polygon(0 0, 100% 0, 100% ${topSplitY}px, 0 ${topSplitY}px)`
        textBottom.style.clipPath = `polygon(0 ${bottomSplitY}px, 100% ${bottomSplitY}px, 100% 100%, 0 100%)`
      } else {
        textTop.style.clipPath    = `polygon(0 0, 100% 0, 100% ${topHalfEnd - textTopViewport}px, 0 ${topHalfEnd - textTopViewport}px)`
        textBottom.style.clipPath = `polygon(0 ${bottomHalfStart - textTopViewport}px, 100% ${bottomHalfStart - textTopViewport}px, 100% 100%, 0 100%)`
      }

      // Phase 3: advance frame sequence + detect channel switch
      phase3ProgressRef.current = phase3Progress
      drawFrame(phase3Progress)

      const frameIdx = Math.round(phase3Progress * (FRAME_COUNT - 1))
      const scrollHint = scrollHintRef.current
      const scrollHintMed = scrollHintMediumRef.current
      const nextSectionVisible = hasReachedNextSection()
      if (loaderDoneRef.current) {
        const waitingForSubtitles = frameIdx >= FRAME_COUNT - 1 && !subtitlesDoneRef.current
        const shouldHide = nextSectionVisible || waitingForSubtitles
        if (scrollHint) scrollHint.style.opacity = shouldHide ? '0' : '1'
        if (scrollHintMed) scrollHintMed.style.opacity = shouldHide ? '0' : '1'
      }

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
      if (stickyRef.current) {
        const isMobileViewport = window.innerWidth < 600
        const isMediumViewport = window.innerWidth >= 600 && window.innerWidth < 900
        const isDesktopVP = window.innerWidth >= 900
        const isWideVP = window.innerWidth >= 1200
        const isMonitorVP = window.innerWidth >= 1400
        const isXWideVP = window.innerWidth >= 1800
        const xWideExtraY = isXWideVP ? 20 : 0
        const xWideExtraX = isXWideVP ? 40 : 0
        const yExtraTop = isDesktopVP ? 60 : 0
        const yExtraBot = isDesktopVP ? 50 : 0
        const xExtra = isWideVP ? yExtraBot : 0
        stickyRef.current.style.borderTopWidth = `${isMobileViewport ? 80 : isMediumViewport ? borderPxRef.current + 35 : isMonitorVP ? 150 : borderPxRef.current + yExtraTop + xWideExtraY}px`
        stickyRef.current.style.borderRightWidth = `${borderPxRef.current + xExtra + xWideExtraX}px`
        stickyRef.current.style.borderBottomWidth = `${isMonitorVP ? 150 : borderPxRef.current + yExtraBot + xWideExtraY}px`
        stickyRef.current.style.borderLeftWidth = `${borderPxRef.current + xExtra + xWideExtraX}px`
      }
    }
    updateBorderPx()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventScrollKey)
    window.addEventListener('resize', updateBorderPx)

    const resetToHeroStart = ({ markLoaderDone = false, animateName = false } = {}) => {
      const html = document.documentElement
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)
      html.style.scrollBehavior = prev

      if (markLoaderDone) loaderDoneRef.current = true
      subtitlesDoneRef.current = false
      scrollLockedRef.current = false
      phase3ProgressRef.current = 0
      activeChannelRef.current = 0
      lockedProgressRef.current = null
      currentTl.current?.kill()
      hideOverlay()
      onScroll()

      if (!animateName) return

      // Name chars — same as old autoTrigger=true behavior
      ;[textTopRef.current, textBottomRef.current].forEach((el) => {
        if (!el) return
        el.querySelectorAll('[data-char]').forEach((char, i) => {
          setTimeout(() => {
            char.classList.remove('char-animating')
            void char.offsetWidth
            char.classList.add('char-animating')
            char.addEventListener('animationend', () => char.classList.remove('char-animating'), { once: true })
          }, i * 60)
        })
      })
    }

    const prepareHeroReveal = () => resetToHeroStart()
    const triggerName = () => resetToHeroStart({ markLoaderDone: true, animateName: true })
    window.addEventListener('loader:beforeReveal', prepareHeroReveal)
    window.addEventListener('loader:done', triggerName, { once: true })

    // Spin the mobile badge
    const badgeSpin = mobileBadgeRef.current
      ? gsap.to(mobileBadgeRef.current, { rotation: 360, duration: 22, ease: 'none', repeat: -1, transformOrigin: '50% 50%' })
      : null

    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventScrollKey)
      window.removeEventListener('resize', updateBorderPx)
      window.removeEventListener('loader:beforeReveal', prepareHeroReveal)
      window.removeEventListener('loader:done', triggerName)
      currentTl.current?.kill()
      if (typewriterTimerRef.current) clearTimeout(typewriterTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    return () => cancelAnimationFrame(raf)
  }, [isMobileHero, isMediumHero])


  const desktopTextInner = (
    <div className="w-fit mx-auto flex flex-col">
      <div className="translate-y-[22px] min-[1400px]:translate-y-0">
        <AnimatedWords
          words={['Erisa', 'Zaimi']}
          charClassName="text-[clamp(5rem,14vw,25rem)] font-light leading-[0.88] tracking-[0.06em] text-[#F9F3E2]"
          charWrapStyle={{ marginTop: '-0.1em', marginBottom: '-0.1em' }}
          gap="3.5vw"
          autoTrigger={false}
        />
      </div>
      <div className="flex justify-between items-center pt-4 pb-6 pl-8 min-[900px]:pl-4 min-[1400px]:pl-8 pr-6 min-[1400px]:pr-11">
        <span className="text-[0.55rem] min-[1200px]:text-[0.62rem] min-[1400px]:text-[0.95rem] font-medium tracking-[0.12em] uppercase text-[#F9F3E2]">Developer &amp; Designer</span>
        <span className="text-[0.55rem] min-[1200px]:text-[0.62rem] min-[1400px]:text-[0.95rem] font-medium tracking-[0.12em] uppercase text-[#F9F3E2]">Based in Germany</span>
        <span className="text-[0.55rem] min-[1200px]:text-[0.62rem] min-[1400px]:text-[0.95rem] font-medium tracking-[0.12em] uppercase text-[#F9F3E2]">Available for Projects</span>
        <span className="text-[0.55rem] min-[1200px]:text-[0.62rem] min-[1400px]:text-[0.95rem] font-medium tracking-[0.12em] uppercase text-[#F9F3E2]">erisa.zaimi2@mail.com</span>
      </div>
    </div>
  )

  const mobileTextInner = (
    <div className="w-full px-[9vw]">
      <div className="flex flex-col">
        <AnimatedWords
          words={['Erisa']}
          charClassName="text-[clamp(7rem,30vw,9.5rem)] font-light leading-[0.82] tracking-[0.04em] text-[#F9F3E2]"
          charStyle={{ fontFamily: HERO_SERIF_FONT, fontWeight: 300 }}
          charWrapStyle={{ lineHeight: 1.04, paddingTop: '0.06em' }}
          gap="0"
          autoTrigger={false}
        />
        <AnimatedWords
          words={['Zaimi']}
          charClassName="text-[clamp(7rem,30vw,9.5rem)] font-light leading-[0.82] tracking-[0.04em] text-[#F9F3E2]"
          charStyle={{ fontFamily: HERO_SERIF_FONT, fontWeight: 300 }}
          charWrapStyle={{ lineHeight: 1.04, paddingTop: '0.06em' }}
          gap="0"
          autoTrigger={false}
        />
      </div>
      <div className="mt-6 w-[min(55vw,16rem)]">
        {DETAIL_ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-4 border-b border-[#F9F3E2]/30 py-3.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#bd8589]" />
            <span
              className="text-[clamp(0.56rem,2.25vw,0.7rem)] font-bold uppercase tracking-[0.24em] text-[#F9F3E2]"
              style={{ fontFamily: HERO_MONO_FONT }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const mediumTextInner = (
    <div className="w-full px-8">
      <div className="w-fit">
        <div className="flex gap-5 translate-y-2 min-[800px]:-translate-y-2">
          <AnimatedWords
            words={['Erisa']}
            charClassName="text-[clamp(6rem,15vw,9.5rem)] font-light leading-[0.86] tracking-[0.005em] text-[#F9F3E2]"
            charStyle={{ fontFamily: HERO_SERIF_FONT, fontWeight: 300 }}
            charWrapStyle={{ lineHeight: 1.08, paddingTop: '0.08em' }}
            gap="0"
            autoTrigger={false}
          />
          <AnimatedWords
            words={['Zaimi']}
            charClassName="text-[clamp(6rem,15vw,9.5rem)] font-light leading-[0.86] tracking-[0.005em] text-[#F9F3E2]"
            charStyle={{ fontFamily: HERO_SERIF_FONT, fontWeight: 300 }}
            charWrapStyle={{ lineHeight: 1.08, paddingTop: '0.08em' }}
            gap="0"
            autoTrigger={false}
          />
        </div>
        <div className="mt-5 min-[800px]:-translate-y-5">
          <div className="w-full border-t border-[#F9F3E2]/30" />
          <div className="pt-4 grid grid-cols-2 gap-y-3 gap-x-8 w-fit">
            {MEDIUM_DETAIL_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#bd8589]" />
                <span
                  className="text-[0.56rem] font-bold uppercase tracking-[0.22em] text-[#F9F3E2]"
                  style={{ fontFamily: HERO_MONO_FONT }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const textInner = isMobileHero ? mobileTextInner : isMediumHero ? mediumTextInner : desktopTextInner

  return (
    // 100vh sticky + 80vh phase1 + 80vh phase2 + 150vh phase3 + 20vh buffer = 430vh
    <section ref={sectionRef} id="hero" className="relative h-[430vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen border-black"
        style={{
          borderTopWidth: `${isMobileHero ? 80 : isMediumHero ? borderPxRef.current + 35 : isWideHero && window.innerWidth >= 1400 ? 150 : borderPxRef.current + 60 + (isXWideHero ? 20 : 0)}px`,
          borderRightWidth: `${isWideHero ? borderPxRef.current + 80 + (isXWideHero ? 40 : 0) : borderPxRef.current}px`,
          borderBottomWidth: `${!isMobileHero && !isMediumHero ? window.innerWidth >= 1400 ? 150 : borderPxRef.current + 50 + (isXWideHero ? 20 : 0) : borderPxRef.current}px`,
          borderLeftWidth: `${isWideHero ? borderPxRef.current + 80 + (isXWideHero ? 40 : 0) : borderPxRef.current}px`,
          borderStyle: 'solid',
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* TV Group — slides out to the left in phase 4 */}
          <div ref={tvGroupRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
            {/* Cream background with canvas frame sequence */}
            <div
              ref={heroBgRef}
              className={`absolute inset-0 bg-[#F9F3E2] flex items-center flex-col min-[1400px]:flex-row${isMobileHero ? ' justify-center' : isMediumTallHero ? ' justify-start pt-[14%]' : isMediumShortHero ? ' justify-start pt-[4%]' : isMedWidthMid ? ' justify-start pt-[5%]' : isMediumHero ? ' justify-start pt-[13%]' : ' justify-center'}`}
              style={{ '--c1': '#1a1a1a' }}
            >
              {/* Mobile: ORIGIN above TV */}
              {isMobileHero && (
                <div ref={mobileOriginRef} className="relative text-center flex justify-center" style={{ opacity: 0 }}>
                  <AnimatedWords
                    words={['ORIGIN']}
                    charClassName="text-[clamp(6rem,26vw,10rem)] font-light leading-[0.88] tracking-[0.002em]"
                    charStyle={{ color: 'var(--c1)' }}
                    autoTrigger={false}
                    triggerRef={mobileOriginTriggerRef}
                  />
                  <svg
                    ref={mobileBadgeRef}
                    viewBox="0 0 120 120"
                    style={{ position: 'absolute', top: '-20%', right: '5%', width: '18vw', height: '18vw', color: 'var(--c1)' }}
                  >
                    <defs>
                      <path id="cp-mobile" d="M60,60 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
                    </defs>
                    <text fill="currentColor" fontSize="9.2" fontFamily="'Courier New',monospace" letterSpacing="2">
                      <textPath href="#cp-mobile" textLength="248" lengthAdjust="spacing">CODE - DESIGN - SOLVE - CREATE -</textPath>
                    </text>
                    <line x1="60" y1="50" x2="60" y2="70" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="50" y1="60" x2="70" y2="60" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              )}

              {/* Desktop/tablet: ORIGIN STORY together */}
              {!isMobileHero && (
                <div
                  ref={headerRef}
                  className="relative text-center flex justify-center min-[1400px]:absolute min-[1400px]:left-0 min-[1400px]:right-0"
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
              )}
              <canvas
                ref={canvasRef}
                className="block w-[120%] min-[580px]:w-[95%] min-[600px]:max-h-200 min-[700px]:w-[88%] min-[900px]:w-auto min-[900px]:h-[77vh]! min-[900px]:max-h-none min-[900px]:mx-2.5 min-[1400px]:w-[65%] min-[1400px]:h-auto! min-[600px]:mt-[-2%] min-[1400px]:mt-0 min-[1400px]:translate-y-[3%]"
                style={{
                  height: 'auto',
                  pointerEvents: 'none',
                  ...(isMobileHero && { marginTop: '-18%' }),
                  ...(isMediumShortHero && { marginTop: '-4%' }),
                  ...(isMediumMidHero && { marginTop: '3%' }),
                  ...(isMedWidthNarrow && { marginTop: '4%' }),
                  maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 1%, black 99%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 1%, black 99%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'destination-in',
                }}
              />

              {/* Mobile: STORY below TV */}
              {isMobileHero && (
                <div ref={mobileStoryRef} className="text-center flex justify-center" style={{ opacity: 0, marginTop: '-14%' }}>
                  <AnimatedWords
                    words={['STORY']}
                    charClassName="text-[clamp(6rem,26vw,10rem)] font-light leading-[0.88] tracking-[0.002em]"
                    charStyle={{ color: 'var(--c1)' }}
                    autoTrigger={false}
                    triggerRef={mobileStoryTriggerRef}
                  />
                </div>
              )}
            </div>

            {/* Top half */}
            <div
              ref={topHalfRef}
              className="absolute top-0 left-0 right-0"
              style={{ height: 'calc(50% + 1px)', overflow: 'hidden', willChange: 'transform' }}
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
                top: isMediumShortHero ? '82%' : isMediumMidHero ? '76%' : window.innerWidth >= 1400 ? '78%' : (!isMobileHero && !isXWideHero) ? '87%' : '82%',
                opacity: 0,
                fontFamily: 'courier new',
                fontSize: (isMediumHero || isMobileHero) ? '9px' : (!isMobileHero && !isXWideHero) ? '12px' : '16px',
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
          className="absolute bottom-[6.25rem] left-0 right-0 min-[900px]:bottom-10 min-[1400px]:bottom-20"
          style={{ willChange: 'transform', ...(isMediumHero && { bottom: '90px' }) }}
        >
          {textInner}
        </div>

        {/* Text copy clipped to the bottom image half */}
        <div
          ref={textBottomRef}
          className="absolute bottom-[6.25rem] left-0 right-0 min-[900px]:bottom-10 min-[1400px]:bottom-20"
          style={{ willChange: 'transform', ...(isMediumHero && { bottom: '90px' }) }}
        >
          {textInner}
        </div>

        {isMediumHero && (
          <div ref={scrollHintMediumRef} className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none bg-black mix-blend-difference" style={{ opacity: 0 }}>
            <span
              className="text-[9px] font-normal tracking-widest uppercase text-[#F9F3E2]"
              style={{ fontFamily: HERO_MONO_FONT }}
            >
              Scroll to Explore
            </span>
            <svg className="animate-bounce text-[#F9F3E2]" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {!isMediumHero && createPortal(
        <div
          ref={scrollHintRef}
          className="fixed bottom-7 min-[600px]:bottom-14 min-[900px]:bottom-4 min-[1400px]:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-50 bg-black mix-blend-difference"
          style={{ opacity: 0, transition: 'opacity 0.4s ease' }}
        >
          <span
            className="text-[8px] min-[600px]:text-[11px] min-[1400px]:text-[13px] font-light tracking-widest uppercase text-[#F9F3E2] font-mono"
            style={isMobileHero || isMediumHero ? { fontFamily: HERO_MONO_FONT } : undefined}
          >
            SCROLL TO EXPLORE
          </span>
          <svg
            className="animate-bounce text-[#F9F3E2]"
            width={isMobileHero ? '16' : '12'}
            height={isMobileHero ? '16' : '12'}
            viewBox="0 0 16 16"
            fill="none"
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
