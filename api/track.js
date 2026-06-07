export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown'

  let location = 'unknown'
  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await geo.json()
    if (data && data.city) {
      location = `${data.city}, ${data.region}, ${data.country_name}`
    }
  } catch {
    location = 'could not fetch location'
  }

  const now = new Date().toLocaleString('en-US', { timeZone: 'UTC' })

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio Tracker <onboarding@resend.dev>',
      to: 'erisazaimi22@gmail.com',
      subject: 'Someone visited your portfolio',
      html: `
        <p><strong>Time:</strong> ${now} UTC</p>
        <p><strong>IP:</strong> ${ip}</p>
        <p><strong>Location:</strong> ${location}</p>
      `,
    }),
  })

  return res.status(200).end()
}
