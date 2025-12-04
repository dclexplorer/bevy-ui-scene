import type { Color4 } from '@dcl/sdk/math'
import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { ROUNDED_TEXTURE_BACKGROUND } from '../utils/constants'
import { Label, UiTransformProps } from '@dcl/sdk/react-ecs'
import { COLOR } from './color-palette'

export function Tag({
  text,
  canvasScaleRatio, // TODO canvasScaleRatio must not be here, other containers use other measures/responsiveness methods
  backgroundColor,
  uiTransform,
  textColor = COLOR.WHITE
}: {
  text: string
  canvasScaleRatio: number
  backgroundColor: Color4
  uiTransform?: UiTransformProps
  textColor?: Color4
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: 0,
        ...uiTransform
      }}
    >
      <UiEntity
        uiTransform={{
          padding: {
            left: 6 * canvasScaleRatio,
            right: 6 * canvasScaleRatio
          }
        }}
        uiBackground={{
          ...ROUNDED_TEXTURE_BACKGROUND,
          color: backgroundColor
        }}
      >
        <Label
          value={text}
          color={textColor}
          fontSize={26 * canvasScaleRatio}
        />
      </UiEntity>
    </UiEntity>
  )
}
