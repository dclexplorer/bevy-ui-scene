import type { AppState, Action } from './types'
import { reducer as settingsReducer } from './settings/reducers'

export function reducer(state: AppState, action: Action): AppState {
  const newState = { ...state }

  if (action.__reducer === 'settings') {
    newState.settings = settingsReducer(state.settings, action)
  }

  return newState
}
