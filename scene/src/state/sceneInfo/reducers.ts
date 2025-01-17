import type { EventsActions } from './actions'
import { eventsInitialState, type EventsState } from './state'

export function reducer(
  state: EventsState = eventsInitialState,
  action: EventsActions
): EventsState {
  switch (action.type) {
    case 'GET_EVENTS_FROM_API':
      return { ...state, explorerEvents: action.payload }

    default:
      return state
  }
}
