import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// screenBounds: { top, right, bottom, left, radius? } — CSS % values matching the
// transparent screen region inside the TV image. All effects are clipped to this area
// and only appear during a channel switch.
export default function TVScreenTransition({ activeChannel, children, className = '', style, screenBounds }) {
  const containerRef    = useRef(null)
  const noiseCanvasRef  = useRef(null)
  const scanDistortRef  = useRef(null)
  const blackOverlayRef = useRef(null)
  const brightnessRef   = useRef(null)
  const rgbRedRef       = useRef(null)
  const rgbCyanRef      = useRef(null)
  const prevChannelRef  = useRef(activeChannel)
  const animatingRef    = useRef(false)
  const noiseRafRef     = useRef(null)

  const clipPath = screenBounds
    ? `inset(${screenBounds.top} ${screenBounds.right} ${screenBounds.bottom} ${screenBounds.left}${screenBounds.radius ? ` round ${screenBounds.radius}` : ''})`
    : null
  const clip = clipPath ? { clipPath } : {}

  // Keep noise canvas sized to the container
  useEffect(() => {
    const canvas = noiseCanvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ro = new ResizeObserver(([entry]) => {
      canvas.width  = Math.round(entry.contentRect.width)
      canvas.height = Math.round(entry.contentRect.height)
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (prevChannelRef.current === activeChannel) return
    if (animatingRef.current) return

    prevChannelRef.current = activeChannel
    animatingRef.current   = true

    const noiseCanvas  = noiseCanvasRef.current
    const scanDistort  = scanDistortRef.current
    const blackOverlay = blackOverlayRef.current
    const brightness   = brightnessRef.current
    const rgbRed       = rgbRedRef.current
    const rgbCyan      = rgbCyanRef.current
    if (!noiseCanvas || !scanDistort || !blackOverlay || !brightness || !rgbRed || !rgbCyan) {
      animatingRef.current = false
      return
    }

    const ctx = noiseCanvas.getContext('2d')

    const drawNoise = () => {
      const { width: w, height: h } = noiseCanvas
      if (w && h) {
        const imageData = ctx.createImageData(w, h)
        const d = imageData.data
        for (let i = 0; i < d.length; i += 4) {
          const v = (Math.random() * 255) | 0
          d[i] = v; d[i + 1] = v; d[i + 2] = v
          d[i + 3] = (Math.random() * 200) | 0
        }
        ctx.putImageData(imageData, 0, 0)
      }
      noiseRafRef.current = requestAnimationFrame(drawNoise)
    }

    const stopNoise = () => {
      if (noiseRafRef.current) cancelAnimationFrame(noiseRafRef.current)
      noiseRafRef.current = null
      ctx.clearRect(0, 0, noiseCanvas.width, noiseCanvas.height)
    }

    // Cover the screen instantly so the canvas content swap is hidden
    gsap.set(blackOverlay, { opacity: 1 })
    drawNoise()

    const tl = gsap.timeline({
      onComplete: () => {
        stopNoise()
        animatingRef.current = false
      },
    })

    // A: CRT arc flicker
    tl.to(blackOverlay, { opacity: 0.25, duration: 0.04, ease: 'none' })
      .to(blackOverlay, { opacity: 0.9,  duration: 0.03, ease: 'none' })
      .to(blackOverlay, { opacity: 0.05, duration: 0.04, ease: 'none' })

    // B: Static noise + scanline distortion
    tl.to(noiseCanvas,  { opacity: 0.8, duration: 0.06, ease: 'none' }, '-=0.02')
    tl.to(scanDistort,  { opacity: 1,   duration: 0.05, ease: 'none' }, '<')
    tl.to(blackOverlay, { opacity: 0,   duration: 0.04, ease: 'none' })

    // C: Brightness surge then RGB channel separation
    tl.to(brightness, { opacity: 0.35, duration: 0.04, ease: 'none' })
      .to(brightness, { opacity: 0,    duration: 0.04, ease: 'none' })
    tl.to(rgbRed,  { opacity: 0.35, x:  4, duration: 0.04, ease: 'none' }, '-=0.02')
    tl.to(rgbCyan, { opacity: 0.35, x: -4, duration: 0.04, ease: 'none' }, '<')

    // D: Deep dim to near-black
    tl.to(blackOverlay, { opacity: 0.9, duration: 0.07, ease: 'none' })

    // E: Reveal — fade everything out together
    tl.to(blackOverlay,      { opacity: 0, duration: 0.14, ease: 'power2.out' })
    tl.to(noiseCanvas,       { opacity: 0, duration: 0.12, ease: 'power2.out' }, '-=0.10')
    tl.to(scanDistort,       { opacity: 0, duration: 0.12, ease: 'power2.out' }, '<')
    tl.to([rgbRed, rgbCyan], { opacity: 0, x: 0, duration: 0.10, ease: 'power2.out' }, '<')

    return () => {
      tl.kill()
      stopNoise()
      animatingRef.current = false
    }
  }, [activeChannel])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
      {children}

      {/* All overlays start at opacity 0 and are clipped to the TV screen region */}

      <div
        ref={blackOverlayRef}
        className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0"
        style={clip}
      />

      <canvas
        ref={noiseCanvasRef}
        className="pointer-events-none absolute inset-0 z-20 opacity-0"
        style={{ mixBlendMode: 'screen', ...clip }}
      />

      <div
        ref={scanDistortRef}
        className="pointer-events-none absolute inset-0 z-20 opacity-0"
        style={{
          background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 6px)',
          mixBlendMode: 'overlay',
          ...clip,
        }}
      />

      <div
        ref={brightnessRef}
        className="pointer-events-none absolute inset-0 z-20 bg-white opacity-0"
        style={{ mixBlendMode: 'screen', ...clip }}
      />

      <div
        ref={rgbRedRef}
        className="pointer-events-none absolute inset-0 z-20 opacity-0"
        style={{ background: 'rgba(255,20,20,0.28)', mixBlendMode: 'screen', ...clip }}
      />

      <div
        ref={rgbCyanRef}
        className="pointer-events-none absolute inset-0 z-20 opacity-0"
        style={{ background: 'rgba(20,255,255,0.28)', mixBlendMode: 'screen', ...clip }}
      />
    </div>
  )
}
