import type { AppActions } from './actions'
import type { SettingsState } from './settings/state'

export type AppState = {
  settings: SettingsState
}

export type Action = AppActions
