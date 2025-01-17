import type { AppState, Action } from './types'
import { reducer as settingsReducer } from './settings/reducers'
import { reducer as eventsReducer } from './sceneInfo/reducers'

export function reducer(state: AppState, action: Action): AppState {
  const newState = { ...state }

  if (action.__reducer === 'settings') {
    newState.settings = settingsReducer(state.settings, action)
  }
  if (action.__reducer === 'events') {
    newState.events = eventsReducer(state.events, action)
  }

  return newState
}
