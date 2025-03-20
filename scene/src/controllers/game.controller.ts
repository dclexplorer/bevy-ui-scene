import { getPlayerPosition } from '@dcl-sdk/utils'
import { engine } from '@dcl/sdk/ecs'
import { type Vector3 } from '@dcl/sdk/math'
import {
  loadFavoritesFromApi,
  loadPlaceFromApi,
  loadSceneInfoPlaceFromApi,
  savePlayerPosition
} from 'src/state/sceneInfo/actions'
import { store } from 'src/state/store'
import {
  fetchPlaceId,
  getFavoritesFromApi,
  getPlaceFromApi
} from 'src/utils/promise-utils'
import { type ReadOnlyVector3 } from '~system/EngineApi'
import { UIController } from './ui.controller'

export class GameController {
  uiController: UIController
  constructor() {
    this.uiController = new UIController(this)
    engine.addSystem(this.positionSystem.bind(this))
    void this.getFavorites()
  }

  public async getFavorites(): Promise<void> {
    const favoritePlaces = await getFavoritesFromApi()
    store.dispatch(loadFavoritesFromApi(favoritePlaces))
  }

  positionSystem(): void {
    if (engine.PlayerEntity !== undefined) {
      const newPosition: Vector3 = getPlayerPosition()
      const oldPosition: Vector3 | undefined =
        store.getState().scene.explorerPlayerPosition

      if (
        oldPosition === undefined ||
        Math.floor(newPosition.x / 16) !== oldPosition.x ||
        Math.floor(newPosition.z / 16) !== oldPosition.z
      ) {
        store.dispatch(
          savePlayerPosition({
            x: Math.floor(newPosition.x / 16),
            y: 0,
            z: Math.floor(newPosition.z / 16)
          })
        )
        void this.updateWidgetParcel()
      }
    }
  }

  async updateWidgetParcel(): Promise<void> {
    const coords: ReadOnlyVector3 | undefined =
      store.getState().scene.explorerPlayerPosition
    if (coords === undefined) {
      return
    }
    const place = await fetchPlaceId(coords)
    const explorerPlace = await getPlaceFromApi(place.id)
    store.dispatch(loadPlaceFromApi(explorerPlace))
    if (place.id === store.getState().scene.sceneInfoCardPlace?.id) {
      await this.updateCardParcel(coords)  
    }
    void this.uiController.mainHud.sceneInfo.update()

  }

  async updateCardParcel(sceneCoords: Vector3): Promise<void> {
    const infoCardPlace = await fetchPlaceId(sceneCoords)
    const sceneInfoCardPlace = await getPlaceFromApi(infoCardPlace.id)
    store.dispatch(loadSceneInfoPlaceFromApi(sceneInfoCardPlace))
    void this.uiController.sceneCard.updateSceneInfo()
  }
}

let currentGameController: GameController
export function getCurrentGameController(): GameController {
  return currentGameController
}

export function setCurrentGameController(controller: GameController): void {
  currentGameController = controller
}
