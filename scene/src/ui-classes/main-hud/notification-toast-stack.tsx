import { type Notification } from './notification-types'
import ReactEcs, { type ReactElement } from '@dcl/react-ecs'
import { Column } from '../../components/layout'
import { NotificationItem } from './notification-renderer'
import { executeTask } from '@dcl/sdk/ecs'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { sleep } from '../../utils/dcl-utils'
import { fetchNotifications } from '../../utils/notifications-promise-utils'

export type NotificationToastStackState = {
  toasts: Notification[]
}

const state: NotificationToastStackState = {
  toasts: []
}

export function NotificationToastStack(): ReactElement | null {
  return (
    <Column
      uiTransform={{
        positionType: 'absolute',
        position: { left: '38%' },
        width: getCanvasScaleRatio() * 900
      }}
    >
      {state.toasts.map((notification) => {
        return (
          <NotificationItem
            uiTransform={{
              width: '100%',
              margin: { top: getCanvasScaleRatio() * 10 }
            }}
            notification={notification}
            key={notification.id}
          />
        )
      })}
    </Column>
  )
}
export function initRealTimeNotifications(): void {
  executeTask(async (): Promise<never> => {
    while (true) {
      await sleep(5000)

      if (
        state.toasts.length &&
        new Date(
          Number(state.toasts[state.toasts.length - 1].timestamp)
        ).getTime() +
          5000 <
          Date.now()
      ) {
        state.toasts.shift()
      }
      const lastNotification: Notification =
        state.toasts[state.toasts.length - 1]

      const [nextNotification] = await fetchNotifications({
        limit: 1,
        from: Number(lastNotification?.timestamp ?? Date.now()) + 1
      })

      if (nextNotification !== undefined) {
        pushNotificationToast(nextNotification)
      }
    }
  })
}

export function pushNotificationToast(notification: Notification): void {
  state.toasts.push({
    ...notification,
    localTimestamp: Date.now()
  })
}
