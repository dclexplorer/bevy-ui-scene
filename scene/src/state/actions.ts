import type { EventsActions } from './sceneInfo/actions'
import type { SettingsActions } from './settings/actions'

export type AppActions = SettingsActions | EventsActions
