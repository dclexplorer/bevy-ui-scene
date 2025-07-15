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
import {
  EventNotification,
  isEventNotification,
  Notification
} from './notification-types'
import { NotificationItem } from './notification-renderer'
import { BevyApi } from '../../bevy-api'
import { SignedFetchMeta, SignedFetchMetaJson } from '../../bevy-api/interface'
const { useEffect, useState } = ReactEcs
const meta = JSON.stringify({} as SignedFetchMeta) as SignedFetchMetaJson

const NOTIFICATIONS_BASE_URL =
  'https://notifications.decentraland.org/notifications'
export type NotificationType = Notification['type']

const RENDER_NOTIFICATION_TYPES: NotificationType[] = [
  'events_started',
  'events_starts_soon',
  'events_starts_soon',
  'social_service_friendship_request',
  'social_service_friendship_accepted'
  /*  'dao_proposal_published',
  'dao_proposal_finish',
  'dao_vote_reminder',
  'name_claim',
  'wearables_drop',
  'xp_reward',
  'badges_awarded',
  'rank_changed',
  'badges_awarded',
  'scene_event_milestone',
  'crowd_event_milestone',
  'xp_event_milestone',
  'nft_milestone'*/
  // TODO add all other notification types that can be rendered
]

export async function setupNotifications() {
  fetchNotificationCount().catch(console.error)

  async function fetchNotificationCount() {
    const result = await BevyApi.kernelFetch({
      // url: 'http://localhost:5001/notifications',
      url: `${NOTIFICATIONS_BASE_URL}?limit=50`,
      init: {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
      },
      meta
    })

    const notifications = JSON.parse(result.body).notifications.filter(
      (n: Notification) => RENDER_NOTIFICATION_TYPES.includes(n.type)
    )

    const filteredNotifications = dedupeEventNotifications(
      notifications as Notification[]
    )

    const unreadNotifications = filteredNotifications.filter(
      (n) => n.read === false
    ).length

    store.dispatch(
      updateHudStateAction({
        unreadNotifications
      })
    )
  }
}

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
        const result = await BevyApi.kernelFetch({
          url: `${NOTIFICATIONS_BASE_URL}?limit=50`,
          init: {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
          },
          meta
        })
        const notifications = JSON.parse(result.body).notifications.filter(
          (n: Notification) => RENDER_NOTIFICATION_TYPES.includes(n.type)
        )
        const filteredNotifications = dedupeEventNotifications(
          notifications as Notification[]
        )
        setNotifications(filteredNotifications)
        setLoadingNotifications(false)

        markAllRead(notifications)
      } catch (error) {
        console.error(error)
      }

      function markAllRead(notifications: Notification[]) {
        const unreadNotifications = notifications.filter(
          (n: Notification) => n.read === false
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
