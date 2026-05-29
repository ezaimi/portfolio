import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 60
const frameSrc = (i) => `/frames/tv-frame-${String(i).padStart(4, '0')}.webp`

export default function TvSection() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const images = []
    let loadedCount = 0
    let trigger = null

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawFrame = (index) => {
      const img = images[index]
      if (!img?.complete || img.naturalWidth === 0) return
      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = Math.min(cw / iw, ch / ih)
      const w = iw * scale
      const h = ih * scale
      const x = (cw - w) / 2
      const y = (ch - h) / 2
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, x, y, w, h)
    }

    const handleResize = () => {
      setCanvasSize()
      if (trigger) {
        drawFrame(Math.round(trigger.progress * (FRAME_COUNT - 1)))
      }
    }

    const initAnimation = () => {
      setCanvasSize()
      drawFrame(0)
      window.addEventListener('resize', handleResize)

      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          drawFrame(Math.round(self.progress * (FRAME_COUNT - 1)))
        },
      })
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameSrc(i + 1)
      img.onload = () => {
        loadedCount++
        if (loadedCount === FRAME_COUNT) initAnimation()
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === FRAME_COUNT) initAnimation()
      }
      images.push(img)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      trigger?.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="tv"
      style={{ height: '100vh', background: '#F9F3E2' }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </section>
  )
}
