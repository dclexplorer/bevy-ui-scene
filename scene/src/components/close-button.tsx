import { noop } from '../utils/function-utils'
import type { Callback, UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../service/canvas-ratio'
import { Color4 } from '@dcl/sdk/math'
import Icon from './icon/Icon'

export function CloseButton({
  uiTransform,
  onClick = noop
}: {
  uiTransform?: UiTransformProps
  onClick: Callback
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        borderWidth: 1,
        borderRadius: canvasScaleRatio * 20,
        borderColor: Color4.Black(),
        positionType: 'absolute',
        position: { top: 0, right: 0 },
        width: canvasScaleRatio * 80,
        height: canvasScaleRatio * 80,
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
      />
    </UiEntity>
  )
}
