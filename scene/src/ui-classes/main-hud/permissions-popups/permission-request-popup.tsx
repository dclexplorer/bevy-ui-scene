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
import { RadioButton } from '../../../components/radio-button'

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
          height: getCanvasScaleRatio() * 900,
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
            position: { top: '2%' },
            flexShrink: 0
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
            fontSize: getCanvasScaleRatio() * 42
          }}
        />
        <RadioButton
          options={PERMISSION_REQUEST_OPTIONS}
          value={'Once'}
          fontSize={getCanvasScaleRatio() * 42}
        />
        <Row
          uiTransform={{
            width: '100%',
            justifyContent: 'center',
            margin: { top: '5%' }
          }}
        >
          <ButtonTextIcon
            icon={{ spriteName: 'Check', atlasName: 'icons' }}
            iconSize={getCanvasScaleRatio() * 42}
            uiTransform={{
              width: '30%'
            }}
            backgroundColor={COLOR.BUTTON_PRIMARY}
            fontSize={getCanvasScaleRatio() * 42}
            value={'Allow'}
            onMouseDown={noop}
          />
          <ButtonTextIcon
            icon={{ spriteName: 'CloseIcon', atlasName: 'icons' }}
            iconSize={getCanvasScaleRatio() * 42}
            uiTransform={{
              width: '30%',
              margin: { left: '5%', right: '5%' }
            }}
            backgroundColor={COLOR.BUTTON_PRIMARY}
            fontSize={getCanvasScaleRatio() * 42}
            value={'Deny'}
            onMouseDown={noop}
          />
        </Row>
      </UiEntity>
    </UiEntity>
  )
}
function closeDialog(): void {
  store.dispatch(closeLastPopupAction())
}

function FetchPopupContent() {}
