import ReactEcs, { UiEntity, useState } from '@dcl/react-ecs'
import { store } from '../../../state/store'
import { COLOR } from '../../../components/color-palette'
import { closeLastPopupAction } from '../../../state/hud/actions'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'
import { noop } from '../../../utils/function-utils'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'
import { type Popup } from '../../../components/popup-stack'
import { TabComponent } from '../../../components/tab-component'

const state = {
  rememberDomain: false
}
const NAME_EDIT_TABS = [
  { text: 'UNIQUE NAME', active: true },
  { text: 'NON-UNIQUE USERNAME' }
]

export const NameEditPopup: Popup = ({ shownPopup }) => {
  const URL = shownPopup.data
  if (shownPopup?.type !== HUD_POPUP_TYPE.NAME_EDIT) return null
  const profileData = store.getState().hud.profileData

  const hasNames =
    store.getState().hud.profileData.hasConnectedWeb3 &&
    store.getState().hud.names.length

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
          alignItems: 'flex-start',
          flexDirection: 'column',
          padding: '1%'
        }}
        onMouseDown={noop}
        uiBackground={{
          color: COLOR.URL_POPUP_BACKGROUND
        }}
      >
        <UiEntity uiTransform={{ flexDirection: 'column', width: '100%' }}>
          <UiEntity
            uiText={{
              value: '<b>Edit Username</b>',
              fontSize: getCanvasScaleRatio() * 50
            }}
          />
          <TabComponent
            tabs={NAME_EDIT_TABS}
            fontSize={getCanvasScaleRatio() * 32}
            uiTransform={{ width: '100%' }}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}
