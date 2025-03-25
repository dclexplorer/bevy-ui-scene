import type { Action, AppState } from './types'
import { reducer as settingsReducer } from './settings/reducers'
import { reducer as eventsReducer } from './sceneInfo/reducers'
import { reducer as photoReducer } from './photoInfo/reducers'
import { reducer as viewportReducer } from './viewport/reducers'
import { reducer as backpackReducer } from './backpack/reducers'
import { VIEWPORT_STORE_ID } from './viewport/state'
import { deepFreeze } from '../utils/object-utils'
import { BACKPACK_STORE_ID } from './backpack/state'

export function reducer(state: AppState, action: Action): AppState {
  const newState = { ...state }

  if (action.__reducer === 'settings') {
    newState.settings = settingsReducer(state.settings, action)
  }
  if (action.__reducer === 'scene') {
    newState.scene = eventsReducer(state.scene, action)
  }
  if (action.__reducer === 'photo') {
    newState.photo = photoReducer(state.photo, action)
  }
  if (action.__reducer === VIEWPORT_STORE_ID) {
    newState.viewport = deepFreeze(viewportReducer(state.viewport, action))
  }
  if (action.__reducer === BACKPACK_STORE_ID) {
    newState.backpack = deepFreeze(backpackReducer(state.backpack, action))
  }

  return newState
}
