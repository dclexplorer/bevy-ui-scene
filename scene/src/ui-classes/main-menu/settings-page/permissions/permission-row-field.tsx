import { noop } from '../../../../utils/function-utils'
import type { PermissionDefinition } from '../../../../bevy-api/permission-definitions'
import type { PermissionResult } from '../permissions-map'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { Row } from '../../../../components/layout'
import { getCanvasScaleRatio } from '../../../../service/canvas-ratio'
import { PermissionBox } from './permission-box'
import { BottomBorder } from '../../../../components/bottom-border'
import { COLOR } from '../../../../components/color-palette'

export function PermissionRowField({
  permissionDefinition,
  value,
  onMouseEnter = noop,
  onMouseLeave = noop
}: {
  permissionDefinition: PermissionDefinition
  value: PermissionResult
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}): ReactElement {
  return (
    <Row
      uiTransform={{
        width: '95%',
        padding: { right: '10%' }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <UiEntity
        uiText={{
          value: permissionDefinition.label,
          textAlign: 'top-left',
          fontSize: getCanvasScaleRatio() * 40
        }}
        uiTransform={{ width: '100%' }}
      />
      <PermissionBox
        value={value.scene.allow}
        uiTransform={{ margin: '5%' }}
        active={value.source === 'Scene'}
        onChange={() => {}}
      />
      <PermissionBox
        value={value.realm.allow}
        uiTransform={{ margin: '5%' }}
        active={value.source === 'Realm'}
      />
      <PermissionBox
        value={value.global.allow}
        uiTransform={{ margin: '5%' }}
        active={value.source === 'Global'}
      />
      <BottomBorder color={COLOR.WHITE_OPACITY_1} />
    </Row>
  )
}
