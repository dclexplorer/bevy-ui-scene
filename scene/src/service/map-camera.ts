import {
  CameraTransition,
  CinematicSettings,
  DeepReadonlyObject,
  EasingFunction,
  engine,
  Entity,
  executeTask,
  InputAction,
  InputModifier,
  MainCamera,
  PBMainCamera,
  PrimaryPointerInfo,
  Transform,
  Tween,
  VirtualCamera
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { updateHudStateAction } from '../state/hud/actions'
import { store } from '../state/store'
import { listenSystemAction } from './system-actions-emitter'
import { sleep } from '../utils/dcl-utils'
import { panCameraXZ, screenToGround } from './perspective-to-screen'
import { getViewportHeight, getViewportWidth } from './canvas-ratio'
import { getVector3Parcel } from './player-scenes'
import { getUiController } from '../controllers/ui.controller'
import { FOV } from '../ui-classes/main-hud/big-map/big-map-view'

type MapCameraState = {
  initialized: boolean
  defaultMainCamera: DeepReadonlyObject<PBMainCamera> | null
  dragActive: boolean
}

const state: MapCameraState = {
  initialized: false,
  defaultMainCamera: null,
  dragActive: false
}
const OFFSET_MAP_CAMERA = 300
export const ISO_OFFSET = [
  OFFSET_MAP_CAMERA,
  OFFSET_MAP_CAMERA * (8 / 6),
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
        deactivateDragMapSystem()
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
      VirtualCamera.getMutable(mapCamera).lookAtEntity = undefined
      Transform.getMutable(mapCamera).rotation = Quaternion.fromLookAt(
        Transform.getMutable(mapCamera).position,
        Transform.get(engine.PlayerEntity).position
      )
    })
  } else {
    const mapCameraTransform = Transform.getMutable(mapCamera)
    mapCameraTransform.position = Vector3.add(
      Transform.get(engine.PlayerEntity).position,
      Vector3.create(...ISO_OFFSET)
    )

    executeTask(async () => {
      await sleep(2000)
      VirtualCamera.getMutable(mapCamera).lookAtEntity = undefined

      Transform.getMutable(mapCamera).rotation = Quaternion.fromLookAt(
        Transform.get(mapCamera).position,
        Transform.get(engine.PlayerEntity).position
      )
    })
  }

  MainCamera.createOrReplace(engine.CameraEntity, {
    virtualCameraEntity: mapCamera
  })
  VirtualCamera.getMutable(mapCamera).lookAtEntity = engine.PlayerEntity

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

  // TODO show symbols
}

export const displaceCamera = (targetPosition: Vector3) => {
  const mapCameraTransform = Transform.get(getBigMapCameraEntity())
  const DISPLACE_TIME = 500 //TODO review to calculate time by displacement
  store.dispatch(
    updateHudStateAction({
      movingMap: true
    })
  )
  Tween.createOrReplace(getBigMapCameraEntity(), {
    mode: Tween.Mode.Move({
      start: Vector3.clone(mapCameraTransform.position),
      end: Vector3.add(targetPosition, Vector3.create(...ISO_OFFSET))
    }),
    duration: DISPLACE_TIME,
    easingFunction: EasingFunction.EF_EASECUBIC
  })
  executeTask(async () => {
    await sleep(DISPLACE_TIME)
    store.dispatch(
      updateHudStateAction({
        movingMap: false
      })
    )
  })
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

export const activateDragMapSystem = () => (state.dragActive = true)
export const deactivateDragMapSystem = () => (state.dragActive = false)

engine.addSystem((dt) => {
  if (state.dragActive) {
    const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
    if (!pointerInfo?.screenDelta?.x && !pointerInfo?.screenDelta?.y) return
    const bigMapCameraEntity = getBigMapCameraEntity()
    const mutableMapCameraTransform = Transform.getMutable(bigMapCameraEntity)
    const mapCameraTransform = Transform.get(bigMapCameraEntity)

    mutableMapCameraTransform.position = panCameraXZ(
      mapCameraTransform.position,
      mapCameraTransform.rotation,
      -(pointerInfo!.screenDelta!.x ?? 0),
      -(pointerInfo!.screenDelta!.y ?? 0),
      2
    )
  }
})
