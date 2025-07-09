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
import { AtlasIcon } from '../../utils/definitions'
import { AvatarCircle } from '../../components/avatar-circle'
import { getAddressColor } from './chat-and-logs/ColorByAddress'
import { FriendRequestNotification, Notification } from './notification-types'

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
  useEffect(() => {
    setNotifications(notificationsMockData.notifications as Notification[])
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
            <UiEntity
              uiTransform={{
                height: getCanvasScaleRatio() * 200,
                width: getCanvasScaleRatio() * 740,
                borderWidth: 0,
                borderColor: COLOR.WHITE,
                borderRadius: getCanvasScaleRatio() * 20,
                flexShrink: 0,
                margin: { bottom: '2%', left: '2%' },
                flexDirection: 'row',
                alignItems: 'center',
                padding: { left: '5%' }
              }}
              uiBackground={{ color: COLOR.NOTIFICATION_ITEM }}
            >
              <NotificationThumbnail notification={notification} />
              <UiEntity
                uiTransform={{
                  flexDirection: 'column',
                  width: '80%',
                  alignItems: 'flex-start',
                  margin: { left: '3%' }
                }}
              >
                <UiEntity
                  uiTransform={{
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    width: '100%'
                  }}
                  uiText={{
                    value: `<b>${getTitleFromNotification(notification)}</b>`,
                    textAlign: 'top-left',
                    fontSize: getCanvasScaleRatio() * 32
                  }}
                />
                <UiEntity
                  uiTransform={{
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    width: '100%'
                  }}
                  uiText={{
                    value: getDescriptionFromNotification(notification),
                    textAlign: 'top-left',
                    fontSize: getCanvasScaleRatio() * 32
                  }}
                />
              </UiEntity>
            </UiEntity>
          )
        })}
      </UiEntity>
    </UiEntity>
  )
}
function NotificationThumbnail({
  notification
}: {
  notification: Notification
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        height: getCanvasScaleRatio() * 130,
        width: getCanvasScaleRatio() * 130,
        borderColor: COLOR.BLACK_TRANSPARENT,
        borderWidth: 0,
        borderRadius: getCanvasScaleRatio() * 30
      }}
    >
      {(notification as FriendRequestNotification).userId ? (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
        >
          <AvatarCircle
            userId={(notification as FriendRequestNotification).userId}
            circleColor={getAddressColor(
              (notification as FriendRequestNotification).userId
            )}
            uiTransform={{
              width: '100%',
              height: '100%'
            }}
            isGuest={false}
          />
          <NotificationIcon notification={notification} />
        </UiEntity>
      ) : (
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            width: '100%',
            height: '100%'
          }}
          uiBackground={
            notification.type === 'event' ||
            notification.type === 'itemReceived' ||
            notification.type === 'giftReceived' ||
            notification.type === 'badgeUnlocked'
              ? {
                  textureMode: 'stretch',
                  texture: {
                    src: notification.imageUrl
                  }
                }
              : {
                  color: COLOR.WHITE_OPACITY_1
                }
          }
        >
          <NotificationIcon notification={notification} />
        </UiEntity>
      )}
    </UiEntity>
  )
}
function closeDialog(): void {
  store.dispatch(closeLastPopupAction())
}
function NotificationIcon({
  notification
}: {
  notification: Notification
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { right: '-25%', bottom: '-25%' },
        borderRadius: getCanvasScaleRatio() * 999,
        borderWidth: getCanvasScaleRatio() * 6,
        borderColor: COLOR.TEXT_COLOR,
        width: getCanvasScaleRatio() * 60,
        height: getCanvasScaleRatio() * 60,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      uiBackground={{
        color: getColorForNotificationType(notification.type)
      }}
    >
      <Icon
        uiTransform={{
          flexShrink: 0
        }}
        icon={getIconForNotificationType(notification.type)}
        iconSize={getCanvasScaleRatio() * 40}
      />
    </UiEntity>
  )
}
function getColorForNotificationType(type: string): Color4 {
  if (type === 'friendRequestReceived' || type === 'friendRequestAccepted') {
    return COLOR.NOTIFICATION_FRIEND
  }
  return COLOR.NOTIFICATION_GIFT
}
function getIconForNotificationType(type: string): AtlasIcon {
  if (type === 'giftReceived') {
    return {
      spriteName: 'GiftIcn',
      atlasName: 'icons'
    }
  }
  if (type === 'friendRequestReceived' || type === 'friendRequestAccepted') {
    return {
      spriteName: 'Members',
      atlasName: 'icons'
    }
  }

  return {
    spriteName: 'GiftIcn',
    atlasName: 'icons'
  }
}

function getTitleFromNotification(notification: Notification): string {
  if (notification.type === 'event') {
    return 'Event started'
  } else if (notification.type === 'giftReceived') {
    return 'New Item Received!'
  } else if (notification.type === 'friendRequestReceived') {
    return 'Friend Request Received!'
  } else if (notification.type === 'friendRequestAccepted') {
    return 'Friend Request Accepted!'
  } else if (notification.type === 'badgeUnlocked') {
    return 'New Badge Unlocked!'
  }
  return ''
}

function getDescriptionFromNotification(notification: Notification): string {
  if (notification.type === 'event') {
    return notification.message
  } else if (notification.type === 'giftReceived') {
    return `You've received ${notification.itemName}. ${notification.message}`
  } else if (notification.type === 'friendRequestReceived') {
    return `${notification.username} wants to be your friend!`
  } else if (notification.type === 'friendRequestAccepted') {
    return `${notification.username} accepted your friend request.`
  } else if (notification.type === 'badgeUnlocked') {
    return `You unlocked the badge "${notification.badgeName}".`
  } else if (notification.type === 'itemReceived') {
    return `You received the item "${notification.itemName}". ${notification.message}`
  }
  return ''
}
