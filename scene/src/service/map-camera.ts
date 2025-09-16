import {
  DeepReadonlyObject,
  EasingFunction,
  engine,
  Entity,
  executeTask,
  InputAction,
  InputModifier,
  inputSystem,
  MainCamera,
  PBMainCamera,
  PrimaryPointerInfo,
  Rotate,
  Transform,
  Tween,
  TweenSequence,
  TweenState,
  VirtualCamera
} from '@dcl/sdk/ecs'
import { Quaternion, Vector2, Vector3 } from '@dcl/sdk/math'
import { updateHudStateAction } from '../state/hud/actions'
import { store } from '../state/store'
import { sleep } from '../utils/dcl-utils'
import { panCameraXZ } from './perspective-to-screen'
import { getUiController } from '../controllers/ui.controller'
import { fromParcelCoordsToPosition } from './map-places'
import { createMoveTween, createRotateTween, createTween } from './tween'

export enum MAP_VIEW_MODE {
  BIRD,
  PLAN
}

type MapCameraState = {
  initialized: boolean
  defaultMainCamera: DeepReadonlyObject<PBMainCamera> | null
  dragActive: boolean
  targetPosition: Vector3
  mode: MAP_VIEW_MODE
}

const state: MapCameraState = {
  initialized: false,
  defaultMainCamera: null,
  dragActive: false,
  targetPosition: Vector3.Zero(),
  mode: MAP_VIEW_MODE.BIRD
}

const OFFSET_MAP_CAMERA = 300
export const ISO_OFFSET = [
  OFFSET_MAP_CAMERA,
  OFFSET_MAP_CAMERA * (8 / 6),
  -OFFSET_MAP_CAMERA
].map((i) => i * 2)

export const PLAN_OFFSET = [0, OFFSET_MAP_CAMERA * (8 / 6), 0].map((i) => i * 2)
export const PLAN_OFFSET_3 = Vector3.create(...PLAN_OFFSET)

export const ISO_OFFSET_3 = Vector3.create(...ISO_OFFSET)
let mapCamera: Entity

export const getBigMapCameraEntity = () => mapCamera

export const closeBigMapIfActive = () => {
  if (store.getState().hud.mapModeActive) {
    deactivateMapCamera()
  }
}

export const activateMapCamera = () => {
  engine.addSystem((dt: number) => {
    const mapCameraPosition = Transform.getMutable(
      getBigMapCameraEntity()
    ).position

    if (inputSystem.isPressed(InputAction.IA_FORWARD)) {
      mapCameraPosition.z += dt * 300
      mapCameraPosition.x -= dt * 300
    }
    if (inputSystem.isPressed(InputAction.IA_RIGHT)) {
      mapCameraPosition.z += dt * 300
      mapCameraPosition.x += dt * 300
    }
    if (inputSystem.isPressed(InputAction.IA_LEFT)) {
      mapCameraPosition.z -= dt * 300
      mapCameraPosition.x -= dt * 300
    }
    if (inputSystem.isPressed(InputAction.IA_BACKWARD)) {
      mapCameraPosition.z -= dt * 300
      mapCameraPosition.x += dt * 300
    }
  })

  if (!state.initialized) {
    state.targetPosition = Vector3.clone(
      Transform.get(engine.PlayerEntity).position
    )
    console.log(
      'targetPosition coords',
      Math.floor(state.targetPosition.x / 16),
      Math.floor(state.targetPosition.z / 16)
    )

    mapCamera = engine.addEntity()
    state.defaultMainCamera = MainCamera.getOrNull(engine.CameraEntity)
    Transform.createOrReplace(mapCamera, {
      position: Vector3.add(
        Transform.get(engine.PlayerEntity).position,
        ISO_OFFSET_3
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
      ISO_OFFSET_3
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

export const changeToPlanMode = () => {
  const DISPLACE_TIME = 500 //TODO review to calculate time by displacement
  const mapCameraTransform = Transform.get(getBigMapCameraEntity())

  console.log('88,88', fromParcelCoordsToPosition({ x: 88, y: 88 }))
  const cameraEndPosition = Vector3.add(state.targetPosition, PLAN_OFFSET_3)
  console.log(
    'targetPosition',
    Math.floor(state.targetPosition.x / 16),
    Math.floor(state.targetPosition.z / 16)
  )
  console.log(
    'cameraStartPosition',
    Math.floor(mapCameraTransform.position.x / 16),
    Math.floor(mapCameraTransform.position.z / 16)
  )
  console.log(
    'cameraEndPosition',
    Math.floor(cameraEndPosition.x / 16),
    Math.floor(cameraEndPosition.z / 16)
  )

  const endRotation = Quaternion.fromLookAt(
    cameraEndPosition,
    state.targetPosition
  )
  const mutableCameraTransform = Transform.getMutable(getBigMapCameraEntity())
  /*
  TweenSequence.createOrReplace(getBigMapCameraEntity(), {
    // TODO create different RotateTween and MoveTween components to be able to apply at the same time
    sequence: [
      {
        mode: Tween.Mode.Move({
          start: Vector3.clone(mapCameraTransform.position),
          end: cameraEndPosition
        }),
        duration: DISPLACE_TIME / 2,
        easingFunction: EasingFunction.EF_EASECUBIC
      },
      {
        mode: Tween.Mode.Rotate({
          start: mapCameraTransform.rotation,
          end: Quaternion.fromLookAt(cameraEndPosition, state.targetPosition)
        }),
        duration: DISPLACE_TIME / 2,
        easingFunction: EasingFunction.EF_EASECUBIC
      }
    ]
  })*/

  createMoveTween(
    Vector3.clone(mapCameraTransform.position),
    cameraEndPosition,
    DISPLACE_TIME / 1000,
    mutableCameraTransform.position
  )

  createRotateTween(
    mapCameraTransform.rotation,
    endRotation,
    DISPLACE_TIME / 1000,
    mutableCameraTransform.rotation
  )
}

export const displaceCamera = (targetPosition: Vector3) => {
  const mapCameraTransform = Transform.get(getBigMapCameraEntity())
  const DISPLACE_TIME = 500 //TODO review to calculate time by displacement
  if (!store.getState().hud.movingMap) {
    store.dispatch(
      updateHudStateAction({
        movingMap: true
      })
    )
  }

  Tween.createOrReplace(getBigMapCameraEntity(), {
    mode: Tween.Mode.Move({
      start: Vector3.clone(mapCameraTransform.position),
      end: Vector3.add(targetPosition, ISO_OFFSET_3)
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
    state.targetPosition = Vector3.clone(targetPosition)
    console.log('targetPosition place coords')
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
  deactivateDragMapSystem()
  getUiController().sceneCard.hide()
  // TODO REVIEW: dispose resources ?
}

export const activateDragMapSystem = () => (state.dragActive = true)
export const deactivateDragMapSystem = () => {
  state.targetPosition = Vector3.subtract(
    Transform.get(getBigMapCameraEntity()).position,
    ISO_OFFSET_3
  )
  state.dragActive = false
}

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
}, 1_000_001)
