import { Quaternion } from '@dcl/sdk/math'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getContentHeight, getContentWidth } from '../../service/canvas-ratio'
import {
  getAvatarCamera,
  getAvatarPreviewQuaternion,
  setAvatarPreviewRotation,
  setAvatarPreviewZoomFactor
} from './AvatarPreview'
import { engine, PrimaryPointerInfo } from '@dcl/sdk/ecs'

const ROTATION_FACTOR = 0.5
const ZOOM_FACTOR = 0.004
const state = {
  avatarZoomFactor: 1
}

export function AvatarPreviewElement(): ReactElement {
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
          onMouseDragLocked={() => {
            const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
            const deltaX: number = pointerInfo?.screenDelta?.x ?? 0
            const deltaY: number = pointerInfo?.screenDelta?.y ?? 0
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

            state.avatarZoomFactor += deltaY * ZOOM_FACTOR
            state.avatarZoomFactor = Math.min(
              2,
              Math.max(state.avatarZoomFactor, 0.5)
            )
            setAvatarPreviewRotation(
              Quaternion.multiply(initialQuaternionCopy, qY)
            )
            setAvatarPreviewZoomFactor(state.avatarZoomFactor)
          }}
          uiBackground={{
            // color:Color4.Red(),
            videoTexture: { videoPlayerEntity: getAvatarCamera() }
          }}
        />
      )}
    </UiEntity>
  )
}
