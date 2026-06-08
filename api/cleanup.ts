import {
  deleteOldSessions,
  ensureSessionsTable,
  type ApiRequest,
  type ApiResponse,
} from './visitorTracking'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader?.('Allow', 'GET, POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    await ensureSessionsTable()
    const deleted = await deleteOldSessions()

    return res.status(200).json({ ok: true, deleted })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ok: false, error: 'Cleanup failed' })
  }
}
