export type EventNotification = {
  type: 'event'
  title: string
  message: string
  timeAgo: string
  icon: string
  imageUrl: string
}

export type FriendRequestAcceptedNotification = {
  type: 'friendRequestAccepted'
  username: string
  userId: string
  message: string
  timeAgo: string
  icon: string
}

export type FriendRequestReceivedNotification = {
  type: 'friendRequestReceived'
  username: string
  userId: string
  message: string
  timeAgo: string
  icon: string
}

export type ItemReceivedNotification = {
  type: 'itemReceived'
  itemName: string
  message: string
  timeAgo: string
  icon: string
  imageUrl: string
}

export type GiftReceivedNotification = {
  type: 'giftReceived'
  itemName: string
  message: string
  timeAgo: string
  icon: string
  imageUrl: string
}

export type BadgeUnlockedNotification = {
  type: 'badgeUnlocked'
  badgeName: string
  message: string
  timeAgo: string
  icon: string
  imageUrl: string
}

export type Notification =
  | EventNotification
  | FriendRequestAcceptedNotification
  | FriendRequestReceivedNotification
  | ItemReceivedNotification
  | GiftReceivedNotification
  | BadgeUnlockedNotification

export type FriendRequestNotification =
  | FriendRequestAcceptedNotification
  | FriendRequestReceivedNotification
