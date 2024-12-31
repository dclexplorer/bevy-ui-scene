import { reducer } from './reducer'
import { settingsInitialState } from './settings/state'
import { type AppState, type Action } from './types'

export class Store {
  private state: AppState
  private listeners: Array<() => void> = []

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
    console.log(`Dispatching action: ${action.type}`, action)
    this.state = this.reducer(this.state, action)
    this.listeners.forEach((listener) => {
      listener()
    })
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }
}

export const store = new Store(reducer, {
  settings: settingsInitialState
})
