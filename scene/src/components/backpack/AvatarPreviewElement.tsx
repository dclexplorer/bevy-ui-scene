import { Quaternion, Vector2 } from '@dcl/sdk/math'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getContentHeight, getContentWidth } from '../../service/canvas-ratio'
import { getAvatarCamera, getAvatarPreviewQuaternion, setAvatarPreviewRotation } from './AvatarPreview'
import { engine, PrimaryPointerInfo } from '@dcl/sdk/ecs'

type AvatarPreviewState = {
  dragStartPoint:Vector2
  initialQuaternion:Quaternion
};

const avatarPreviewState:AvatarPreviewState = {
  dragStartPoint:Vector2.create(0,0),
  initialQuaternion:Quaternion.Zero()
}

const ROTATION_FACTOR = 0.2;

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
          onMouseDown={()=>{
            const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity);
            avatarPreviewState.dragStartPoint = pointerInfo.screenCoordinates as Vector2;
            const {x,y,z,w} = getAvatarPreviewQuaternion()
            avatarPreviewState.initialQuaternion = Quaternion.create(x,y,z,w);
          }}

          onMouseDrag={()=>{
            const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity);
            const currentMouseCoords = pointerInfo.screenCoordinates as Vector2
            if(currentMouseCoords === undefined) return
            const { x } = currentMouseCoords;

            const deltaX = (x - avatarPreviewState.dragStartPoint.x) * ROTATION_FACTOR;
            const qY = Quaternion.fromAngleAxis(deltaX, { x: 0, y: 1, z: 0 }); // Rotate around Y
            const initialQuaternionCopy = Quaternion.create(
              avatarPreviewState.initialQuaternion.x,
              avatarPreviewState.initialQuaternion.y,
              avatarPreviewState.initialQuaternion.z,
              avatarPreviewState.initialQuaternion.w)

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
