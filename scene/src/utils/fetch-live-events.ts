import { type EventFromApi } from '../ui-classes/scene-info-card/SceneInfoCard.types'

export const fetchLiveEvents = async (): Promise<EventFromApi[]> => {
  try {
    const liveEvents = await fetch(
      'https://events.decentraland.org/api/events/?list=live'
    )
      .then(async (res) => await res.json())
      .then((r) => r.data)
    return liveEvents
  } catch (error) {
    console.error('Error fetching live events:', error)
    return []
  }
}
