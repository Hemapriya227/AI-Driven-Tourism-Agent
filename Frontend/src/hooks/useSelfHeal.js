import { useMemo } from 'react'

export function useSelfHeal(itinerary = [], events = []) {
  return useMemo(() => {
    if (!events.length) return itinerary

    const hasWeatherIssue = events.some((event) => event.type === 'rain' || event.type === 'delay')
    if (!hasWeatherIssue) return itinerary

    return itinerary.map((item) => {
      if (item.outdoor) {
        return {
          ...item,
          title: `${item.title} (Adjusted)`,
          note: 'Moved due to weather or delay trigger.'
        }
      }
      return item
    })
  }, [itinerary, events])
}
