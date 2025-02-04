import type { AppActions } from './actions'
import type { PhotoState } from './photoInfo/state'
import type { SceneState } from './sceneInfo/state'
import type { SettingsState } from './settings/state'

export type AppState = {
  settings: SettingsState
  scene: SceneState
  photo: PhotoState
}

export type Action = AppActions
