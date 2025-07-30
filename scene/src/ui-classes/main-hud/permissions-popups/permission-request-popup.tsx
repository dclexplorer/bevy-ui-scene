import { Popup } from '../../../components/popup-stack'
import { COLOR } from '../../../components/color-palette'
import ReactEcs, { Button, UiEntity } from '@dcl/react-ecs'
import { store } from '../../../state/store'
import { closeLastPopupAction } from '../../../state/hud/actions'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'
import { noop } from '../../../utils/function-utils'
import Icon from '../../../components/icon/Icon'
import {
  PERMISSION_DEFINITIONS,
  PERMISSION_LEVELS,
  PermissionRequest
} from '../../../bevy-api/permission-definitions'
import { Row } from '../../../components/layout'
import { DropdownComponent } from '../../../components/dropdown-component'
import { ButtonTextIcon } from '../../../components/button-text-icon'

const PERMISSION_REQUEST_OPTIONS = ['Once', ...PERMISSION_LEVELS].map((i) => ({
  label: i === 'Once' ? i : `Always for ${i}`,
  value: i
}))

export const PermissionRequestPopup: Popup = ({ shownPopup }) => {
  const data: PermissionRequest = shownPopup.data as PermissionRequest
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        zIndex: 999,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_7
      }}
      onMouseDown={closeDialog}
    >
      <UiEntity
        uiTransform={{
          width: getCanvasScaleRatio() * 1200,
          height: getCanvasScaleRatio() * 750,
          borderRadius: BORDER_RADIUS_F,
          borderWidth: 0,
          borderColor: COLOR.WHITE,
          alignItems: 'center',
          flexDirection: 'column',
          padding: '1%'
        }}
        onMouseDown={noop}
        uiBackground={{
          color: COLOR.URL_POPUP_BACKGROUND
        }}
      >
        <Icon
          uiTransform={{
            position: { top: '2%' }
          }}
          icon={{ spriteName: 'Lock', atlasName: 'icons' }}
          iconSize={getCanvasScaleRatio() * 96}
          iconColor={COLOR.WHITE}
        />
        <UiEntity
          uiText={{
            value: `\nThe scene wants permission to ${PERMISSION_DEFINITIONS.find(
              (p) => p.permissionType === data.ty
            )?.activeDescription}\n${data.additional ?? ''}`,
            fontSize: getCanvasScaleRatio() * 36
          }}
        />
        <Row uiTransform={{ width: '100%' }}>
          <Row
            uiTransform={{
              padding: 0,
              margin: 0
            }}
          >
            <DropdownComponent
              dropdownId={`permission-request-${data.id}`}
              uiTransform={{ width: '80%', position: { top: '-10%' } }}
              options={PERMISSION_REQUEST_OPTIONS}
              value={'Once'}
              onChange={() => {}}
            />
            <ButtonTextIcon
              icon={{ spriteName: 'Check', atlasName: 'icons' }}
              iconSize={getCanvasScaleRatio() * 36}
              uiTransform={{
                width: '30%'
              }}
              backgroundColor={COLOR.BUTTON_PRIMARY}
              fontSize={getCanvasScaleRatio() * 36}
              value={'Allow'}
              onMouseDown={noop}
            />
            <ButtonTextIcon
              icon={{ spriteName: 'CloseIcon', atlasName: 'icons' }}
              iconSize={getCanvasScaleRatio() * 36}
              uiTransform={{
                width: '30%',
                margin: { left: '5%', right: '5%' }
              }}
              backgroundColor={COLOR.BUTTON_PRIMARY}
              fontSize={getCanvasScaleRatio() * 36}
              value={'Deny'}
              onMouseDown={noop}
            />
          </Row>
          {/*
          // TODO, decide best behaviour for UX, leave the popup bellow menu ?
          <UiEntity
            uiTransform={{
              borderWidth: 1,
              borderRadius: getCanvasScaleRatio() * 20,
              borderColor: COLOR.WHITE
            }}
            uiText={{ value: 'Manage Permissions' }}
          />*/}
        </Row>
      </UiEntity>
    </UiEntity>
  )
}
function closeDialog(): void {
  store.dispatch(closeLastPopupAction())
}

function FetchPopupContent() {}
