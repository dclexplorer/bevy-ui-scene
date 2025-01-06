import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Input, UiEntity } from '@dcl/sdk/react-ecs'
// import IconButton from '../../components/iconButton'
import { getPlayer } from '@dcl/sdk/src/players'
import ChatMessage from '../../components/chatMessage'
import IconButton from '../../components/iconButton'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_WHITE,
  ALPHA_BLACK_PANEL,
  LEFT_PANEL_MIN_WIDTH,
  LEFT_PANEL_WIDTH_FACTOR
} from '../../utils/constants'
import { type Message } from '../../utils/definitions'

export class ChatAndLogs {
  private readonly uiController: UIController
  public fontSize: number = 14
  private readonly BUFFER_SIZE: number = 9
  public messages: Message[] = []

  private inputValue: string = ''
  private readonly myPlayer = getPlayer()

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  handleSubmitMessage(value: string): void {
    if (this.myPlayer !== null) {
      this.messages.push({ from: this.myPlayer.userId, text: value })
      console.log(this.messages)
    }
  }

  handleSubmitMessageFromOther(value: string): void {
    this.messages.push({ from: 'Other people', text: value })
    console.log(this.messages)
  }

  handleSubmitMessageFromDcl(value: string): void {
    this.messages.push({ from: 'dcl', text: value })
    console.log(this.messages)
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    let panelWidth: number

    if (canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR < LEFT_PANEL_MIN_WIDTH) {
      panelWidth = LEFT_PANEL_MIN_WIDTH
    } else {
      panelWidth = canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR
    }

    return (
      <UiEntity
        uiTransform={{
          width: panelWidth,
          minWidth: 250,
          height: 'auto',
          // maxHeight: canvasInfo.height * 0.4,
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'column-reverse',
          padding:
            canvasInfo.width * 0.005 > 2.5 ? canvasInfo.width * 0.005 : 2.5
        }}
        uiBackground={{
          color: ALPHA_BLACK_PANEL,
          textureMode: 'nine-slices',
          texture: {
            src: 'assets/images/backgrounds/rounded.png'
          },
          textureSlices: {
            top: 0.5,
            bottom: 0.5,
            left: 0.5,
            right: 0.5
          }
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
            color: { ...Color4.Black(), a: 0.4 },
            textureMode: 'nine-slices',
            texture: {
              src: 'assets/images/backgrounds/rounded.png'
            },
            textureSlices: {
              top: 0.5,
              bottom: 0.5,
              left: 0.5,
              right: 0.5
            }
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
            onChange={($) => {
              this.inputValue = $
            }}
            value={this.inputValue}
            placeholder="Click to chat"
            placeholderColor={{ ...ALMOST_WHITE, a: 0.6 }}
            onSubmit={(value) => {
              this.handleSubmitMessage(value)
            }}
          />

          <IconButton
            onMouseDown={() => {
              this.handleSubmitMessage(this.inputValue)
              this.inputValue = ''
            }}
            uiTransform={{
              width: 20,
              height: 20
            }}
            icon={{ atlasName: 'icons', spriteName: 'PublishIcon' }}
          />
          <IconButton
            onMouseDown={() => {
              this.handleSubmitMessageFromOther(this.inputValue)
              this.inputValue = ''
            }}
            uiTransform={{
              width: 20,
              height: 20
            }}
            icon={{ atlasName: 'icons', spriteName: 'PublishIcon' }}
          />
          <IconButton
            onMouseDown={() => {
              this.handleSubmitMessageFromDcl(this.inputValue)
              this.inputValue = ''
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

            justifyContent: 'flex-end'
          }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: { bottom: 0 }
            }}
          >
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',

                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              {this.messages.length >= 1 &&
                this.messages.map(
                  (message, index) =>
                    index > this.messages.length - this.BUFFER_SIZE && (
                      <ChatMessage message={message} />
                    )
                )}
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
