import type { AppActions } from './actions'
import type { SceneState } from './sceneInfo/state'
import type { SettingsState } from './settings/state'

export type AppState = {
  settings: SettingsState
  scene: SceneState
}

export type Action = AppActions
