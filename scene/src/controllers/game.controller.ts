import { getPlayerPosition } from '@dcl-sdk/utils'
import { engine } from '@dcl/sdk/ecs'
import type { Vector3 } from '@dcl/sdk/math'
import {
  loadPlaceFromApi,
  loadSceneFromBevyApi,
  savePlayerPosition
} from 'src/state/sceneInfo/actions'
import { store } from 'src/state/store'
import {
  fetchPlaceFromCoords,
  getPlaceFromApi,
  updateFavoriteStatus,
  updateLikeStatus
} from 'src/utils/promise-utils'
import { type ReadOnlyVector3 } from '~system/EngineApi'
import { UIController } from './ui.controller'
import type { LiveSceneInfo } from 'src/bevy-api/interface'
import { BevyApi } from 'src/bevy-api'

export class GameController {
  public timer: number = 0
  uiController: UIController
  constructor() {
    this.uiController = new UIController(this)
    engine.addSystem(this.positionSystem.bind(this))
    this.restartTimer()
    // void this.getFavorites()
  }

  // public async getFavorites(): Promise<void> {
  //   const favoritePlaces = await getFavoritesFromApi()
  //   store.dispatch(loadFavoritesFromApi(favoritePlaces))
  // }

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
        void this.updateWidgetPlace()
      }
    }
  }

  updatingStatusSystem(dt: number): void {
    if (this.timer > 0) {
      this.timer -= dt
    } else {
      void this.updateStatus()

      this.restartTimer()
      void engine.removeSystem('updatingStatusSystem')
    }
  }

  restartTimer(): void {
    this.timer = 2
  }

  addUpdatingStatusSystem(): void {
    engine.addSystem(
      this.updatingStatusSystem.bind(this),
      1,
      'updatingStatusSystem'
    )
  }

  async updateWidgetPlace(): Promise<void> {
    const explorerCoords: ReadOnlyVector3 | undefined =
      store.getState().scene.explorerPlayerPosition
    if (explorerCoords === undefined) {
      return
    }

    const liveScenesInfo: LiveSceneInfo[] = await BevyApi.liveSceneInfo()
    const currentScene = liveScenesInfo.find((scene) =>
      scene.parcels.some(
        (parcel) =>
          parcel.x === explorerCoords.x && parcel.y === explorerCoords.z
      )
    )
    if (currentScene !== undefined)
      store.dispatch(loadSceneFromBevyApi(currentScene))

    const place = await fetchPlaceFromCoords(explorerCoords)
    const explorerPlace = await getPlaceFromApi(place.id)
    store.dispatch(loadPlaceFromApi(explorerPlace))
    void this.uiController.mainHud.sceneInfo.update()
  }

  async updateStatus(): Promise<void> {
    // Update fav status:
    const favToUpdate = store.getState().scene.sceneInfoCardFavToSend
    if (favToUpdate !== undefined) {
      await updateFavoriteStatus()
    }
    // Update like status:
    const likeToUpdate = store.getState().scene.sceneInfoCardLikeToSend
    if (likeToUpdate !== undefined) {
      await updateLikeStatus()
    }

    await this.uiController.sceneCard.refreshPlaceFromApi()
  }
}

let currentGameController: GameController
export function getCurrentGameController(): GameController {
  return currentGameController
}

export function setCurrentGameController(controller: GameController): void {
  currentGameController = controller
}
