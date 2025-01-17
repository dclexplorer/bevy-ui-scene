import { type EventFromApi } from 'src/ui-classes/scene-info-card/SceneInfoCard.types'

export type EventsState = {
  explorerEvents: EventFromApi[]
}

export const eventsInitialState: EventsState = { explorerEvents: [] }
