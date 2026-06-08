export const ANALYTICS_LOCATION_CHANGE_EVENT = 'portfolio:analytics-location-change'
export const ANALYTICS_INTERACTION_EVENT = 'portfolio:analytics-interaction'

type AnalyticsDetail = Record<string, unknown>

function dispatchAnalyticsEvent(name: string, detail: AnalyticsDetail) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent(name, { detail }))
}

export function trackVisitorInteraction(detail: AnalyticsDetail = {}) {
  dispatchAnalyticsEvent(ANALYTICS_INTERACTION_EVENT, detail)
}

export function trackTemplateInteraction(detail: AnalyticsDetail = {}) {
  dispatchAnalyticsEvent(ANALYTICS_INTERACTION_EVENT, {
    ...detail,
    type: detail.type || 'template_interaction',
  })
}
