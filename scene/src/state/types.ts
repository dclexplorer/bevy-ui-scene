import type { AppActions } from './actions'
import type { PhotoState } from './photoInfo/state'
import type { SceneState } from './sceneInfo/state'
import type { SettingsState } from './settings/state'
import type { ViewportState } from './viewport/state'
import type { BackpackPageState } from './backpack/state'

export type AppState = {
  settings: SettingsState
  scene: SceneState
  photo: PhotoState
  viewport: ViewportState
  backpack: BackpackPageState
}

export type Action = AppActions
