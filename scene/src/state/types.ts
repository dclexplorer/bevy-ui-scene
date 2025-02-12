import type { AppActions } from './actions'
import type { SettingsState } from './settings/state'
import type { BackpackState } from './backpack/state'

export type AppState = {
  settings: SettingsState
  backpack: BackpackState
}

export type Action = AppActions
