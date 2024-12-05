import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Input, UiEntity } from '@dcl/sdk/react-ecs'
// import IconButton from '../../components/iconButton'
import ChatMessage from '../../components/chatMessage'
import IconButton from '../../components/iconButton'
import { type UIController } from '../../controllers/ui.controller'
import { ALMOST_WHITE } from '../../utils/constants'
import { type Message } from '../../utils/definitions'
import Canvas from '../canvas/canvas'

export class ChatAndLogs {
  private readonly uiController: UIController
  public fontSize: number = 14
  // private readonly MESSAGE_HEIGHT: number = 50
  // private readonly VIEWPORT_HEIGHT: number = 600
  private readonly BUFFER_SIZE: number = 9

  public messages: Message[] = []
  private readonly visibleMessages: Message[] = []

  private backgroundVisible: boolean = true
  private inputValue: string = ''

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  handleSubmitMessage(value: string): void {
    this.messages.push({ from: 'me', text: value })
    console.log(this.messages)
    this.backgroundVisible = true
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
    let leftPosition: number

    if ((canvasInfo.width * 2.5) / 100 < 45) {
      leftPosition = 45 + (canvasInfo.width * 1) / 100
    } else {
      leftPosition = (canvasInfo.width * 3.4) / 100
    }
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: canvasInfo.width * 0.15,
            minWidth: 250,
            height: 'auto',
            // maxHeight: canvasInfo.height * 0.4,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            flexDirection: 'column-reverse',
            padding:
              canvasInfo.width * 0.005 > 2.5 ? canvasInfo.width * 0.005 : 2.5,
            position: {
              left: this.uiController.mainHud.isSideBarVisible
                ? leftPosition
                : canvasInfo.width * 0.01,
              bottom: canvasInfo.width * 0.01
            },
            positionType: 'absolute'
          }}
          uiBackground={{
            color: { ...Color4.Black(), a: 0.05 },
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
              margin: { top: canvasInfo.height * 0.005 }
            }}
            onMouseDown={() => {
              this.backgroundVisible = true
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
              placeholderColor={{...ALMOST_WHITE, a:0.6}}
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
                width: '90%',
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
      </Canvas>
    )
  }
}
