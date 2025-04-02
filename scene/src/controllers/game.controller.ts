import { getPlayerPosition } from '@dcl-sdk/utils'
import { engine } from '@dcl/sdk/ecs'
import type { Vector3 } from '@dcl/sdk/math'
import { BevyApi } from 'src/bevy-api'
import type { LiveSceneInfo } from 'src/bevy-api/interface'
import {
  loadPlaceFromApi,
  loadSceneFromBevyApi,
  savePlayerPosition
} from 'src/state/sceneInfo/actions'
import { store } from 'src/state/store'
import {
  fetchPlaceFromCoords,
  fetchPlaceFromApi
} from 'src/utils/promise-utils'
import { type ReadOnlyVector3 } from '~system/EngineApi'
import { UIController } from './ui.controller'

export class GameController {
  public timer: number = 0
  uiController: UIController
  constructor() {
    this.uiController = new UIController(this)
    engine.addSystem(this.positionSystem.bind(this))
    // this.getFavorites().catch((reason)=>console.error(reason))
  }

  // TODO: This is to request all favorites places for a future tab in discover section
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
        this.updateWidgetPlace().catch((reason) => {
          console.error(reason)
        })
      }
    }
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
    const explorerPlace = await fetchPlaceFromApi(place.id)
    store.dispatch(loadPlaceFromApi(explorerPlace))
    this.uiController.mainHud.sceneInfo.update().catch((reason) => {
      console.error(reason)
    })
  }
}

let currentGameController: GameController
export function getCurrentGameController(): GameController {
  return currentGameController
}

export function setCurrentGameController(controller: GameController): void {
  currentGameController = controller
}
