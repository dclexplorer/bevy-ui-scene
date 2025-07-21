import {
  type FriendshipNotification,
  isEventNotification,
  isFriendshipNotification,
  isItemNotification,
  ItemSoldNotification,
  type Notification,
  type UserProfile
} from './notification-types'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  COLOR,
  RARITY_COLORS,
  RARITY_HEX_COLORS
} from '../../components/color-palette'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import Icon from '../../components/icon/Icon'
import { type Color4 } from '@dcl/sdk/math'
import { type AtlasIcon } from '../../utils/definitions'
import { AvatarCircle } from '../../components/avatar-circle'
import { getAddressColor } from './chat-and-logs/ColorByAddress'
import { rgbToHex } from '../../utils/ui-utils'
import { RarityName } from '../../utils/item-definitions'
import { RGBColor } from '../../bevy-api/interface'
import { ImageCircle } from '../../components/image-circle'

export function NotificationItem({
  notification
}: {
  notification: Notification
  key?: any
}): ReactElement | null {
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
          justifyContent: 'flex-start',
          alignSelf: 'flex-start',
          margin: { left: '3%' }
        }}
      >
        <UiEntity
          uiTransform={{
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            width: '100%',
            margin: 0,
            padding: 0
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
            width: '100%',
            margin: { top: getCanvasScaleRatio() * -30 }
          }}
          uiText={{
            value: getDescriptionFromNotification(notification),
            textAlign: 'top-left',
            fontSize: getCanvasScaleRatio() * 28
          }}
        />
        <UiEntity
          uiTransform={{
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            width: '100%',
            margin: { top: getCanvasScaleRatio() * -30 }
          }}
          uiText={{
            value: formatTimeAgoFromTimestamp(notification.timestamp),
            textAlign: 'top-left',
            fontSize: getCanvasScaleRatio() * 28,
            color: COLOR.TEXT_COLOR_LIGHT_GREY
          }}
        />
      </UiEntity>
      {!notification.read && (
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { right: '2%' },
            width: getCanvasScaleRatio() * 20,
            height: getCanvasScaleRatio() * 20,
            borderColor: COLOR.BLACK_TRANSPARENT,
            borderWidth: 0,
            borderRadius: 999
          }}
          uiBackground={{
            color: COLOR.RED
          }}
        />
      )}
    </UiEntity>
  )
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
        color: getColorForNotificationType(notification)
      }}
    >
      <Icon
        uiTransform={{
          flexShrink: 0
        }}
        icon={getIconForNotificationType(notification)}
        iconSize={getCanvasScaleRatio() * 40}
      />
    </UiEntity>
  )
}

function getTitleFromNotification(notification: Notification): string {
  switch (notification.type) {
    case 'credits_reminder_do_not_miss_out':
      return 'Don’t miss your credits!'
    case 'events_started':
      return notification.metadata?.title ?? 'Event started'
    case 'events_starts_soon':
      return notification.metadata?.title ?? 'Event starts soon'
    case 'social_service_friendship_accepted':
      return 'Friend request accepted'
    case 'social_service_friendship_request':
      return 'Friend request received'
    case 'item_sold':
      return 'Item sold'
    default:
      return ''
  }
}

function getDescriptionFromNotification(notification: Notification): string {
  if (isFriendshipNotification(notification as FriendshipNotification)) {
    const protagonist = getFriendshipNotificationProtagonist(
      notification as FriendshipNotification
    )
    const hexColor = rgbToHex(getAddressColor(protagonist.address))
    if (notification.type === 'social_service_friendship_accepted') {
      return `<color=${hexColor}>${protagonist.name}</color> accepted your friend request.`
    } else if (notification.type === 'social_service_friendship_request') {
      return `<color=${hexColor}>${protagonist.name}</color> wants to be your friend.`
    } else if (notification.type === 'item_sold') {
    }
  }

  if (notification.metadata?.nftName) {
    const itemSoldNotification: ItemSoldNotification =
      notification as ItemSoldNotification

    return (
      notification.metadata.description.replace(
        notification.metadata.nftName,
        `<color=${
          RARITY_HEX_COLORS[itemSoldNotification.metadata.rarity as RarityName]
        }>${notification.metadata.nftName}</>`
      ) ?? ''
    )
  }
  return notification.metadata.description ?? ''
}

function getColorForNotificationType(notification: Notification): Color4 {
  if (isFriendshipNotification(notification as FriendshipNotification)) {
    return COLOR.NOTIFICATION_FRIEND
  }

  if (isEventNotification(notification)) {
    return COLOR.NOTIFICATION_EVENT
  }

  if (notification.type === 'badges_awarded') {
    return COLOR.NOTIFICATION_BADGE
  }

  return COLOR.NOTIFICATION_GIFT
}

function getIconForNotificationType(notification: Notification): AtlasIcon {
  const { type } = notification
  if (type === 'wearables_drop') {
    return {
      spriteName: 'GiftIcn',
      atlasName: 'icons'
    }
  }
  if (isFriendshipNotification(notification as FriendshipNotification)) {
    return {
      spriteName: 'Members',
      atlasName: 'icons'
    }
  }
  if (type === 'badges_awarded') {
    return {
      spriteName: 'StarSolid',
      atlasName: 'icons'
    }
  }
  if (isEventNotification(notification)) {
    return {
      spriteName: 'PublishIcon',

      atlasName: 'icons'
    }
  }
  return {
    spriteName: 'GiftIcn',
    atlasName: 'icons'
  }
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
      {isItemNotification(notification) && (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
        >
          <ImageCircle
            image={notification.metadata.image}
            circleColor={
              RARITY_COLORS[notification.metadata.rarity as RarityName]
            }
            uiTransform={{ width: '100%', height: '100%' }}
          />
        </UiEntity>
      )}
      {isFriendshipNotification(notification as FriendshipNotification) ? (
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%'
          }}
        >
          <AvatarCircle
            userId={
              getFriendshipNotificationProtagonist(
                notification as FriendshipNotification
              ).address
            }
            circleColor={getAddressColor(
              getFriendshipNotificationProtagonist(
                notification as FriendshipNotification
              ).address
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
            (notification.type === 'events_started' ||
              notification.type === 'events_ended' ||
              notification.type === 'events_starts_soon' ||
              notification.type === 'item_sold') &&
            notification.metadata.image
              ? {
                  textureMode: 'stretch',
                  texture: {
                    src: notification.metadata.image
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

export function getFriendshipNotificationProtagonist(
  notification: FriendshipNotification
): UserProfile {
  const sender = notification.metadata.sender
  const receiver = notification.metadata.receiver
  const me = notification.address.toLowerCase()

  return sender.address.toLowerCase() === me ? receiver : sender
}

export function formatTimeAgoFromTimestamp(timestamp: string): string {
  const now = new Date()

  const past = new Date(Number(timestamp))

  const diffMs = now.getTime() - past.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) {
    return 'just now'
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else if (weeks < 5) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
  } else if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ago`
  }
}
