import {
  CameraTransition,
  DeepReadonlyObject,
  engine,
  Entity,
  executeTask,
  InputAction,
  InputModifier,
  MainCamera,
  PBMainCamera,
  Transform,
  VirtualCamera
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { updateHudStateAction } from '../state/hud/actions'
import { store } from '../state/store'
import { listenSystemAction } from './system-actions-emitter'
import { sleep } from '../utils/dcl-utils'
import { cloneDeep } from '../utils/function-utils'

type MapCameraState = {
  initialized: boolean
  defaultMainCamera: DeepReadonlyObject<PBMainCamera> | null
}

const state: MapCameraState = {
  initialized: false,
  defaultMainCamera: null
}
const OFFSET_MAP_CAMERA = 500
export const ISO_OFFSET = [
  OFFSET_MAP_CAMERA,
  OFFSET_MAP_CAMERA * 1.5,
  -OFFSET_MAP_CAMERA
]
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

    executeTask(async () => {
      await sleep(2000)
      const r = Transform.get(mapCamera).rotation
      const q = Quaternion.create(r.x, r.y, r.z, r.w)
      await sleep(1)
      const vc = VirtualCamera.getMutable(mapCamera)
      vc.lookAtEntity = undefined
      Transform.getMutable(mapCamera).rotation = Quaternion.fromLookAt(
        Transform.getMutable(mapCamera).position,
        Transform.get(engine.PlayerEntity).position
      )
    })
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
