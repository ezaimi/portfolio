import { useEffect } from 'react'
import {
  ANALYTICS_INTERACTION_EVENT,
  ANALYTICS_LOCATION_CHANGE_EVENT,
} from './analyticsEvents'

type AnalyticsEvent = {
  type: string
  at: string
  path: string
  label?: string
  href?: string
  source?: string
}

type VisitorAction = 'start' | 'update' | 'final'

const SESSION_KEY = 'portfolio:visitor-session-id'
const UPDATE_INTERVAL_MS = 15 * 60 * 1000
const SHORT_VISIT_SECONDS = 60

let activeTracker = false
let startSentForPage = false

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getSessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing

    const next = createSessionId()
    window.sessionStorage.setItem(SESSION_KEY, next)
    return next
  } catch {
    return createSessionId()
  }
}

function currentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function trimText(value: string, max = 90) {
  const normalized = value.replace(/\s+/g, ' ').trim()
  return normalized.length > max ? `${normalized.slice(0, max - 1)}...` : normalized
}

function getTargetLabel(target: Element) {
  const aria = target.getAttribute('aria-label')
  if (aria) return trimText(aria)

  const text = target.textContent
  if (text) return trimText(text)

  return target.tagName.toLowerCase()
}

function compactEvents(events: AnalyticsEvent[]) {
  return events.slice(-40)
}

function wrapHistoryMethod(method: 'pushState' | 'replaceState') {
  const original = window.history[method]

  window.history[method] = function wrappedHistoryMethod(...args: Parameters<History['pushState']>) {
    const result = original.apply(this, args)
    window.dispatchEvent(new Event(ANALYTICS_LOCATION_CHANGE_EVENT))
    return result
  } as History[typeof method]

  return () => {
    window.history[method] = original
  }
}

export default function VisitorSessionTracker() {
  useEffect(() => {
    if (activeTracker) return

    activeTracker = true

    const sessionId = getSessionId()
    const startedAt = Date.now()
    const pages: string[] = [currentPath()]
    let events: AnalyticsEvent[] = []
    let dirty = false
    let meaningfulActivity = false
    let sending = false
    let finalSent = false
    let lastInputAt = 0

    const addEvent = (event: Omit<AnalyticsEvent, 'at' | 'path'>, markDirty = true) => {
      const next = {
        ...event,
        at: new Date().toISOString(),
        path: currentPath(),
      }

      events = compactEvents([...events, next])

      if (markDirty) {
        dirty = true
        meaningfulActivity = true
      }
    }

    const buildPayload = (action: VisitorAction, finalReason?: string) => ({
      action,
      session_id: sessionId,
      visitor_info: {
        sessionId,
        startedAt: new Date(startedAt).toISOString(),
        sentAt: new Date().toISOString(),
        durationSeconds: Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
        url: window.location.href,
        path: currentPath(),
        title: document.title,
        referrer: document.referrer || '',
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: Array.from(navigator.languages || []),
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          pixelRatio: window.devicePixelRatio,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        pages: [...pages],
        events: compactEvents(events),
        finalReason,
      },
    })

    const send = async (action: VisitorAction, options: { beacon?: boolean; finalReason?: string } = {}) => {
      const payload = buildPayload(action, options.finalReason)
      const body = JSON.stringify(payload)
      const eventCount = events.length

      if (options.beacon && navigator.sendBeacon) {
        const sent = navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
        if (sent) return
      }

      if (sending && action !== 'final') return
      sending = true

      try {
        const response = await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: action === 'final',
        })

        if (response.ok && action !== 'final') {
          events = events.slice(eventCount)
          dirty = false
        }
      } catch {
        if (action !== 'final') dirty = true
      } finally {
        sending = false
      }
    }

    const recordLocation = (source = 'navigation') => {
      const path = currentPath()
      if (pages[pages.length - 1] === path) return

      pages.push(path)
      addEvent({ type: 'page_view', label: path, source })
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest('a,button,[role="button"],input,select,textarea,[data-analytics]')
        : null

      if (!target) return

      const href = target instanceof HTMLAnchorElement ? target.href : undefined
      const label = getTargetLabel(target)

      addEvent({
        type: 'click',
        label,
        href,
        source: 'document',
      })
    }

    const onInput = (event: Event) => {
      const now = Date.now()
      if (now - lastInputAt < 2000) return
      lastInputAt = now

      const target = event.target instanceof Element ? event.target : null
      addEvent({
        type: 'input',
        label: target ? getTargetLabel(target) : 'input',
        source: 'document',
      })
    }

    const onCustomInteraction = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail || {} : {}
      addEvent({
        type: String(detail.type || 'interaction'),
        label: typeof detail.label === 'string' ? detail.label : undefined,
        source: typeof detail.source === 'string' ? detail.source : 'custom',
      })
    }

    const finalize = (reason: string) => {
      if (finalSent) return

      const durationSeconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000))
      if (durationSeconds < SHORT_VISIT_SECONDS && !meaningfulActivity) return

      finalSent = true
      void send('final', { beacon: true, finalReason: reason })
    }

    const restorePushState = wrapHistoryMethod('pushState')
    const restoreReplaceState = wrapHistoryMethod('replaceState')

    const onHistoryLocationChange = () => recordLocation('history')
    const onPopState = () => recordLocation('popstate')
    const onHashChange = () => recordLocation('hashchange')
    const onPageHide = () => finalize('pagehide')
    const onBeforeUnload = () => finalize('beforeunload')

    window.addEventListener(ANALYTICS_LOCATION_CHANGE_EVENT, onHistoryLocationChange)
    window.addEventListener('popstate', onPopState)
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener(ANALYTICS_INTERACTION_EVENT, onCustomInteraction)
    window.addEventListener('pagehide', onPageHide)
    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('click', onClick, { capture: true })
    document.addEventListener('input', onInput, { capture: true })
    document.addEventListener('change', onInput, { capture: true })

    if (!startSentForPage) {
      startSentForPage = true
      void send('start')
    }

    const timer = window.setInterval(() => {
      if (dirty) void send('update')
    }, UPDATE_INTERVAL_MS)

    return () => {
      activeTracker = false
      window.clearInterval(timer)
      restorePushState()
      restoreReplaceState()
      window.removeEventListener(ANALYTICS_LOCATION_CHANGE_EVENT, onHistoryLocationChange)
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener(ANALYTICS_INTERACTION_EVENT, onCustomInteraction)
      window.removeEventListener('pagehide', onPageHide)
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onClick, { capture: true })
      document.removeEventListener('input', onInput, { capture: true })
      document.removeEventListener('change', onInput, { capture: true })
    }
  }, [])

  return null
}
