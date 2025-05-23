import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4, Vector2 } from '@dcl/sdk/math'
import ReactEcs, { Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { ChatMessage } from '../../../components/chat-message'
import MockMessages from './MessagesMock.json'
import {
  ALMOST_WHITE,
  ROUNDED_TEXTURE_BACKGROUND
} from '../../../utils/constants'
import { BevyApi } from '../../../bevy-api'
import {
  CHAT_SIDE,
  type ChatMessageDefinition,
  type ChatMessageRepresentation
} from '../../../components/chat-message/ChatMessage.types'
import { isTruthy } from '../../../utils/function-utils'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
// TODO Review getCanvasScaleRatio , if Chat should be based in height and portions by docs ?
import { listenSystemAction } from '../../../service/system-actions-emitter'

// TODO remove ts-expect-error
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { setUiFocus } from '~system/RestrictedActions'
import { isSystemMessage } from '../../../components/chat-message/ChatMessage'
import { COLOR } from '../../../components/color-palette'
import { type ReactElement } from '@dcl/react-ecs'
import Icon from '../../../components/icon/Icon'
import {
  getChatMembers,
  initChatMembersCount
} from '../../../service/chat-members'

const BUFFER_SIZE = 40

const state: {
  open: boolean
  unreadMessages: number
  autoScrollSwitch: number
  inputValue: string
} = {
  open: true,
  unreadMessages: 0,
  autoScrollSwitch: 0,
  inputValue: ''
}

export default class ChatAndLogs {
  public messages: ChatMessageRepresentation[] = MockMessages.map((m) => ({
    ...m,
    timestamp: Date.now() - 30000 + m.timestamp
  })).slice(0, BUFFER_SIZE)

  constructor() {
    console.log('ChatAndLogs constructor')

    this.listenMessages().catch(console.error)
    listenSystemAction('Chat', (pressed) => {
      if (pressed) {
        focusChatInput()
      }
    })
    initChatMembersCount().catch(console.error)
  }

  switchOpen(): void {
    state.open = !state.open
    if (state.open) {
      state.unreadMessages = 0
      scrollToBottom()
    }
  }

  isOpen(): boolean {
    return state.open
  }

  getUnreadMessages(): number {
    return state.unreadMessages
  }

  async listenMessages(): Promise<void> {
    const awaitChatStream = async (
      stream: ChatMessageDefinition[]
    ): Promise<void> => {
      for await (const chatMessage of stream) {
        if (chatMessage.message.indexOf('␑') === 0) return
        this.pushMessage(chatMessage)
        if (!state.open) {
          state.unreadMessages++
        }
      }
    }

    await awaitChatStream(await BevyApi.getChatStream())
  }

  pushMessage(message: ChatMessageDefinition): void {
    if (this.messages.length >= BUFFER_SIZE) {
      this.messages.shift()
    }
    console.log('message', message)
    this.messages.push({
      ...message,
      timestamp:
        this.messages[this.messages.length - 1].timestamp === Date.now()
          ? Date.now() + 1
          : Date.now(),
      name: isSystemMessage(message)
        ? ``
        : getPlayer({ userId: message.sender_address })?.name ?? `Unknown*`,
      side: getNextMessageSide(this.messages)
    })

    function getNextMessageSide(
      messages: ChatMessageRepresentation[]
    ): CHAT_SIDE {
      const previousMessage: ChatMessageRepresentation =
        messages[messages.length - 1]

      return isTruthy(previousMessage) &&
        previousMessage.sender_address !== message.sender_address
        ? getSwitchedSide(previousMessage)
        : CHAT_SIDE.RIGHT

      function getSwitchedSide(message: ChatMessageRepresentation): CHAT_SIDE {
        return message.side === CHAT_SIDE.LEFT
          ? CHAT_SIDE.RIGHT
          : CHAT_SIDE.LEFT
      }
    }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column',
          borderRadius: 10,
          borderColor: COLOR.BLACK_TRANSPARENT,
          borderWidth: 0
        }}
        uiBackground={{
          color: Color4.create(0, 0, 0, 0.3)
        }}
      >
        {HeaderArea()}
        {ChatArea({ messages: this.messages })}
        {InputArea()}
      </UiEntity>
    )
  }
}

function HeaderArea(): ReactElement {
  const fontSize = getCanvasScaleRatio() * 48
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '4%',
        padding: { top: '4%', bottom: '-1%', left: 0, right: 0 },
        justifyContent: 'flex-start',
        flexShrink: 0,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: COLOR.BLACK_TRANSPARENT,
        borderWidth: 1
      }}
      uiBackground={{
        color: COLOR.TEXT_COLOR
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute',
          position: { top: '70%' },
          zIndex: 1
        }}
        uiBackground={{
          color: COLOR.TEXT_COLOR
        }}
      />
      <Icon
        uiTransform={{ margin: { left: '4%' }, zIndex: 2 }}
        iconSize={28}
        icon={{ spriteName: 'DdlIconColor', atlasName: 'icons' }}
      />
      <Label
        uiTransform={{ zIndex: 1 }}
        value={'Nearby'}
        fontSize={fontSize}
        color={COLOR.INACTIVE}
      />
      <UiEntity
        uiTransform={{
          alignSelf: 'flex-end',
          width: '60%',
          height: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 1
        }}
      >
        <Icon
          iconSize={getCanvasScaleRatio() * 48}
          icon={{ spriteName: 'Members', atlasName: 'icons' }}
        />
        <Label
          uiTransform={{ position: { left: '-4%' } }}
          value={getChatMembers().length.toString()}
          fontSize={fontSize}
        />
      </UiEntity>
    </UiEntity>
  )
}

function InputArea(): ReactElement | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  const inputFontSize = '1vw' // Math.floor(getCanvasScaleRatio() * 60) // TODO cannot change Input fontSize in runtime

  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '4%',
        flexGrow: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: { top: canvasInfo.height * 0.005 },
        padding: 5
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: { ...Color4.Black(), a: 0.4 }
      }}
    >
      <Input
        uiTransform={{
          elementId: 'chat-input',
          padding: { left: '1%' },
          width: '100%',
          height: '100%',
          alignContent: 'center'
        }}
        textAlign="middle-center"
        fontSize={inputFontSize}
        color={ALMOST_WHITE}
        onChange={updateInputValue}
        placeholder="Press ENTER to chat"
        placeholderColor={{ ...ALMOST_WHITE, a: 0.6 }}
        onSubmit={sendChatMessage}
      />
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
        onMouseDown={() => {
          focusChatInput()
        }}
      />
    </UiEntity>
  )
}

function ChatArea({
  messages
}: {
  messages: ChatMessageRepresentation[]
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        display: state.open ? 'flex' : 'none',
        flexDirection: 'column',
        alignSelf: 'flex-end',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: '70vh', // TODO the rest of the sibling in parent container
        overflow: 'scroll',
        padding: { left: '3%', right: '8%' }
      }}
    >
      {messages.map((message) => (
        <ChatMessage message={message} key={message.timestamp} />
      ))}
    </UiEntity>
  )
}
function sendChatMessage(): void {
  if (!state.inputValue) return
  BevyApi.sendChat(state.inputValue, 'Nearby')
}
function updateInputValue(value: string): void {
  state.inputValue = value
}

function scrollToBottom(): void {
  state.autoScrollSwitch = state.autoScrollSwitch ? 0 : 1
}

function focusChatInput(): void {
  setUiFocus({ elementId: 'chat-input' })
  state.open = true
  scrollToBottom()
}
