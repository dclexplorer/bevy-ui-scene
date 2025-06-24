import ReactEcs, { Button, UiEntity } from '@dcl/react-ecs'
import { store } from '../../../state/store'
import { COLOR } from '../../../components/color-palette'
import { closeLastPopupAction } from '../../../state/hud/actions'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'
import { noop } from '../../../utils/function-utils'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'
import Icon from '../../../components/icon/Icon'
import { Color4 } from '@dcl/sdk/math'
import { Checkbox } from '../../../components/checkbox'
import { openExternalUrl } from '~system/RestrictedActions'
import { type Popup } from '../../../components/popup-stack'

const state = {
  rememberDomain: false
}

export const NameEditPopup: Popup = ({ shownPopup }) => {
  const URL = shownPopup.data
  if (shownPopup?.type !== HUD_POPUP_TYPE.NAME_EDIT) return null

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
      onMouseDown={() => {
        closeDialog()
      }}
    >
      <UiEntity
        uiTransform={{
          width: getCanvasScaleRatio() * 1200,
          height: getCanvasScaleRatio() * 1049,
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
      ></UiEntity>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}
