import ReactEcs, { Button, type ReactElement, UiEntity } from '@dcl/react-ecs'
import { store } from '../../state/store'
import { COLOR } from '../../components/color-palette'
import { closeLastPopupAction } from '../../state/hud/actions'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../utils/ui-utils'
import { noop } from '../../utils/function-utils'
import Icon from '../../components/icon/Icon'
import { Color4 } from '@dcl/sdk/math'
import { type Popup } from '../../components/popup-stack'
import notificationsMockData from './notifications-mock.json'
const { useEffect, useState } = ReactEcs

export const NotificationsMenu: Popup = (): ReactElement | null => {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        zIndex: 999,
        width: '100%',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_7
      }}
      onMouseDown={() => {
        closeDialog()
      }}
    >
      <NotificationsContent />
    </UiEntity>
  )
}

function NotificationsContent(): ReactElement {
  const [errorDetails, setErrorDetails] = useState<string>('')
  const [notifications, setNotifications] = useState<
    typeof notificationsMockData.notifications
  >([])
  useEffect(() => {
    setNotifications(notificationsMockData.notifications)
  }, [])

  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 370 * 2.23,
        height: getCanvasScaleRatio() * 540 * 2.2,
        borderRadius: getCanvasScaleRatio() * 20,
        borderWidth: 0,
        borderColor: COLOR.WHITE,
        alignItems: 'flex-start',
        flexDirection: 'column',
        positionType: 'absolute',
        position: { top: '1%', left: '4.4%' }
      }}
      onMouseDown={noop}
      uiBackground={{
        color: COLOR.BLACK_POPUP_BACKGROUND
      }}
    >
      <UiEntity
        uiTransform={{
          padding: 0,
          margin: 0
        }}
        uiText={{
          value: '<b>NOTIFICATIONS</b>',
          fontSize: getCanvasScaleRatio() * 38
        }}
      />
      <UiEntity
        uiTransform={{
          scrollVisible: 'vertical',
          height: getCanvasScaleRatio() * 540 * 2,
          width: '100%',
          borderWidth: 1,
          borderColor: COLOR.BLACK_TRANSPARENT,
          borderRadius: 0,
          flexDirection: 'column',
          overflow: 'scroll'
        }}
      >
        {notifications.map((notification) => {
          return (
            <UiEntity
              uiTransform={{
                height: getCanvasScaleRatio() * 200,
                width: getCanvasScaleRatio() * 740,
                borderWidth: 0,
                borderColor: COLOR.WHITE,
                borderRadius: getCanvasScaleRatio() * 20,
                flexShrink: 0,
                margin: { bottom: '2%', left: '2%' },
                flexDirection: 'row'
              }}
              uiBackground={{ color: COLOR.DARK_OPACITY_5 }}
            >
              <UiEntity>
                <UiEntity uiTransform={{ width: '100%', height: '100%' }} />
              </UiEntity>
            </UiEntity>
          )
        })}
      </UiEntity>
    </UiEntity>
  )
}

function closeDialog(): void {
  store.dispatch(closeLastPopupAction())
}
