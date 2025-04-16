import Icon from './icon/Icon'
import { Label, type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../service/canvas-ratio'
export type CheckboxProps = {
  onChange: () => void
  value: boolean
  label?: string
  uiTransform?: UiTransformProps
}
export const Checkbox = ({
  onChange,
  value,
  label,
  uiTransform
}: CheckboxProps): ReactElement => {
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity
      uiTransform={{
        alignSelf: 'center',
        ...uiTransform,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseDown={() => {
        console.log('onMouseDown')
        onChange()
      }}
    >
      <Icon
        iconSize={canvasScaleRatio * 32}
        icon={{
          spriteName: value ? 'check-on' : 'check-off',
          atlasName: 'backpack'
        }}
      />
      {label && <Label value={label} fontSize={canvasScaleRatio * 32} />}
    </UiEntity>
  )
}
