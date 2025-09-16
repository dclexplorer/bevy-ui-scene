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
import { listenSystemAction } from './system-actions-emitter'

export enum MAP_VIEW_MODE {
  BIRD,
  PLAN
}

type MapCameraState = {
  initialized: boolean
  defaultMainCamera: DeepReadonlyObject<PBMainCamera> | null
  dragActive: boolean
  targetPosition: Vector3.MutableVector3
  mode: MAP_VIEW_MODE
  targetCameraOffset: Vector3
  transitioning: boolean
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

const state: MapCameraState = {
  initialized: false,
  defaultMainCamera: null,
  dragActive: false,
  targetPosition: Vector3.Zero(),
  mode: MAP_VIEW_MODE.BIRD,
  targetCameraOffset: ISO_OFFSET_3,
  transitioning: false
}

let mapCamera: Entity
let isKeyboardMoving = false

export const getBigMapCameraEntity = () => mapCamera

export const closeBigMapIfActive = () => {
  if (store.getState().hud.mapModeActive) {
    deactivateMapCamera()
  }
}

export const activateMapCamera = () => {
  engine.addSystem((dt: number) => {
    const bigMapCameraEntity = getBigMapCameraEntity()
    const cameraTransform = Transform.get(bigMapCameraEntity)
    const moveSpeed = dt * 600

    // Calculate movement directions based on camera rotation
    const forward = Vector3.rotate(Vector3.Forward(), cameraTransform.rotation)
    const right = Vector3.rotate(Vector3.Right(), cameraTransform.rotation)

    // Project vectors onto XZ plane (ignore Y component for map movement)
    const forwardXZ = Vector3.normalize(Vector3.create(forward.x, 0, forward.z))
    const rightXZ = Vector3.normalize(Vector3.create(right.x, 0, right.z))

    let movement = Vector3.Zero()
    let hasInput = false

    if (inputSystem.isPressed(InputAction.IA_FORWARD)) {
      movement = Vector3.add(movement, Vector3.scale(forwardXZ, moveSpeed))
      hasInput = true
    }
    if (inputSystem.isPressed(InputAction.IA_BACKWARD)) {
      movement = Vector3.subtract(movement, Vector3.scale(forwardXZ, moveSpeed))
      hasInput = true
    }
    if (inputSystem.isPressed(InputAction.IA_RIGHT)) {
      movement = Vector3.add(movement, Vector3.scale(rightXZ, moveSpeed))
      hasInput = true
    }
    if (inputSystem.isPressed(InputAction.IA_LEFT)) {
      movement = Vector3.subtract(movement, Vector3.scale(rightXZ, moveSpeed))
      hasInput = true
    }

    // Update movement state and store
    if (hasInput && !isKeyboardMoving) {
      isKeyboardMoving = true
      if (!store.getState().hud.movingMap) {
        store.dispatch(
          updateHudStateAction({
            movingMap: true
          })
        )
      }
    } else if (!hasInput && isKeyboardMoving) {
      isKeyboardMoving = false
      if (store.getState().hud.movingMap) {
        store.dispatch(
          updateHudStateAction({
            movingMap: false
          })
        )
      }
    }

    if (!Vector3.equals(movement, Vector3.Zero())) {
      state.targetPosition = Vector3.add(state.targetPosition, movement)
    }
  })

  if (!state.initialized) {
    listenSystemAction('CameraZoomIn', () => {
      const zoomFactor = 0.8 // Zoom in by 20%
      const newOffset = Vector3.scale(state.targetCameraOffset, zoomFactor)

      // Maintain minimum distance to prevent camera from going too close
      const minDistance = 200
      const offsetMagnitude = Vector3.length(newOffset)

      if (offsetMagnitude > minDistance) {
        state.targetCameraOffset = newOffset
      }
    })

    listenSystemAction('CameraZoomOut', () => {
      const zoomFactor = 1.25 // Zoom out by 25%
      const newOffset = Vector3.scale(state.targetCameraOffset, zoomFactor)

      // Maintain maximum distance to prevent camera from going too far
      const maxDistance = 3000
      const offsetMagnitude = Vector3.length(newOffset)

      if (offsetMagnitude < maxDistance) {
        state.targetCameraOffset = newOffset
      }
    })

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
  const DISPLACE_TIME = 500 // TODO review to calculate time by displacement
  const bigMapCameraEntity = getBigMapCameraEntity()
  const currentRotation = Transform.get(bigMapCameraEntity).rotation

  state.transitioning = true

  createMoveTween(
    Vector3.clone(state.targetCameraOffset),
    PLAN_OFFSET_3,
    DISPLACE_TIME / 1000,
    state.targetCameraOffset
  )
  const cameraEndPosition = Vector3.add(state.targetPosition, PLAN_OFFSET_3)
  const endRotation = Quaternion.fromLookAt(
    cameraEndPosition,
    state.targetPosition
  )
  // Calculate rotation for top-down view with North facing up
  const targetRotation = Quaternion.fromLookAt(
    Vector3.add(state.targetPosition, PLAN_OFFSET_3),
    state.targetPosition,
    Vector3.Forward() // North direction as up vector
  )

  createRotateTween(
    currentRotation,
    targetRotation,
    DISPLACE_TIME / 1000,
    Transform.getMutable(bigMapCameraEntity).rotation
  )

  state.mode = MAP_VIEW_MODE.PLAN

  // Clear transitioning state after animation completes
  executeTask(async () => {
    await sleep(DISPLACE_TIME)
    state.transitioning = false
  })
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
  state.dragActive = false
}

engine.addSystem((dt) => {
  if (state.dragActive) {
    console.log('drag')
    const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
    if (!pointerInfo?.screenDelta?.x && !pointerInfo?.screenDelta?.y) return
    const bigMapCameraEntity = getBigMapCameraEntity()
    const mapCameraTransform = Transform.get(bigMapCameraEntity)

    // Calculate movement directions based on camera rotation
    const forward = Vector3.rotate(
      Vector3.Forward(),
      mapCameraTransform.rotation
    )
    const right = Vector3.rotate(Vector3.Right(), mapCameraTransform.rotation)

    // Project vectors onto XZ plane (ignore Y component for map movement)
    const forwardXZ = Vector3.normalize(Vector3.create(forward.x, 0, forward.z))
    const rightXZ = Vector3.normalize(Vector3.create(right.x, 0, right.z))

    // Convert screen delta to movement (inverted for natural drag feel)
    const deltaX = -(pointerInfo!.screenDelta!.x ?? 0)
    const deltaY = pointerInfo!.screenDelta!.y ?? 0

    // Scale the movement
    const movementScale = 2

    // Apply movement based on camera orientation
    const horizontalMovement = Vector3.scale(rightXZ, deltaX * movementScale)
    const verticalMovement = Vector3.scale(forwardXZ, deltaY * movementScale)
    const totalMovement = Vector3.add(horizontalMovement, verticalMovement)

    state.targetPosition = Vector3.add(state.targetPosition, totalMovement)
  }
}, 1_000_001)
export const cameraPositionSystem = (dt: number) => {
  if (state.initialized) {
    const bigMapCameraEntity = getBigMapCameraEntity()
    const mutableMapCameraTransform = Transform.getMutable(bigMapCameraEntity)
    const targetCameraPosition = Vector3.add(
      state.targetPosition,
      state.targetCameraOffset
    )

    // Set camera position based on target position and camera offset
    mutableMapCameraTransform.position = targetCameraPosition

    // Only set camera rotation if not transitioning (let tweens handle rotation during transitions)
    if (!state.transitioning) {
      mutableMapCameraTransform.rotation = Quaternion.fromLookAt(
        targetCameraPosition,
        state.targetPosition
      )
    }
  }
}
engine.addSystem(cameraPositionSystem)
