import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const move = (e) => {
      dot.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 15,
        height: 15,
        borderRadius: '50%',
        backgroundColor: '#b77f82',
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
      }}
    />
  )
}
