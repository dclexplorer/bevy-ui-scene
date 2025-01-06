import { BevyApi } from '../../bevy-api'
import type { SettingsActions } from './actions'
import { settingsInitialState, type SettingsState } from './state'

export function reducer(
  state: SettingsState = settingsInitialState,
  action: SettingsActions
): SettingsState {
  switch (action.type) {
    case 'LOAD_SETTINGS_FROM_EXPLORER':
      return { ...state, explorerSettings: action.payload }
    case 'SAVE_SETTINGS_TO_EXPLORER': {
      const keys = Object.keys(state.newValues)
      if (keys.length === 0) {
        return state
      }

      const newExplorerSettings = { ...state.explorerSettings }
      for (const [name, value] of Object.entries(state.newValues)) {
        newExplorerSettings[name].value = value

        // this takes a responsability that it should not
        BevyApi.setSetting(name, value).catch((error) => {
          console.error('Failed to save setting', name, value, error)
        })
      }
      return { ...state, explorerSettings: newExplorerSettings, newValues: {} }
    }
    case 'DISCARD_NEW_VALUES': {
      return { ...state, newValues: {} }
    }
    case 'SET_SETTING_VALUE': {
      const { name, value } = action.payload

      // safety check
      if (state.explorerSettings[name] === undefined) {
        return state
      }

      // if the value is the same as the saved value, remove it from the newValues
      const savedStateValue = state.explorerSettings[name].value
      if (savedStateValue === value) {
        const newValues = { ...state.newValues }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete newValues[name]
        return { ...state, newValues }

        // return { ...state, newValues: { ...state.newValues, [name]: undefined } }
      }

      return { ...state, newValues: { ...state.newValues, [name]: value } }
    }
    default:
      return state
  }
}
