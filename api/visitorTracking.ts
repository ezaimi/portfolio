import { neon } from '@neondatabase/serverless'
import { Resend } from 'resend'

type HeaderValue = string | string[] | undefined
type JsonObject = Record<string, unknown>

export type ApiRequest = {
  method?: string
  headers: Record<string, HeaderValue>
  body?: unknown
}

export type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  end: (body?: string) => void
  setHeader?: (key: string, value: string) => void
}

export type VisitorAction = 'start' | 'update' | 'final'

export type SessionRow = {
  id: string
  message_id: string
  visitor_info: JsonObject
}

type GlobalWithProcess = typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>
  }
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/works': 'Works',
  '/contact': 'Contact',
}

let sqlClient: ReturnType<typeof neon> | null = null
let resendClient: Resend | null = null
let schemaReady: Promise<void> | null = null

function env(name: string) {
  return ((globalThis as GlobalWithProcess).process?.env?.[name] ?? '').trim()
}

function getSql() {
  if (sqlClient) return sqlClient

  const databaseUrl = env('DATABASE_URL')
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured')

  sqlClient = neon(databaseUrl)
  return sqlClient
}

function getResend() {
  if (resendClient) return resendClient

  const apiKey = env('RESEND_API_KEY')
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')

  resendClient = new Resend(apiKey)
  return resendClient
}

function readHeader(headers: Record<string, HeaderValue>, name: string) {
  const exact = headers[name]
  const value = exact ?? headers[name.toLowerCase()]
  const normalized = value ?? Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1]

  return Array.isArray(normalized) ? normalized[0] : normalized
}

function decodeHeader(value: string | undefined) {
  if (!value) return ''

  try {
    return decodeURIComponent(value.replace(/\+/g, ' '))
  } catch {
    return value
  }
}

function asObject(value: unknown): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {}
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char] ?? char)
}

function formatPage(value: unknown) {
  const raw = String(value || '/')
  let path = raw

  try {
    path = raw.startsWith('http') ? new URL(raw).pathname : raw.split('?')[0].split('#')[0]
  } catch {
    path = raw
  }

  return PAGE_LABELS[path] ?? path.replace(/^\/projects\//, 'Project: ')
}

function formatPages(visitorInfo: JsonObject) {
  const pages = Array.isArray(visitorInfo.pages) ? visitorInfo.pages : [visitorInfo.path || visitorInfo.url || '/']

  return pages.length ? pages.map(formatPage).join(' -> ') : 'Home'
}

function formatDuration(visitorInfo: JsonObject) {
  const duration = Math.max(0, Math.round(asNumber(visitorInfo.durationSeconds) || asNumber(visitorInfo.duration)))
  const mins = Math.floor(duration / 60)
  const secs = duration % 60

  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

function detectBrowser(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return 'Edge'
  if (/Chrome\//i.test(userAgent)) return 'Chrome'
  if (/Firefox\//i.test(userAgent)) return 'Firefox'
  if (/Safari\//i.test(userAgent)) return 'Safari'

  return 'Unknown'
}

function formatReferrer(referrer: string) {
  if (!referrer) return 'Direct'

  try {
    return new URL(referrer).hostname.replace('www.', '')
  } catch {
    return referrer
  }
}

function formatEvents(visitorInfo: JsonObject) {
  const events = Array.isArray(visitorInfo.events) ? visitorInfo.events.slice(-8) : []
  if (!events.length) return 'No activity details'

  return events.map((event) => {
    const item = asObject(event)
    const type = asString(item.type) || 'event'
    const label = asString(item.label) || asString(item.path) || asString(item.source)
    return label ? `${type}: ${label}` : type
  }).join(' | ')
}

function summaryCard(label: string, value: string) {
  return `
    <td style="padding:0 6px 12px 0;vertical-align:top;">
      <div style="background:#fde8f0;border:1px solid #f4c2d8;border-radius:10px;padding:14px 14px 13px;">
        <p style="margin:0 0 7px;font:700 10px/1.2 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.12em;color:#b06080;">${escapeHtml(label)}</p>
        <p style="margin:0;font:600 14px/1.35 'Courier New',Courier,monospace;color:#1a0a10;word-break:break-word;">${escapeHtml(value)}</p>
      </div>
    </td>`
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:15px 18px;width:138px;vertical-align:top;border-bottom:1px solid #fad4e4;">
        <span style="font:700 10px/1.2 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.12em;color:#c080a0;">${escapeHtml(label)}</span>
      </td>
      <td style="padding:15px 18px;vertical-align:top;border-bottom:1px solid #fad4e4;">
        <span style="font:14px/1.5 'Courier New',Courier,monospace;color:#1a0a10;word-break:break-word;">${escapeHtml(value)}</span>
      </td>
    </tr>`
}

function buildEmailHtml(action: VisitorAction, visitorInfo: JsonObject, location: string, ip: string) {
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const userAgent = asString(visitorInfo.userAgent)
  const isMobile = /Mobile|Android|iPhone|iPad|webOS/i.test(userAgent)
  const device = asString(visitorInfo.device) || (isMobile ? 'Mobile' : 'Desktop')
  const browser = asString(visitorInfo.browser) || detectBrowser(userAgent)
  const timeStr = formatDuration(visitorInfo)
  const pagesStr = formatPages(visitorInfo)
  const referrer = formatReferrer(asString(visitorInfo.referrer))
  const actionLabel = action === 'start' ? 'New portfolio visitor' : action === 'final' ? 'Portfolio visit ended' : 'Portfolio visit update'
  const actionCopy = action === 'start'
    ? 'Someone just viewed your portfolio. Here is the quick read on where they came from and what they explored.'
    : 'A portfolio visitor session has new activity. Here is the latest read on what they explored.'

  return `
        <div style="margin:0;padding:0;background:#fce8f2;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#fce8f2;border-collapse:collapse;">
            <tr>
              <td align="center" style="padding:36px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;border-collapse:separate;border-spacing:0;background:#fff5f8;border:1px solid #f4c2d8;border-radius:18px;overflow:hidden;box-shadow:0 18px 46px rgba(35,10,25,0.12);">
                  <tr>
                    <td style="background:#2d0a1a;padding:30px 32px 28px;color:#fde8f0;">
                      <p style="margin:0 0 12px;font:700 11px/1.2 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:0.18em;color:#d49ab8;">erisazaimi.com</p>
                      <h1 style="margin:0;font:400 34px/1.05 Georgia,'Times New Roman',serif;letter-spacing:0;color:#fde8f0;">${escapeHtml(actionLabel)}</h1>
                      <p style="margin:13px 0 0;max-width:460px;font:14px/1.65 Arial,Helvetica,sans-serif;color:#e8b8d0;">${escapeHtml(actionCopy)}</p>
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
                        ${row('Referrer',     referrer)}
                        ${row('Pages',        pagesStr)}
                        ${row('Activity',     formatEvents(visitorInfo))}
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
      `
}

function messageDomain() {
  const from = env('VISITOR_EMAIL_FROM')
  const match = from.match(/@([^>\s]+)/)
  return match?.[1] || 'portfolio-tracker.local'
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function parseJsonBody(body: unknown) {
  if (!body) return {}
  if (typeof body === 'string') return JSON.parse(body)
  if (body instanceof Uint8Array) return JSON.parse(new TextDecoder().decode(body))

  return asObject(body)
}

export function visitorMetaFromRequest(req: ApiRequest) {
  const ip = (readHeader(req.headers, 'x-forwarded-for') || '').split(',')[0].trim()
    || readHeader(req.headers, 'x-real-ip')
    || 'unknown'
  const city = decodeHeader(readHeader(req.headers, 'x-vercel-ip-city'))
  const country = decodeHeader(readHeader(req.headers, 'x-vercel-ip-country'))
  const location = [city, country].filter(Boolean).join(', ') || 'Unknown'

  const geoHeaders = Object.fromEntries(
    Object.entries(req.headers).filter(([k]) => k.startsWith('x-vercel-ip'))
  )
  console.log('[tracker] geo:', JSON.stringify({ ip, city, country, location, geoHeaders }))

  return { city, country, ip, location }
}

export function generateThreadMessageId(sessionId: string) {
  const safeSession = sessionId.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 80) || 'session'
  const randomPart = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `<portfolio-${safeSession}-${randomPart}@${messageDomain()}>`
}

export async function ensureSessionsTable() {
  schemaReady ??= getSql()`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      visitor_info JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.then(() => undefined)

  return schemaReady
}

export async function getSession(id: string) {
  const rows = await getSql()`
    SELECT id, message_id, visitor_info
    FROM sessions
    WHERE id = ${id}
    LIMIT 1
  ` as SessionRow[]

  return rows[0] ?? null
}

export async function createSession(id: string, messageId: string, visitorInfo: JsonObject) {
  await getSql()`
    INSERT INTO sessions (id, message_id, visitor_info)
    VALUES (${id}, ${messageId}, ${JSON.stringify(visitorInfo)}::jsonb)
  `
}

export async function updateSessionInfo(id: string, visitorInfo: JsonObject) {
  await getSql()`
    UPDATE sessions
    SET visitor_info = ${JSON.stringify(visitorInfo)}::jsonb
    WHERE id = ${id}
  `
}

export async function deleteOldSessions() {
  const rows = await getSql()`
    DELETE FROM sessions
    WHERE created_at < NOW() - INTERVAL '7 days'
    RETURNING id
  ` as Array<{ id: string }>

  return rows.length
}

export async function sendVisitorEmail({
  action,
  visitorInfo,
  location,
  ip,
  messageId,
  replyToMessageId,
}: {
  action: VisitorAction
  visitorInfo: JsonObject
  location: string
  ip: string
  messageId?: string
  replyToMessageId?: string
}) {
  const from = env('VISITOR_EMAIL_FROM')
  const to = env('VISITOR_EMAIL_TO')

  if (!from) throw new Error('VISITOR_EMAIL_FROM is not configured')
  if (!to) throw new Error('VISITOR_EMAIL_TO is not configured')

  const headers: Record<string, string> = {}
  if (action === 'start' && messageId) headers['Message-ID'] = messageId
  if (replyToMessageId) {
    headers['In-Reply-To'] = replyToMessageId
    headers.References = replyToMessageId
  }

  const subject = action === 'start' ? `Portfolio visit - ${location}` : `Re: Portfolio visit - ${location}`
  const html = buildEmailHtml(action, visitorInfo, location, ip)

  const deliver = async () => {
    const result = await getResend().emails.send({
      from,
      to,
      subject,
      html,
      headers,
    })

    if (result.error) {
      throw new Error(result.error.message)
    }

    return result.data
  }

  try {
    return await deliver()
  } catch (error) {
    await sleep(600)
    return deliver()
  }
}

export function mergeVisitorInfo(previous: JsonObject, next: JsonObject, action: VisitorAction, meta: JsonObject) {
  return {
    ...previous,
    ...next,
    ...meta,
    lastAction: action,
    updatedAt: new Date().toISOString(),
  }
}

export function normalizeVisitorInfo(body: JsonObject) {
  const nested = asObject(body.visitor_info)
  const topLevel = { ...body }
  delete topLevel.visitor_info
  delete topLevel.action
  delete topLevel.session_id
  delete topLevel.sessionId

  return {
    ...topLevel,
    ...nested,
  }
}
