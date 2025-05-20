import { engine, executeTask, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4, Vector2 } from '@dcl/sdk/math'
import ReactEcs, { Input, UiEntity } from '@dcl/sdk/react-ecs'
// import ButtonIcon from '../../components/ButtonIcon'
import { getPlayer } from '@dcl/sdk/src/players'
import { ButtonIcon } from '../../../components/button-icon'
import { ChatMessage } from '../../../components/chat-message'
import { type UIController } from '../../../controllers/ui.controller'
import MockMessages from './MessagesMock.json'
import {
  ALMOST_WHITE,
  ALPHA_BLACK_PANEL,
  LEFT_PANEL_MIN_WIDTH,
  LEFT_PANEL_WIDTH_FACTOR,
  ROUNDED_TEXTURE_BACKGROUND
} from '../../../utils/constants'
import { BevyApi } from '../../../bevy-api'
import {
  CHAT_SIDE,
  type ChatMessageDefinition,
  type ChatMessageRepresentation
} from '../../../components/chat-message/ChatMessage.types'
import { sleep } from '../../../utils/dcl-utils'
import { isTruthy } from '../../../utils/function-utils'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'
const BUFFER_SIZE = 19

export default class ChatAndLogs {
  private readonly uiController: UIController
  public fontSize: number = 14
  public messages: ChatMessageRepresentation[] = MockMessages.map((m) => ({
    ...m,
    timestamp: Date.now() - 30000 + m.timestamp
  })).slice(0, BUFFER_SIZE)

  private inputValue: string = ''
  private readonly myPlayer = getPlayer()

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.listenMessages().catch(console.error)
  }

  async listenMessages(): Promise<void> {
    const awaitChatStream = async (
      stream: ChatMessageDefinition[]
    ): Promise<void> => {
      for await (const chatMessage of stream) {
        this.pushMessage(chatMessage)
      }
    }

    await awaitChatStream(await BevyApi.getChatStream())
  }

  pushMessage(message: ChatMessageDefinition): void {
    if (this.messages.length >= BUFFER_SIZE) {
      this.messages.shift()
    }

    this.messages.push({
      ...message,
      timestamp: Date.now(),
      name: getPlayer({ userId: message.sender_address })?.name ?? `Unknown*`,
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

  handleSubmitMessageFromOther(value: string): void {}

  handleSubmitMessageFromDcl(value: string): void {}

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    const panelWidth: number = getCanvasScaleRatio() * 800
    const maxHeight = getCanvasScaleRatio() * 1400
    const scrollPosition = Vector2.create(0, maxHeight)
    return (
      <UiEntity
        uiTransform={{
          width: panelWidth,
          height: 'auto',
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'column-reverse',
          padding: '2%'
        }}
        uiBackground={{
          color: Color4.create(0, 0, 0, 0.3)
        }}
      >
        {/* INPUT AREA */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: this.fontSize * 3,
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
              padding: { left: this.fontSize * 0.5 },
              width: '80%',
              height: 1.4 * this.fontSize,
              alignContent: 'center'
            }}
            textAlign="middle-center"
            fontSize={this.fontSize}
            color={ALMOST_WHITE}
            onChange={(inputValue) => {
              console.log('onChange', inputValue)
              this.inputValue = inputValue
            }}
            value={this.inputValue}
            placeholder="Click to chat"
            placeholderColor={{ ...ALMOST_WHITE, a: 0.6 }}
            onSubmit={(value) => {
              // TODO issue with onInput, becomes a loop
              // this.handleSubmitMessage(value)
            }}
          />

          <ButtonIcon
            onMouseDown={() => {
              BevyApi.sendChat(this.inputValue, 'Nearby')

              executeTask(async () => {
                // TODO this doesn't work, probably because onChange loop, or that value only works in initialization
                await sleep(0)
                this.inputValue = ''
              })
            }}
            uiTransform={{
              width: 20,
              height: 20
            }}
            icon={{ atlasName: 'icons', spriteName: 'PublishIcon' }}
          />
        </UiEntity>
        {/* CHAT AREA */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: 'auto',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            overflow: 'scroll',
            maxHeight,
            scrollPosition,
            borderRadius: getCanvasScaleRatio() * BORDER_RADIUS_F * 2,
            padding: { right: '10%' }
          }}
          uiBackground={
            {
              // color: ALPHA_BLACK_PANEL
            }
          }
        >
          {this.messages.map((message) => (
            <ChatMessage message={message} key={message.timestamp} />
          ))}
        </UiEntity>
      </UiEntity>
    )
  }
}
