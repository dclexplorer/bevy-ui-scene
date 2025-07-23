import { BevyApi } from '../bevy-api'
import {
  Notification,
  NOTIFICATIONS_BASE_URL,
  RENDER_NOTIFICATION_TYPES
} from '../ui-classes/main-hud/notification-types'
import type { SignedFetchMeta } from '../bevy-api/interface'
const emptyMeta: SignedFetchMeta = {}
const meta: string = JSON.stringify(emptyMeta)
export async function fetchNotifications(
  {
    from = 0,
    limit = 50
  }: {
    from?: number | string
    limit?: number
  } = { from: 0, limit: 50 }
) {
  const result = await BevyApi.kernelFetch({
    // url: 'http://localhost:5001/notifications',
    url: `${NOTIFICATIONS_BASE_URL}?limit=${limit}&from=${from}`,
    init: {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    },
    meta
  })

  const notifications = JSON.parse(result.body).notifications.filter(
    (n: Notification) => RENDER_NOTIFICATION_TYPES.includes(n.type)
  )
  const filteredNotifications = dedupeSameKindNotifications(
    notifications as Notification[]
  )

  return filteredNotifications
}

function dedupeSameKindNotifications(
  notifications: Notification[]
): Notification[] {
  const latestByKey = new Map<string, Notification>()
  for (const notification of notifications) {
    const key = getNotificationKey(notification)
    const existing = latestByKey.get(key)
    if (!existing) {
      latestByKey.set(key, notification)
    } else {
      if (new Date(notification.timestamp) > new Date(existing.timestamp)) {
        latestByKey.set(key, notification)
      }
    }
  }
  const deduped: Notification[] = (notifications as Notification[]).filter(
    (n: Notification) => {
      //    if (!isEventNotification(n)) return true
      const latest = latestByKey.get(getNotificationKey(n))
      return latest?.id === n.id
    }
  )

  return deduped

  function getNotificationKey(notification: Notification) {
    return (
      notification.metadata.name ??
      notification.metadata.tokenName ??
      notification.metadata.id
    ) //each id is different, then this one won't be deduped
  }
}
