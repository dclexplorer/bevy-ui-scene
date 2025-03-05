import type { AppActions } from './actions'
import type { PhotoState } from './photoInfo/state'
import type { SceneState } from './sceneInfo/state'
import type { SettingsState } from './settings/state'
import type { ViewportState } from "./viewport/state"
import type {reducer as settingsReducer} from "./settings/reducers";
import type {reducer as eventsReducer} from "./sceneInfo/reducers";
import type {reducer as photoReducer} from "./photoInfo/reducers";
import type {reducer as viewportReducer} from "./viewport/reducers";

export type AppState = {
  settings: SettingsState
  scene: SceneState
  photo: PhotoState
  viewport: ViewportState
}

export type ReducersMap = {
  settings: typeof settingsReducer;
  scene: typeof eventsReducer;
  photo: typeof photoReducer;
  viewport: typeof viewportReducer;
};


export type Action = AppActions
