import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { store } from '../../state/store'
import { COLOR } from '../../components/color-palette'
import { closeLastPopupAction } from '../../state/hud/actions'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'

import { noop } from '../../utils/function-utils'
import Icon from '../../components/icon/Icon'
import { Color4 } from '@dcl/sdk/math'
import { type Popup } from '../../components/popup-stack'
import notificationsMockData from './notifications_full_log_complete.json'
import { AtlasIcon } from '../../utils/definitions'
import { AvatarCircle } from '../../components/avatar-circle'
import { getAddressColor } from './chat-and-logs/ColorByAddress'
import {
  EventNotification,
  isEventNotification,
  Notification
} from './notification-types'
import { executeTask } from '@dcl/sdk/ecs'
import { Authenticator } from '@dcl/crypto'
import { signedFetch } from '~system/SignedFetch'
import { sleep } from '../../utils/dcl-utils'
import { BevyApi } from '../../bevy-api'
import { NotificationItem } from './notification-renderer'

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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] =
    useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      try {
        setLoadingNotifications(true)
        const result = await signedFetch({
          //   url: 'http://localhost:5001/notifications',
          url: 'https://notifications.decentraland.org/notifications',
          init: {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
          }
        })
        const notifications = JSON.parse(result.body).notifications.filter(
          (n: Notification) => n.type !== 'credits_reminder_do_not_miss_out'
        )
        const filteredNotifications = dedupeEventNotifications(
          notificationsMockData.notifications as Notification[]
        ).filter(
          (n: Notification) => n.type !== 'credits_reminder_do_not_miss_out'
        )
        setNotifications(filteredNotifications)
        setLoadingNotifications(false)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 370 * 2.23,
        height: getCanvasScaleRatio() * 540 * 2.2,
        borderRadius: getCanvasScaleRatio() * 20,
        borderWidth: 0,
        borderColor: COLOR.BLACK_TRANSPARENT,
        alignItems: 'flex-start',
        flexDirection: 'column',
        positionType: 'absolute',
        position: { top: '1%', left: '4.4%' }
      }}
      onMouseDown={noop}
      uiBackground={{
        color: COLOR.NOTIFICATIONS_MENU
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
            <NotificationItem
              notification={notification}
              key={notification.id}
            />
          )
        })}
      </UiEntity>
    </UiEntity>
  )
}

function closeDialog(): void {
  store.dispatch(closeLastPopupAction())
}
function dedupeEventNotifications(
  notifications: Notification[]
): Notification[] {
  const eventNotifications: EventNotification[] = notifications.filter(
    isEventNotification
  ) as EventNotification[]

  const latestByName = new Map<string, EventNotification>()

  for (const notification of eventNotifications) {
    const name = notification.metadata.name

    const existing = latestByName.get(name)
    if (!existing) {
      latestByName.set(name, notification)
    } else {
      if (new Date(notification.timestamp) > new Date(existing.timestamp)) {
        latestByName.set(name, notification)
      }
    }
  }

  const deduped: EventNotification[] = (
    notifications as EventNotification[]
  ).filter((n: EventNotification) => {
    if (!isEventNotification(n)) return true

    const latest = latestByName.get(n.metadata.name)
    return latest?.id === n.id
  })

  return deduped
}
