import type { PhotoActions } from './photoInfo/actions'
import type { SceneActions } from './sceneInfo/actions'
import type { SettingsActions } from './settings/actions'

export type AppActions = SettingsActions | SceneActions | PhotoActions
