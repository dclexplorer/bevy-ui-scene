import { noop } from '../utils/function-utils'
import type { Callback, UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getContentScaleRatio } from '../service/canvas-ratio'
import { Color4 } from '@dcl/sdk/math'
import Icon from './icon/Icon'

export function CloseButton({
  uiTransform,
  onClick = noop,
  size = 80
}: {
  uiTransform?: UiTransformProps
  onClick: Callback
  size?: number
}): ReactElement {
  const canvasScaleRatio = getContentScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        borderWidth: 1,
        borderRadius: (canvasScaleRatio * size) / 4,
        borderColor: Color4.Black(),
        positionType: 'absolute',
        position: { top: 0, right: 0 },
        width: canvasScaleRatio * size,
        height: canvasScaleRatio * size,
        justifyContent: 'center',
        alignItems: 'center',
        ...uiTransform
      }}
      uiBackground={{
        color: Color4.Black()
      }}
      onMouseDown={onClick}
    >
      <Icon
        icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
        uiTransform={{}}
        iconSize={size / 3}
      />
    </UiEntity>
  )
}
