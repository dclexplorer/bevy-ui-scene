import { type UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../../service/canvas-ratio'
import { PermissionBox } from './permission-box'

export function PermissionLegend({
  uiTransform
}: {
  uiTransform?: UiTransformProps
}): ReactElement {
  const fontSize = getCanvasScaleRatio() * 32
  return (
    <UiEntity uiTransform={{ ...uiTransform }}>
      <UiEntity>
        <UiEntity
          uiText={{
            value: 'Inherit',
            fontSize,
            textAlign: 'middle-center'
          }}
        />
        <PermissionBox value={null} />
      </UiEntity>
      <UiEntity>
        <UiEntity
          uiText={{
            value: 'Ask',
            fontSize,
            textAlign: 'middle-center'
          }}
        />
        <PermissionBox value={'Ask'} />
      </UiEntity>
      <UiEntity>
        <UiEntity
          uiText={{
            value: 'Allow',
            fontSize,
            textAlign: 'middle-center'
          }}
        />
        <PermissionBox value={'Allow'} />
      </UiEntity>
      <UiEntity>
        <UiEntity
          uiText={{
            value: 'Deny',
            fontSize,
            textAlign: 'middle-center'
          }}
        />
        <PermissionBox value={'Deny'} />
      </UiEntity>
    </UiEntity>
  )
}
