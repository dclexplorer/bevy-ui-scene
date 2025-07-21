import { RarityName } from '../../utils/item-definitions'

export type BaseNotification = {
  id: string
  type: string
  address: string
  metadata: any
  timestamp: string
  read: boolean
}

export type ItemSoldNotification = {
  type: 'item_sold'
  metadata: {
    category: string
    description: string
    image: string
    link: string
    network: string
    nftName: string
    rarity: RarityName
    seller: string
    title: string
  }
} & BaseNotification

// Credits reminder
export type CreditsReminderNotification = {
  type: 'credits_reminder_do_not_miss_out'
  metadata: {
    link: string
  }
} & BaseNotification

// Events
export type EventStartedNotification = {
  type: 'events_started'
  metadata: {
    link: string
    name: string
    image: string
    title: string
    description: string
  }
} & BaseNotification

export type EventStartsSoonNotification = {
  type: 'events_starts_soon'
  metadata: {
    link: string
    name: string
    image: string
    title: string
    startsAt: string
    endsAt: string
    description: string
  }
} & BaseNotification

export type EventEndedNotification = {
  type: 'events_ended'
  metadata: {
    link: string
    name: string
    image: string
    title: string
    description: string
  }
} & BaseNotification

// Social
export type FriendshipAcceptedNotification = {
  type: 'social_service_friendship_accepted'
  metadata: {
    sender: UserProfile
    receiver: UserProfile
    requestId: string
  }
} & BaseNotification

export type FriendshipRequestNotification = {
  type: 'social_service_friendship_request'
  metadata: {
    sender: UserProfile
    receiver: UserProfile
    requestId: string
  }
} & BaseNotification

export type WearablesDropNotification = {
  type: 'wearables_drop'
  metadata: {
    itemName: string
    image: string
    description: string
  }
} & BaseNotification

export type NameClaimNotification = {
  type: 'name_claim'
  metadata: {
    name: string
    description: string
  }
} & BaseNotification

export type CrowdEventMilestoneNotification = {
  type: 'crowd_event_milestone'
  metadata: {
    eventName: string
    milestone: string
    description: string
  }
} & BaseNotification

export type SceneEventMilestoneNotification = {
  type: 'scene_event_milestone'
  metadata: {
    sceneName: string
    milestone: string
    description: string
  }
} & BaseNotification

export type XpEventMilestoneNotification = {
  type: 'xp_event_milestone'
  metadata: {
    milestone: string
    description: string
  }
} & BaseNotification

export type NftMilestoneNotification = {
  type: 'nft_milestone'
  metadata: {
    contractAddress: string
    tokenId: string
    milestone: string
    description: string
  }
} & BaseNotification

export type DaoProposalPublishedNotification = {
  type: 'dao_proposal_published'
  metadata: {
    proposalId: string
    title: string
    link: string
  }
} & BaseNotification

export type DaoProposalFinishNotification = {
  type: 'dao_proposal_finish'
  metadata: {
    proposalId: string
    title: string
    result: string
    link: string
  }
} & BaseNotification

export type DaoVoteReminderNotification = {
  type: 'dao_vote_reminder'
  metadata: {
    proposalId: string
    title: string
    link: string
  }
} & BaseNotification

export type ChallengeCompletedNotification = {
  type: 'challenge_completed'
  metadata: {
    challengeId: string
    title: string
    description: string
  }
} & BaseNotification

export type QuestCompletedNotification = {
  type: 'quest_completed'
  metadata: {
    questId: string
    title: string
    description: string
  }
} & BaseNotification

export type BadgesAwardedNotification = {
  type: 'badges_awarded'
  metadata: {
    badgeName: string
    badgeImage: string
    description: string
  }
} & BaseNotification

export type XpRewardNotification = {
  type: 'xp_reward'
  metadata: {
    amount: number
    description: string
  }
} & BaseNotification

export type RankChangedNotification = {
  type: 'rank_changed'
  metadata: {
    newRank: string
    description: string
  }
} & BaseNotification

export type UserProfile = {
  name: string
  address: string
  hasClaimedName: boolean
  profileImageUrl: string
}

export type Notification =
  | CreditsReminderNotification
  | EventStartedNotification
  | EventStartsSoonNotification
  | EventEndedNotification
  | FriendshipAcceptedNotification
  | FriendshipRequestNotification
  | WearablesDropNotification
  | NameClaimNotification
  | CrowdEventMilestoneNotification
  | SceneEventMilestoneNotification
  | XpEventMilestoneNotification
  | NftMilestoneNotification
  | DaoProposalPublishedNotification
  | DaoProposalFinishNotification
  | DaoVoteReminderNotification
  | ChallengeCompletedNotification
  | QuestCompletedNotification
  | BadgesAwardedNotification
  | XpRewardNotification
  | RankChangedNotification
  | ItemSoldNotification
export type FriendshipNotification =
  | FriendshipAcceptedNotification
  | FriendshipRequestNotification
export type EventNotification =
  | EventEndedNotification
  | EventStartedNotification
  | EventStartsSoonNotification
export function isFriendshipNotification(
  notification: FriendshipNotification
): boolean {
  return (
    notification.type === 'social_service_friendship_accepted' ||
    notification.type === 'social_service_friendship_request'
  )
}
export function isItemNotification(notification: Notification): boolean {
  return notification.type === 'item_sold'
}
export function isEventNotification(notification: Notification): boolean {
  return (
    notification.type === 'events_started' ||
    notification.type === 'events_ended' ||
    notification.type === 'events_starts_soon'
  )
}
