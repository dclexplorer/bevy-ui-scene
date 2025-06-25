import { sceneInitialState } from './sceneInfo/state'
import { settingsInitialState } from './settings/state'
import { photoInitialState } from './photoInfo/state'
import { reducer } from './reducer'
import { type AppState, type Action } from './types'
import { viewportInitialState } from './viewport/state'
import { backpackInitialState } from './backpack/state'
import { hudInitialState } from './hud/state'
import { cloneDeep } from '../utils/function-utils'

export class Store {
  private state: AppState
  private listeners: Array<
    (action: Record<string, unknown>, previousState: AppState) => void
  > = []

  constructor(
    private readonly reducer: (state: AppState, action: Action) => AppState,
    initialState: AppState
  ) {
    this.state = initialState
  }

  getState(): AppState {
    return this.state
  }

  dispatch(action: Action): void {
    const previousState: AppState = cloneDeep(this.state)
    this.state = this.reducer(this.state, action)
    this.listeners.forEach((listener) => {
      listener(action, previousState)
    })
  }

  subscribe(
    listener: (action: Record<string, unknown>, previousState: AppState) => void
  ): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }
}

export const store = new Store(reducer, {
  settings: settingsInitialState,
  scene: sceneInitialState,
  photo: photoInitialState,
  viewport: viewportInitialState,
  backpack: backpackInitialState,
  hud: hudInitialState
})
