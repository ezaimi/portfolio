import {
  createSession,
  ensureSessionsTable,
  generateThreadMessageId,
  getSession,
  mergeVisitorInfo,
  normalizeVisitorInfo,
  parseJsonBody,
  sendVisitorEmail,
  updateSessionInfo,
  visitorMetaFromRequest,
  type ApiRequest,
  type ApiResponse,
  type VisitorAction,
} from './visitorTracking'

function isVisitorAction(value: unknown): value is VisitorAction {
  return value === 'start' || value === 'update' || value === 'final'
}

function getSessionId(body: Record<string, unknown>) {
  const value = body.session_id || body.sessionId
  return typeof value === 'string' ? value.trim() : ''
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader?.('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const body = parseJsonBody(req.body)
    const action = body.action
    const sessionId = getSessionId(body)

    if (!isVisitorAction(action)) {
      return res.status(400).json({ ok: false, error: 'Invalid action' })
    }

    if (!sessionId) {
      return res.status(400).json({ ok: false, error: 'Missing session_id' })
    }

    await ensureSessionsTable()

    const meta = visitorMetaFromRequest(req)
    const visitorInfo = mergeVisitorInfo({}, normalizeVisitorInfo(body), action, meta)

    if (action === 'start') {
      const existing = await getSession(sessionId)
      if (existing) {
        return res.status(200).json({ ok: true, alreadyStarted: true, session_id: sessionId })
      }

      const messageId = generateThreadMessageId(sessionId)
      await sendVisitorEmail({
        action,
        visitorInfo,
        location: meta.location,
        ip: meta.ip,
        messageId,
      })
      await createSession(sessionId, messageId, visitorInfo)

      return res.status(200).json({ ok: true, session_id: sessionId, message_id: messageId })
    }

    const row = await getSession(sessionId)
    if (!row) {
      return res.status(404).json({ ok: false, error: 'Session not found' })
    }

    const nextInfo = mergeVisitorInfo(row.visitor_info, normalizeVisitorInfo(body), action, meta)
    await sendVisitorEmail({
      action,
      visitorInfo: nextInfo,
      location: meta.location,
      ip: meta.ip,
      replyToMessageId: row.message_id,
    })
    await updateSessionInfo(sessionId, nextInfo)

    return res.status(200).json({ ok: true, session_id: sessionId })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ok: false, error: 'Visitor tracking failed' })
  }
}
