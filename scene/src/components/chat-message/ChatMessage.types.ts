import { type GetPlayerDataRes } from '../../utils/definitions'

export type ChatMessageDefinition = {
  sender_address: string
  message: string
  channel: string
}
export enum CHAT_SIDE {
  LEFT,
  RIGHT
}
export enum MESSAGE_TYPE {
  USER,
  SYSTEM,
  SYSTEM_FEEDBACK
}
export type ChatMessageRepresentation = ChatMessageDefinition & {
  id: number
  timestamp: number
  name: string
  hasClaimedName?: boolean
  side: CHAT_SIDE
  hasMentionToMe: boolean
  isGuest: boolean
  messageType: MESSAGE_TYPE
  player: GetPlayerDataRes | null
  mentionedPlayers: Record<string, GetPlayerDataRes>
}
