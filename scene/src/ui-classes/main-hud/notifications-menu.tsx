import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { store } from '../../state/store'
import { COLOR } from '../../components/color-palette'
import {
  closeLastPopupAction,
  updateHudStateAction
} from '../../state/hud/actions'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { noop } from '../../utils/function-utils'
import { type Popup } from '../../components/popup-stack'
import { type Notification, NOTIFICATIONS_BASE_URL } from './notification-types'
import { NotificationItem } from './notification-renderer'
import { BevyApi } from '../../bevy-api'
import { type SignedFetchMeta } from '../../bevy-api/interface'
import { executeTask } from '@dcl/sdk/ecs'
import { Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { fetchNotifications } from '../../utils/notifications-promise-utils'
import { sleep } from '../../utils/dcl-utils'
const { useEffect, useState } = ReactEcs
const emptyMeta: SignedFetchMeta = {}
const meta: string = JSON.stringify(emptyMeta)

export async function setupNotifications(): Promise<void> {
  fetchNotificationCount().catch(console.error)

  while (true) {
    await sleep(20000)
    fetchNotificationCount().catch(console.error)
  }

  async function fetchNotificationCount(): Promise<void> {
    const filteredNotifications = await fetchNotifications()

    const unreadNotifications = filteredNotifications.filter(
      (n) => !n.read
    ).length

    store.dispatch(
      updateHudStateAction({
        unreadNotifications
      })
    )
  }
}

export const NotificationsMenu: Popup = (): ReactElement => {
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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] =
    useState<boolean>(true)

  const t = (Date.now() % 2000) / 1000 // TODO move to a singleton service with getLoadingAlphaWhiteColor() using a system

  const loadingAlpha = t < 1 ? t : 2 - t

  useEffect(() => {
    executeTask(async () => {
      try {
        setLoadingNotifications(true)
        const filteredNotifications = await fetchNotifications()
        setNotifications(filteredNotifications)
        setLoadingNotifications(false)

        markAllRead(notifications)
      } catch (error) {
        console.error(error)
      }

      function markAllRead(notifications: Notification[]): void {
        const unreadNotifications = notifications.filter(
          (n: Notification) => !n.read
        )
        if (unreadNotifications.length > 0) {
          BevyApi.kernelFetch({
            url: `${NOTIFICATIONS_BASE_URL}/read`,
            init: {
              headers: { 'Content-Type': 'application/json' },
              method: 'PUT',
              body: JSON.stringify({
                notificationIds: unreadNotifications.map(
                  (n: Notification) => n.id
                )
              })
            },
            meta
          }).catch(console.error)
          store.dispatch(updateHudStateAction({ unreadNotifications: 0 }))
        }
      }
    })
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
        {loadingNotifications && (
          <Label
            fontSize={getCanvasScaleRatio() * 32}
            value={'Loading notifications ...'}
            color={Color4.create(1, 1, 1, loadingAlpha)}
          />
        )}

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
