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
  private backgroundColor: Color4 | undefined = undefined
  private closeButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
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
        {/* AREA TO HIDE/SHOW THE CHAT */}
        <UiEntity
          uiTransform={{
            display: this.backgroundVisible ? 'flex' : 'none',
            width: canvasInfo.width * 0.15,
            minWidth: 250,
            height: 250,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column-reverse',
            position: {
              left: this.uiController.mainHud.isSideBarVisible
                ? leftPosition
                : canvasInfo.width * 0.01,
              bottom: canvasInfo.width * 0.01
            },
            positionType: 'absolute'
          }}
          onMouseEnter={() => {
            this.backgroundColor = { ...Color4.Black(), a: 0.4 }
          }}
          onMouseLeave={() => {
            this.backgroundColor = undefined
          }}
        />

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
              left: 1000,
              // left: this.uiController.mainHud.isSideBarVisible
              //   ? leftPosition
              //   : canvasInfo.width * 0.01,
              bottom: canvasInfo.width * 0.01
            },
            positionType: 'absolute'
          }}
          uiBackground={{
            color: this.backgroundColor ?? { ...Color4.Black(), a: 0 },
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
              height: 30,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              margin:{top: canvasInfo.height * 0.005}
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
                padding: this.fontSize * 0.5,
                width: '80%',
                height: this.fontSize * 2,
                alignContent: 'center'
              }}
              fontSize={this.fontSize}
              color={ALMOST_WHITE}
              onChange={($) => {
                this.inputValue = $
              }}
              value={this.inputValue}
              placeholder="Click to chat"
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
          </UiEntity>

          {/* CHAT AREA */}
          <UiEntity
            uiTransform={{
              width: '100%',
              height: 'auto',
              // maxHeight: canvasInfo.height * 0.4,
              flexDirection: 'column',
              alignItems:'flex-start',

              justifyContent:'flex-end',
              // overflow: 'scroll',
              flexGrow:1
              
            }}
            // uiBackground={{ color: Color4.Green() }}
          >
            <UiEntity
            uiTransform={{
              width: '90%',
              height: '100%',
              flexDirection: 'column',
              justifyContent:'flex-end',
              position:{bottom:0},
scrollPosition: {x:0, y:1}         // maxHeight: canvasInfo.height * 0.4,
              // minHeight:200,
            }}
          >
            {/* <UiEntity uiTransform={{width:10, height:10}} uiBackground={{color:Color4.Black()}}/>
            <UiEntity uiTransform={{width:10, height:10}} uiBackground={{color:Color4.Black()}}/> */}
            {this.messages.length > 0 && (
              <ChatMessage message={this.messages[this.messages.length - 1]} />
            )}
            <UiEntity
              uiTransform={{
                display:this.backgroundVisible?'flex':'none',
                width: '100%',
                height: 'auto',

                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              {this.messages.length > 1 &&
                this.messages.map(
                  (message, index) =>
                    index !== this.messages.length - 1 && index > this.messages.length - this.BUFFER_SIZE && (
                      <ChatMessage message={message} />
                    )
                )}
            </UiEntity>
            </UiEntity>
            
          </UiEntity>

          {/* BUTTONS */}
          <IconButton
            onMouseEnter={() => {
              this.closeButtonColor = { ...Color4.Black(), a: 0.7 }
            }}
            onMouseLeave={() => {
              this.closeButtonColor = { ...Color4.Black(), a: 0.35 }
            }}
            onMouseDown={() => {
              this.backgroundVisible = false
              // this.backgroundColor = undefined
            }}
            uiTransform={{
              display: this.backgroundVisible ? 'flex' : 'none',
              width: 2 * this.fontSize,
              height: 2 * this.fontSize,
              pointerFilter: 'none',
            }}
            backgroundColor={this.closeButtonColor}
            icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
          />


        </UiEntity>
      </Canvas>
    )
  }
}
