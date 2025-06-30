import type { Popup } from '../../../components/popup-stack'
import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'
import { noop } from '../../../utils/function-utils'
import { store } from '../../../state/store'
import { closeLastPopupAction } from '../../../state/hud/actions'
import { AvatarCircle } from '../../../components/avatar-circle'
import { getPlayer } from '@dcl/sdk/src/players'
import { getAddressColor } from '../chat-and-logs/ColorByAddress'

export const ProfileMenuPopup: Popup = ({ shownPopup }) => {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        zIndex: 999,
        width: '100%',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: { left: '4.1%', top: '0.5%' }
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_2
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
          borderColor: COLOR.TEXT_COLOR,
          alignItems: 'center',
          flexDirection: 'column',
          padding: 0
        }}
        onMouseDown={noop}
        uiBackground={{
          color: COLOR.BLACK_POPUP_BACKGROUND
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            width: '100%',
            margin: { top: '5%' }
          }}
        >
          <AvatarCircle
            userId={getPlayer()?.userId as string}
            circleColor={getAddressColor(getPlayer()?.userId as string)}
            uiTransform={{
              width: getCanvasScaleRatio() * 200,
              height: getCanvasScaleRatio() * 200,
              alignSelf: 'center'
            }}
            isGuest={!!getPlayer()?.isGuest}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}
