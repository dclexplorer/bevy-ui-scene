import { Quaternion } from '@dcl/sdk/math'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getContentHeight, getContentWidth } from '../../service/canvas-ratio'
import { getAvatarCamera, getAvatarPreviewQuaternion, setAvatarPreviewRotation } from './AvatarPreview'
import { engine, PrimaryPointerInfo } from '@dcl/sdk/ecs'

const ROTATION_FACTOR = 0.5;

export function AvatarPreviewElement(): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        height: getContentHeight(),
        width: (540 / 1920) * getContentWidth() * 0.85
      }}
      uiText={{ value: '1' }}
    >
      {getAvatarCamera() === engine.RootEntity ? null : (
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position:{
              left:"-75%",
              top:"-5%"
            },
            width: '250%',
            height: '125%'
          }}

          onMouseDragLocked={()=>{
            const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity);
            const deltaX:number = pointerInfo?.screenDelta?.x ?? 0
            const qY = Quaternion.fromAngleAxis(deltaX * ROTATION_FACTOR, { x: 0, y: 1, z: 0 })
            const avatarRotation = getAvatarPreviewQuaternion();
            const initialQuaternionCopy = Quaternion.create(
              avatarRotation.x,
              avatarRotation.y,
              avatarRotation.z,
              avatarRotation.w)
            setAvatarPreviewRotation(Quaternion.multiply(initialQuaternionCopy, qY))
          }}
          uiBackground={{
            videoTexture: { videoPlayerEntity: getAvatarCamera() }
          }}
        />
      )}
    </UiEntity>
  )
}
