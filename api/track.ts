import {
  createSession,
  ensureSessionsTable,
  generateThreadMessageId,
  getSession,
  hasSessionStore,
  mergeVisitorInfo,
  normalizeVisitorInfo,
  parseJsonBody,
  sendVisitorEmail,
  updateSessionInfo,
  visitorMetaFromRequest,
  type ApiRequest,
  type ApiResponse,
  type SessionRow,
  type VisitorAction,
} from './visitorTracking.js'

function isVisitorAction(value: unknown): value is VisitorAction {
  return value === 'start' || value === 'update' || value === 'final'
}

function getSessionId(body: Record<string, unknown>) {
  const value = body.session_id || body.sessionId
  return typeof value === 'string' ? value.trim() : ''
}

function logSessionStoreIssue(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.warn(`[tracker] session store unavailable: ${message}`)
}

async function findStoredSession(sessionId: string): Promise<{ available: boolean; row: SessionRow | null }> {
  if (!hasSessionStore()) return { available: false, row: null }

  try {
    await ensureSessionsTable()
    return { available: true, row: await getSession(sessionId) }
  } catch (error) {
    logSessionStoreIssue(error)
    return { available: false, row: null }
  }
}

async function storeNewSession(sessionId: string, messageId: string, visitorInfo: Record<string, unknown>) {
  try {
    await createSession(sessionId, messageId, visitorInfo)
    return true
  } catch (error) {
    logSessionStoreIssue(error)
    return false
  }
}

async function storeUpdatedSession(sessionId: string, visitorInfo: Record<string, unknown>) {
  try {
    await updateSessionInfo(sessionId, visitorInfo)
    return true
  } catch (error) {
    logSessionStoreIssue(error)
    return false
  }
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

    const meta = visitorMetaFromRequest(req)
    const visitorInfo = mergeVisitorInfo({}, normalizeVisitorInfo(body), action, meta)
    const storedSession = await findStoredSession(sessionId)

    if (action === 'start') {
      if (storedSession.row) {
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
      const session_stored = storedSession.available
        ? await storeNewSession(sessionId, messageId, visitorInfo)
        : false

      return res.status(200).json({ ok: true, session_id: sessionId, message_id: messageId, session_stored })
    }

    const nextInfo = mergeVisitorInfo(storedSession.row?.visitor_info ?? {}, normalizeVisitorInfo(body), action, meta)
    await sendVisitorEmail({
      action,
      visitorInfo: nextInfo,
      location: meta.location,
      ip: meta.ip,
      messageId: storedSession.row ? undefined : generateThreadMessageId(`${sessionId}-${action}`),
      replyToMessageId: storedSession.row?.message_id,
    })
    const session_stored = storedSession.available && storedSession.row
      ? await storeUpdatedSession(sessionId, nextInfo)
      : false

    return res.status(200).json({ ok: true, session_id: sessionId, session_stored })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ok: false, error: 'Visitor tracking failed' })
  }
}
