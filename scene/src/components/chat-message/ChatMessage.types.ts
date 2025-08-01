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
  SYSTEM
}
export type ChatMessageRepresentation = ChatMessageDefinition & {
  timestamp: number
  name: string
  side: CHAT_SIDE
  hasMentionToMe: boolean
  isGuest: boolean
  messageType: MESSAGE_TYPE
}
