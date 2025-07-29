import { noop } from '../../../../utils/function-utils'
import type {
  PermissionDefinition,
  PermissionValue
} from '../../../../bevy-api/permission-definitions'
import type { PermissionResult } from '../permissions-map'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { Row } from '../../../../components/layout'
import { getCanvasScaleRatio } from '../../../../service/canvas-ratio'
import { PermissionBox } from './permission-box'
import { BottomBorder } from '../../../../components/bottom-border'
import { COLOR } from '../../../../components/color-palette'
import { BevyApi } from '../../../../bevy-api'

export function PermissionRowField({
  permissionDefinition,
  value,
  sceneHash,
  realmURL,
  onMouseEnter = noop,
  onMouseLeave = noop,
  onChange = noop
}: {
  permissionDefinition: PermissionDefinition
  value: PermissionResult
  sceneHash: string
  realmURL: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onChange?: () => void
}): ReactElement {
  const onChangeScene = (_value: PermissionValue) => {
    BevyApi.setPermanentPermission({
      //TODO review if it should be a promise
      value: sceneHash,
      level: 'Scene',
      ty: value.type,
      allow: _value
    })
    onChange()
  }
  const onChangeRealm = (_value: PermissionValue) => {
    BevyApi.setPermanentPermission({
      value: realmURL,
      level: 'Realm',
      ty: value.type,
      allow: _value
    })
    onChange()
  }
  const onChangeGlobal = (_value: PermissionValue) => {
    BevyApi.setPermanentPermission({
      level: 'Global',
      ty: value.type,
      allow: _value
    })
    onChange()
  }
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
        onChange={onChangeScene}
        debounce={500}
      />

      <PermissionBox
        value={value.realm.allow}
        uiTransform={{ margin: '5%' }}
        active={value.source === 'Realm'}
        debounce={500}
        onChange={onChangeRealm}
      />
      <PermissionBox
        value={value.global.allow}
        uiTransform={{ margin: '5%' }}
        active={value.source === 'Global'}
        debounce={500}
        onChange={onChangeGlobal}
      />
      <BottomBorder color={COLOR.WHITE_OPACITY_1} />
    </Row>
  )
}
