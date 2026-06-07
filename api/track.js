export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { pages, duration, referrer, userAgent } = req.body || {}

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown'

  let location = 'Unknown'
  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await geo.json()
    if (data?.city) location = `${data.city}, ${data.region}, ${data.country_name}`
  } catch {}

  const now = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const ua = userAgent || req.headers['user-agent'] || ''
  const isMobile = /Mobile|Android|iPhone|iPad|webOS/i.test(ua)
  const device = isMobile ? 'Mobile' : 'Desktop'

  let browser = 'Unknown'
  if (/Edg\//i.test(ua))          browser = 'Edge'
  else if (/Chrome\//i.test(ua))  browser = 'Chrome'
  else if (/Firefox\//i.test(ua)) browser = 'Firefox'
  else if (/Safari\//i.test(ua))  browser = 'Safari'

  let ref = 'Direct'
  if (referrer) {
    try { ref = new URL(referrer).hostname.replace('www.', '') }
    catch { ref = referrer }
  }

  const PAGE_LABELS = {
    '/': 'Home',
    '/about': 'About',
    '/works': 'Works',
    '/contact': 'Contact',
  }
  const pagesStr = Array.isArray(pages) && pages.length
    ? pages.map(p => PAGE_LABELS[p] ?? p.replace(/^\/projects\//, 'Project: ')).join(' → ')
    : 'Home'

  const mins = Math.floor((duration || 0) / 60)
  const secs = (duration || 0) % 60
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

  const row = (label, value, alt) => `
    <tr style="background:${alt ? '#f9f9f9' : '#fff'}">
      <td style="padding:10px 16px;color:#888;font-family:monospace;font-size:13px;white-space:nowrap;border-bottom:1px solid #eee;">${label}</td>
      <td style="padding:10px 16px;font-family:monospace;font-size:13px;border-bottom:1px solid #eee;">${value}</td>
    </tr>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio Tracker <onboarding@resend.dev>',
      to: 'erisazaimi22@gmail.com',
      subject: `Portfolio visit — ${location}`,
      html: `
        <div style="font-family:monospace;max-width:520px;color:#111;">
          <p style="font-size:13px;color:#555;margin:0 0 16px;">Someone visited your portfolio.</p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
            ${row('Location',     location,   false)}
            ${row('Time',         now + ' UTC', true)}
            ${row('Device',       `${device} · ${browser}`, false)}
            ${row('Referrer',     ref,        true)}
            ${row('Pages',        pagesStr,   false)}
            ${row('Time on site', timeStr,    true)}
            ${row('IP',           ip,         false)}
          </table>
        </div>
      `,
    }),
  })

  return res.status(200).end()
}
