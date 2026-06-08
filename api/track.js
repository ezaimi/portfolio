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
  } catch {
    location = 'Unknown'
  }

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
    ? pages.map(p => PAGE_LABELS[p] ?? p.replace(/^\/projects\//, 'Project: ')).join(' -> ')
    : 'Home'

  const mins = Math.floor((duration || 0) / 60)
  const secs = (duration || 0) % 60
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`

  const escapeHtml = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char])

  const summaryCard = (label, value) => `
    <td style="padding:0 6px 12px 0;vertical-align:top;">
      <div style="background:#fde8f0;border:1px solid #f4c2d8;border-radius:10px;padding:14px 14px 13px;">
        <p style="margin:0 0 7px;font:700 10px/1.2 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.12em;color:#b06080;">${escapeHtml(label)}</p>
        <p style="margin:0;font:600 14px/1.35 'Courier New',Courier,monospace;color:#1a0a10;word-break:break-word;">${escapeHtml(value)}</p>
      </div>
    </td>`

  const row = (label, value) => `
    <tr>
      <td style="padding:15px 18px;width:138px;vertical-align:top;border-bottom:1px solid #fad4e4;">
        <span style="font:700 10px/1.2 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.12em;color:#c080a0;">${escapeHtml(label)}</span>
      </td>
      <td style="padding:15px 18px;vertical-align:top;border-bottom:1px solid #fad4e4;">
        <span style="font:14px/1.5 'Courier New',Courier,monospace;color:#1a0a10;word-break:break-word;">${escapeHtml(value)}</span>
      </td>
    </tr>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${globalThis.process?.env?.RESEND_API_KEY ?? ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio Tracker <tracker@erisazaimi.com>',
      to: 'erisazaimi22@gmail.com',
      subject: `Portfolio visit - ${location}`,
      html: `
        <div style="margin:0;padding:0;background:#fce8f2;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#fce8f2;border-collapse:collapse;">
            <tr>
              <td align="center" style="padding:36px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;border-collapse:separate;border-spacing:0;background:#fff5f8;border:1px solid #f4c2d8;border-radius:18px;overflow:hidden;box-shadow:0 18px 46px rgba(35,10,25,0.12);">
                  <tr>
                    <td style="background:#2d0a1a;padding:30px 32px 28px;color:#fde8f0;">
                      <p style="margin:0 0 12px;font:700 11px/1.2 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.18em;color:#d49ab8;">erisazaimi.com</p>
                      <h1 style="margin:0;font:400 34px/1.05 Georgia,'Times New Roman',serif;letter-spacing:0;color:#fde8f0;">New portfolio visitor</h1>
                      <p style="margin:13px 0 0;max-width:460px;font:14px/1.65 Arial,Helvetica,sans-serif;color:#e8b8d0;">Someone just viewed your portfolio. Here is the quick read on where they came from and what they explored.</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:24px 26px 16px;background:#fff5f8;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
                        <tr>
                          ${summaryCard('Location', location)}
                          ${summaryCard('Device', `${device} / ${browser}`)}
                          ${summaryCard('Visit length', timeStr)}
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 26px 26px;background:#fff5f8;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #f4c2d8;border-radius:12px;overflow:hidden;">
                        ${row('Location',     location)}
                        ${row('Time',         now + ' UTC')}
                        ${row('Device',       `${device} / ${browser}`)}
                        ${row('Referrer',     ref)}
                        ${row('Pages',        pagesStr)}
                        ${row('Time on site', timeStr)}
                        ${row('IP',           ip)}
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:17px 32px;background:#2d0a1a;border-top:1px solid rgba(253,232,240,0.12);">
                      <p style="margin:0;font:700 10px/1.4 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.16em;color:#c090a8;">Sent by your portfolio tracker</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    }),
  })

  return res.status(200).end()
}
