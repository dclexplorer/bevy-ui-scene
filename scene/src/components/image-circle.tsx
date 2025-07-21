import { getCanvasScaleRatio } from '../service/canvas-ratio'
import ReactEcs, { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { type Color4 } from '@dcl/sdk/math'
import { type ReactElement } from '@dcl/react-ecs'

export function ImageCircle({
  image,
  circleColor,
  uiTransform
}: {
  image: string
  circleColor: Color4
  uiTransform: UiTransformProps
}): ReactElement | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

  if (canvasInfo === null) return null

  const addressColor = circleColor

  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 64,
        height: getCanvasScaleRatio() * 64,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
        borderWidth: getCanvasScaleRatio() * 3,
        borderColor: addressColor,
        ...uiTransform
      }}
      uiBackground={{
        color: { ...addressColor, a: 0.3 }
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: image
          }
        }}
      />
      AvatarCircle
    </UiEntity>
  )
}
