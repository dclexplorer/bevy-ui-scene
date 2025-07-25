export type PermissionDefinition = {
  permissionType: string
  label: string
  activeDescription: string
  passiveDescription: string
  section: 'Gameplay' | 'Navigation' | 'Portable Experiences' | 'Communication'
}
export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  {
    permissionType: 'MovePlayer',
    label: 'Move Avatar',
    activeDescription: 'moving your avatar',
    passiveDescription: 'move your avatar within the scene bounds',
    section: 'Gameplay'
  },
  {
    permissionType: 'ForceCamera',
    label: 'Force Camera',
    activeDescription: 'enforcing the camera view',
    passiveDescription: 'temporarily change the camera view',
    section: 'Gameplay'
  },
  {
    permissionType: 'PlayEmote',
    label: 'Play Emote',
    activeDescription: 'making your avatar perform an emote',
    passiveDescription: 'make your avatar perform an emote',
    section: 'Gameplay'
  },
  {
    permissionType: 'SetLocomotion',
    label: 'Set Locomotion',
    activeDescription: 'enforcing your locomotion settings',
    passiveDescription: "temporarily modify your avatar's locomotion settings",
    section: 'Gameplay'
  },
  {
    permissionType: 'HideAvatars',
    label: 'Hide Avatars',
    activeDescription: 'hiding some avatars',
    passiveDescription: 'temporarily hide player avatars',
    section: 'Gameplay'
  },
  {
    permissionType: 'DisableVoice',
    label: 'Disable Voice',
    activeDescription: 'disabling voice communications',
    passiveDescription: 'temporarily disable voice chat',
    section: 'Gameplay'
  },
  {
    permissionType: 'Teleport',
    label: 'Teleport',
    activeDescription: 'teleporting you to a new location',
    passiveDescription: 'teleport you to a new location',
    section: 'Navigation'
  },
  {
    permissionType: 'ChangeRealm',
    label: 'Change Realm',
    activeDescription: 'teleporting you to a new realm',
    passiveDescription: 'move you to a new realm',
    section: 'Navigation'
  },
  {
    permissionType: 'SpawnPortable',
    label: 'Spawn Portable Experience',
    activeDescription: 'spawning a portable experience',
    passiveDescription: 'spawn a portable experience',
    section: 'Portable Experiences'
  },
  {
    permissionType: 'KillPortables',
    label: 'Manage Portable Experiences',
    activeDescription: 'managing your active portables',
    passiveDescription: 'manage your active portable experiences',
    section: 'Portable Experiences'
  },
  {
    permissionType: 'Web3',
    label: 'Web3 Transaction',
    activeDescription: 'initiating a web3 transaction',
    passiveDescription: 'initiate a web3 transaction with your wallet',
    section: 'Communication'
  },
  {
    permissionType: 'Fetch',
    label: 'Fetch Data',
    activeDescription: 'fetching remote data',
    passiveDescription: 'fetch data from a remote server',
    section: 'Communication'
  },
  {
    permissionType: 'Websocket',
    label: 'Open Websocket',
    activeDescription: 'opening a websocket',
    passiveDescription: 'open a web socket to communicate with a remote server',
    section: 'Communication'
  },
  {
    permissionType: 'OpenUrl',
    label: 'Open Url',
    activeDescription: 'opening a url in your browser',
    passiveDescription: 'open a url in your browser',
    section: 'Communication'
  },
  {
    permissionType: 'CopyToClipboard',
    label: 'Copy to Clipboard',
    activeDescription: 'copying text into the clipboard',
    passiveDescription: 'copy text into the clipboard',
    section: 'Communication'
  }
]

export type PermissionLevel = 'Realm' | 'Scene' | 'Global'
export type PermissionValue = 'Allow' | 'Deny' | 'Ask' | null

export type PermissionRequest = {
  ty: string
  additional: string | undefined
  scene: string
  id: number
}

export type PermissionUsed = {
  ty: string
  additional: string | undefined
  scene: string
  wasAllowed: boolean
}

export type GetPermanentPermissionsArgs = {
  level: PermissionLevel
  value?: string
}

export type PermanentPermissionItem = {
  ty: string
  allow: PermissionValue
}

export type SetSinglePermissionArgs = {
  id: number
  allow: boolean
}

export type SetPermanentPermissionArgs = {
  level: PermissionLevel
  value?: string
  ty: string
  allow?: PermissionValue
}

export type PermissionTypeItem = {
  ty: string
  name: string
  passive: string
  active: string
}
