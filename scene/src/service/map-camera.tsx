import {
  CameraTransition,
  DeepReadonlyObject,
  engine,
  Entity,
  InputAction,
  InputModifier,
  MainCamera,
  PBMainCamera,
  Transform,
  VirtualCamera
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { updateHudStateAction } from '../state/hud/actions'
import { store } from '../state/store'
import { listenSystemAction } from './system-actions-emitter'

type MapCameraState = {
  initialized: boolean
  defaultMainCamera: DeepReadonlyObject<PBMainCamera> | null
}

const state: MapCameraState = {
  initialized: false,
  defaultMainCamera: null
}

const ISO_OFFSET = [6, 8, -6].map((n) => n * 50)
let mapCamera: Entity

export const getBigMapCameraEntity = () => mapCamera
export const activateMapCamera = () => {
  if (!state.initialized) {
    listenSystemAction('Cancel', (pressed) => {
      if (store.getState().hud.mapModeActive && pressed) {
        console.log('Escape')
        deactivateMapCamera()
      }
    })
    mapCamera = engine.addEntity()
    state.defaultMainCamera = MainCamera.getOrNull(engine.CameraEntity)
    Transform.createOrReplace(mapCamera, {
      position: Vector3.add(
        Transform.get(engine.PlayerEntity).position,
        Vector3.create(...ISO_OFFSET)
      )
    })
    VirtualCamera.createOrReplace(mapCamera, {
      lookAtEntity: engine.PlayerEntity,
      defaultTransition: {
        transitionMode: {
          $case: 'time',
          time: 2
        }
      }
    })
    state.initialized = true
  }

  MainCamera.createOrReplace(engine.CameraEntity, {
    virtualCameraEntity: mapCamera
  })
  InputModifier.createOrReplace(engine.PlayerEntity, {
    mode: InputModifier.Mode.Standard({
      disableAll: true
    })
  })
  store.dispatch(
    updateHudStateAction({
      mapModeActive: true
    })
  )
}

export const deactivateMapCamera = () => {
  store.dispatch(
    updateHudStateAction({
      mapModeActive: false
    })
  )
  MainCamera.createOrReplace(engine.CameraEntity, {})
  InputModifier.createOrReplace(engine.PlayerEntity, {
    mode: InputModifier.Mode.Standard({
      disableAll: false
    })
  })
}
