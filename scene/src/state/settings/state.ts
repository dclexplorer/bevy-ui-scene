import type { ExplorerSetting } from '../../bevy-api/interface'

export type SettingsState = {
  explorerSettings: Record<string, ExplorerSetting>
  newValues: Record<string, number>
}

export const settingsInitialState: SettingsState = {
  explorerSettings: {},
  newValues: {}
}
