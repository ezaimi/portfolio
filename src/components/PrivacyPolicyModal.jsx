import { useEffect } from 'react'

const mono = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: '0.1em',
}

export default function PrivacyPolicyModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111',
          border: '1px solid #2a2a2a',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            ...mono,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F9F3E2')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
        >
          [ close ]
        </button>

        <h2 style={{
          ...mono,
          fontSize: '0.7rem',
          color: '#909090',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: '1.5rem',
        }}>
          // privacy policy
        </h2>

        {[
          {
            title: 'Data Collected',
            body: 'When you visit this website, the following technical data may be automatically collected: IP address, approximate geographic location (city/region/country derived from IP), visit timestamp, and browser/device information.',
          },
          {
            title: 'Purpose',
            body: 'This data is collected solely to notify the site owner of visits and for basic security purposes. It is not used for advertising, profiling, or shared with third parties.',
          },
          {
            title: 'Retention',
            body: 'Visit data is sent directly to the site owner via email and is not stored in any database or logging system beyond what your email provider retains.',
          },
          {
            title: 'Your Rights',
            body: 'If you have questions or concerns about how your data is handled, you can reach out at erisazaimi22@gmail.com.',
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '1.5rem' }}>
            <p style={{ ...mono, fontSize: '0.75rem', color: '#F9F3E2', marginBottom: '0.5rem' }}>
              {title}
            </p>
            <p style={{ ...mono, fontSize: '0.7rem', color: '#888', lineHeight: 1.8 }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
