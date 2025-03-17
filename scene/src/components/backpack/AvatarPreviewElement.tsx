import { Color4, Quaternion, Vector2 } from '@dcl/sdk/math'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  getCanvasScaleRatio,
  getContentHeight,
  getContentWidth
} from '../../service/canvas-ratio'
import {
  getAvatarCamera,
  getAvatarPreviewQuaternion,
  setAvatarPreviewRotation,
  setAvatarPreviewZoomFactor
} from './AvatarPreview'
import {
  engine,
  PrimaryPointerInfo,
  UiScrollResult,
  UiTransform
} from '@dcl/sdk/ecs'

const ROTATION_FACTOR = 0.5
const state = {
  listenZoom: false,
  zoomFactor: 0.5
}

function AvatarPreviewZoomSystem(): void {
  if (state.listenZoom) {
    for (const [, pos] of engine.getEntitiesWith(UiScrollResult, UiTransform)) {
      if (pos.value === undefined) continue
      state.zoomFactor = pos.value.y
      setAvatarPreviewZoomFactor(state.zoomFactor)
    }
  }
}

engine.addSystem(AvatarPreviewZoomSystem)

export function AvatarPreviewElement(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        height: getContentHeight(),
        width: (540 / 1920) * getContentWidth() * 0.85
      }}
    >
      {getAvatarCamera() === engine.RootEntity ? null : (
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: {
              left: '-75%'
            },
            width: '250%',
            height: '140%'
          }}
          uiBackground={{
            // color:Color4.Red(),
            videoTexture: { videoPlayerEntity: getAvatarCamera() }
          }}
        >
          <UiEntity
            key="avatar-preview-zoom"
            onMouseDragLocked={() => {
              const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
              const deltaX: number = pointerInfo?.screenDelta?.x ?? 0
              const qY = Quaternion.fromAngleAxis(deltaX * ROTATION_FACTOR, {
                x: 0,
                y: 1,
                z: 0
              })
              const avatarRotation = getAvatarPreviewQuaternion()
              const initialQuaternionCopy = Quaternion.create(
                avatarRotation.x,
                avatarRotation.y,
                avatarRotation.z,
                avatarRotation.w
              )
              setAvatarPreviewRotation(
                Quaternion.multiply(initialQuaternionCopy, qY)
              )
            }}
            uiTransform={{
              height: '100%',
              width: '100%',
              overflow: 'scroll',
              scrollPosition: state.listenZoom
                ? undefined
                : Vector2.create(0, state.zoomFactor),
              scrollVisible: 'hidden'
            }}
            onMouseEnter={() => (state.listenZoom = true)}
            onMouseLeave={() => (state.listenZoom = false)}
          >
            <UiEntity
              uiTransform={{
                height: 10000 * canvasScaleRatio,
                width: '100%'
              }}
              uiText={{
                value: '1'
              }}
            ></UiEntity>
          </UiEntity>
        </UiEntity>
      )}
    </UiEntity>
  )
}
