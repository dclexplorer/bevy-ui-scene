import type { AppActions } from './actions'
import type { EventsState } from './sceneInfo/state'
import type { SettingsState } from './settings/state'

export type AppState = {
  settings: SettingsState
  events: EventsState
}

export type Action = AppActions
