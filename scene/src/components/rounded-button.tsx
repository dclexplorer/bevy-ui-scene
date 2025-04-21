import { noop } from '../utils/function-utils'
import { Label, UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { ROUNDED_TEXTURE_BACKGROUND } from '../utils/constants'
import { Color4 } from '@dcl/sdk/math'

export function RoundedButton({
  isSecondary,
  text,
  onClick = noop,
  uiTransform,
  fontSize = 20
}: {
  isSecondary?: boolean
  text: string
  onClick?: () => void
  uiTransform?: UiTransformProps
  fontSize?: number
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        pointerFilter: 'block',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...uiTransform
      }}
      onMouseDown={onClick}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: isSecondary ? Color4.Black() : Color4.Red()
      }}
    >
      <Label value={text} fontSize={fontSize} />
    </UiEntity>
  )
}
