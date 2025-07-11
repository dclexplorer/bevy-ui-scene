export interface BaseNotification {
  id: string
  type: string
  address: string
  metadata: any
  timestamp: string
  read: boolean
}

// Credits reminder
export interface CreditsReminderNotification extends BaseNotification {
  type: 'credits_reminder_do_not_miss_out'
  metadata: {
    link: string
  }
}

// Events
export interface EventStartedNotification extends BaseNotification {
  type: 'events_started'
  metadata: {
    link: string
    name: string
    image: string
    title: string
    description: string
  }
}

export interface EventStartsSoonNotification extends BaseNotification {
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
}

export interface EventEndedNotification extends BaseNotification {
  type: 'events_ended'
  metadata: {
    link: string
    name: string
    image: string
    title: string
    description: string
  }
}

// Social
export interface FriendshipAcceptedNotification extends BaseNotification {
  type: 'social_service_friendship_accepted'
  metadata: {
    sender: UserProfile
    receiver: UserProfile
    requestId: string
  }
}

export interface FriendshipRequestNotification extends BaseNotification {
  type: 'social_service_friendship_request'
  metadata: {
    sender: UserProfile
    receiver: UserProfile
    requestId: string
  }
}

export interface WearablesDropNotification extends BaseNotification {
  type: 'wearables_drop'
  metadata: {
    itemName: string
    image: string
    description: string
  }
}

export interface NameClaimNotification extends BaseNotification {
  type: 'name_claim'
  metadata: {
    name: string
    description: string
  }
}

export interface CrowdEventMilestoneNotification extends BaseNotification {
  type: 'crowd_event_milestone'
  metadata: {
    eventName: string
    milestone: string
    description: string
  }
}

export interface SceneEventMilestoneNotification extends BaseNotification {
  type: 'scene_event_milestone'
  metadata: {
    sceneName: string
    milestone: string
    description: string
  }
}

export interface XpEventMilestoneNotification extends BaseNotification {
  type: 'xp_event_milestone'
  metadata: {
    milestone: string
    description: string
  }
}

export interface NftMilestoneNotification extends BaseNotification {
  type: 'nft_milestone'
  metadata: {
    contractAddress: string
    tokenId: string
    milestone: string
    description: string
  }
}

export interface DaoProposalPublishedNotification extends BaseNotification {
  type: 'dao_proposal_published'
  metadata: {
    proposalId: string
    title: string
    link: string
  }
}

export interface DaoProposalFinishNotification extends BaseNotification {
  type: 'dao_proposal_finish'
  metadata: {
    proposalId: string
    title: string
    result: string
    link: string
  }
}

export interface DaoVoteReminderNotification extends BaseNotification {
  type: 'dao_vote_reminder'
  metadata: {
    proposalId: string
    title: string
    link: string
  }
}

export interface ChallengeCompletedNotification extends BaseNotification {
  type: 'challenge_completed'
  metadata: {
    challengeId: string
    title: string
    description: string
  }
}

export interface QuestCompletedNotification extends BaseNotification {
  type: 'quest_completed'
  metadata: {
    questId: string
    title: string
    description: string
  }
}

export interface BadgesAwardedNotification extends BaseNotification {
  type: 'badges_awarded'
  metadata: {
    badgeName: string
    badgeImage: string
    description: string
  }
}

export interface XpRewardNotification extends BaseNotification {
  type: 'xp_reward'
  metadata: {
    amount: number
    description: string
  }
}

export interface RankChangedNotification extends BaseNotification {
  type: 'rank_changed'
  metadata: {
    newRank: string
    description: string
  }
}

export interface UserProfile {
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
export function isEventNotification(notification: Notification): boolean {
  return (
    notification.type === 'events_started' ||
    notification.type === 'events_ended' ||
    notification.type === 'events_starts_soon'
  )
}
