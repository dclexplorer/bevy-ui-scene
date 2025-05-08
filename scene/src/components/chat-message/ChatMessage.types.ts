export type ChatMessageDefinition = {
  sender_address: string
  message: string
  channel: string
}
export enum CHAT_SIDE {
  LEFT,
  RIGHT
}
export type ChatMessageRepresentation = ChatMessageDefinition & {
  timestamp: number
  name: string
  side: CHAT_SIDE
}
