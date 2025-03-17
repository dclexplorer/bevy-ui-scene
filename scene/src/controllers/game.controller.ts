import { engine } from '@dcl/sdk/ecs'
import { UIController } from './ui.controller'
import { getPlayerPosition } from '@dcl-sdk/utils'
import { type Vector3 } from '@dcl/sdk/math'
import { store } from 'src/state/store'
import {
  loadFavoritesFromApi,
  savePlayerPosition
} from 'src/state/sceneInfo/actions'
import { getFavoritesFromApi } from 'src/utils/promise-utils'

export class GameController {
  uiController: UIController
  constructor() {
    this.uiController = new UIController(this)
    engine.addSystem(this.positionSystem.bind(this))
    if (store.getState().scene.explorerFavorites === undefined) {
      void this.getFavorites()
    }
  }

  public async getFavorites(): Promise<void> {
    const favoritePlaces = await getFavoritesFromApi()
    store.dispatch(loadFavoritesFromApi(favoritePlaces))
    void this.uiController.mainHud.sceneInfo.updateFavs()
    void this.uiController.sceneCard.updateFavs()
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
        this.changeParcel()
      }
    }
  }

  changeParcel(): void {
    void this.uiController.mainHud.sceneInfo.updateCoords()
  }
}

let currentGameController: GameController
export function getCurrentGameController(): GameController {
  return currentGameController
}

export function setCurrentGameController(controller: GameController): void {
  currentGameController = controller
}
