import * as utils from '@dcl-sdk/utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
// import { openExternalUrl } from '~system/RestrictedActions'
import ArrowToast from '../../components/arrowToast'
import TextButton from '../../components/textButton'
import TextIconButton from '../../components/textIconButton'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  CLICKED_PRIMARY_COLOR,
  RUBY
} from '../../utils/constants'
import Canvas from '../canvas/canvas'

type StatusType =
  | 'loading'
  | 'menu'
  | 'secure-step'
  | 'fetching-data'
  | 'ready-to-start'

export class LoadingUI {
  private status: StatusType = 'loading'

  private isLogoVisible: boolean = true
  private isBackButtonVisible: boolean = false
  private isFirstButtonVisible: boolean = false
  private isSecondButtonVisible: boolean = false
  private isSpinnerVisible: boolean = false

  private firstButtonBackground: Color4 = RUBY
  private secondButtonBackground: Color4 = ALMOST_BLACK

  readonly firstButtonLoading: boolean = false
  readonly secondButtonLoading: boolean = false

  private titleText: string = ''
  private subtitleText: string = ''
  private parragraphText: string = ''
  private codeText: string = ''
  private firstButtonText: string = ''
  private secondButtonText: string = ''

  private backgroundGradientSrc: string =
    'assets/images/login/HorizontalVioletGradient.png'

  private isVisible: boolean
  private toastOpen: boolean = false
  readonly countDown: string = '5:00'
  readonly playerName: string = 'Name'
  public timer: number = 2
  private readonly uiController: UIController

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.isVisible = false
  }

  startLoading(): void {
    this.status = 'menu'
    this.updateLayout()
    this.isVisible = true
  }

  finishLoading(): void {
    this.isVisible = false
  }

  visible(): boolean {
    return this.isVisible
  }

  fetchData(): void {
    this.status = 'fetching-data'
    this.updateLayout()
    utils.timers.setTimeout(() => {
      this.status = 'ready-to-start'
      this.updateLayout()
    }, 500)
  }

  updateLayout(): void {
    this.firstButtonBackground = RUBY
    this.secondButtonBackground = ALMOST_BLACK

    switch (this.status) {
      case 'loading':
        break

      case 'menu':
        this.backgroundGradientSrc =
          'assets/images/login/HorizontalVioletGradient.png'
        this.isBackButtonVisible = false
        this.isFirstButtonVisible = true
        this.isSecondButtonVisible = true
        this.isLogoVisible = true
        this.isSpinnerVisible = false
        this.titleText = 'Discover a virtual social world'
        this.subtitleText = 'shaped by its community of\ncreators & explorers.'
        this.parragraphText = ''
        this.codeText = ''
        this.firstButtonText = 'START'
        this.secondButtonText = 'EXIT'
        break

      case 'secure-step':
        this.backgroundGradientSrc =
          'assets/images/login/HorizontalVioletGradient.png'
        this.isBackButtonVisible = true
        this.isFirstButtonVisible = false
        this.isSecondButtonVisible = false
        this.isLogoVisible = false
        this.isSpinnerVisible = false
        this.titleText = 'Secure sign-in step'
        this.subtitleText = ''

        this.parragraphText =
          'Remember the verification number below.\nYou’ll be prompted to confirm it in your\nweb browser to securely link your sign in.'
        this.codeText = Math.floor(Math.random() * 100).toString()
        break

      case 'fetching-data':
        this.backgroundGradientSrc =
          'assets/images/login/HorizontalVioletGradient.png'
        this.isBackButtonVisible = false
        this.isFirstButtonVisible = false
        this.isSecondButtonVisible = false
        this.isSpinnerVisible = true
        this.isLogoVisible = true
        this.titleText = 'Discover a virtual social world'
        this.subtitleText = 'shaped by its community of\ncreators & explorers.'
        this.parragraphText = ''
        break

      case 'ready-to-start':
        this.backgroundGradientSrc =
          'assets/images/login/BackgroundsAvatarAlpha.png'
        this.isBackButtonVisible = false
        this.isFirstButtonVisible = true
        this.isSecondButtonVisible = true
        this.isLogoVisible = true
        this.isSpinnerVisible = false
        this.titleText = 'Welcome back ' + this.playerName
        this.subtitleText = 'Ready to explore?'
        this.parragraphText = ''
        this.codeText = ''
        this.firstButtonText = 'JUMP INTO DECENTRALAND'
        this.secondButtonText = 'USE DIFFERENT ACCOUNT'

        break
      default:
        this.backgroundGradientSrc =
          'assets/images/login/HorizontalVioletGradient.png'
        this.isBackButtonVisible = false
        this.isLogoVisible = true

        break
    }
  }

  nextStep(): void {
    switch (this.status) {
      case 'loading':
        this.status = 'menu'
        break
      case 'menu':
        this.status = 'secure-step'
        break
      case 'secure-step':
        this.status = 'fetching-data'
        break
      case 'fetching-data':
        this.status = 'ready-to-start'
        break
      case 'ready-to-start':
        this.isVisible = false
        break
    }
    this.updateLayout()
  }

  async openLink(url: string): Promise<void> {
    // await openExternalUrl({ url })
  }

  onMouseEnterFirstButton(): void {
    console.log('enter first')
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const LOGO_SIZE: number = canvasInfo.height * 0.1

    // FONT SIZES
    const TITLE_FONT_SIZE: number = canvasInfo.height * 0.036
    const SUBTITLE_FONT_SIZE: number = canvasInfo.height * 0.03
    const PARAGRAPH_FONT_SIZE: number = canvasInfo.height * 0.02
    const BUTTON_FONT_SIZE: number = canvasInfo.height * 0.018
    const CODE_FONT_SIZE: number = canvasInfo.height * 0.1

    // BUTTON SIZES
    const BUTTON_WIDTH: number = canvasInfo.height * 0.3

    const LEFT_PANEL_HEIGHT: number = canvasInfo.height * 0.5
    const LEFT_PANEL_WIDTH: number = canvasInfo.width * 0.3
    const AVATAR_PANEL_WIDTH: number = canvasInfo.height * 0.4
    const AVATAR_PANEL_HEIGHT: number = canvasInfo.height * 0.8

    const HEADER_HEIGHT: number = LEFT_PANEL_HEIGHT * 0.15
    return (
      <Canvas>
        {this.isVisible && (
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            uiBackground={{
              // color: {...Color4.Blue(), a:1},
              textureMode: 'stretch',
              texture: {
                src:
                  this.status === 'loading'
                    ? 'assets/images/login/gradiant-background.png'
                    : 'assets/images/login/background.png'
              }
            }}
          >
            {this.status === 'loading' && (
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: LOGO_SIZE,
                    height: LOGO_SIZE,
                    display: 'flex'
                  }}
                  uiBackground={{
                    textureMode: 'stretch',
                    texture: { src: 'assets/images/Logo.png' }
                  }}
                />

                <UiEntity
                  uiTransform={{
                    width: '150',
                    height: '30',
                    positionType: 'absolute',
                    position: { top: '5%', right: '5%' }
                  }}
                  uiBackground={{ color: Color4.create(0, 0, 0, 0.1) }}
                  uiText={{ value: 'skip loading screen' }}
                  onMouseDown={() => {
                    this.status = 'menu'
                    this.updateLayout()
                  }}
                />
              </UiEntity>
            )}
            {this.status !== 'loading' && (
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'column'
                  // padding: { left: '15%' }
                }}
                uiBackground={{
                  //  color: {...Color4.Green(), a:0.5},
                  textureMode: 'stretch',
                  texture: {
                    src: this.backgroundGradientSrc
                  }
                }}
              >
                {/* FLOATING BUTTON */}
                <UiEntity
                  uiTransform={{
                    display: this.status === 'secure-step' ? 'flex' : 'none',
                    width: '150',
                    height: '30',
                    positionType: 'absolute',
                    position: { top: '5%', right: '5%' }
                  }}
                  uiBackground={{ color: Color4.create(0, 0, 0, 0.1) }}
                  uiText={{ value: 'click YES in the verification window' }}
                  onMouseDown={() => {
                    this.fetchData()
                  }}
                />
                {/* AVATAR PANEL */}
                {this.status === 'ready-to-start' && (
                  <UiEntity
                    uiTransform={{
                      positionType: 'absolute',
                      position: { top: 0, right: '23%' },
                      width: AVATAR_PANEL_WIDTH,
                      height: AVATAR_PANEL_HEIGHT,
                      flexDirection: 'column-reverse',
                      alignItems: 'center'
                    }}
                    // uiBackground={{ color: { ...Color4.Green(), a: 0.5 } }}
                  >
                    <UiEntity
                      uiTransform={{
                        width: AVATAR_PANEL_WIDTH,
                        height: AVATAR_PANEL_WIDTH * 0.37
                      }}
                      uiBackground={{
                        //  color: {...Color4.Green(), a:0.5},
                        textureMode: 'stretch',
                        texture: {
                          src: 'assets/images/login/Platform.png'
                        }
                      }}
                    />
                  </UiEntity>
                )}

                {/* LEFT PANEL */}
                <UiEntity
                  uiTransform={{
                    display: 'flex',
                    width: LEFT_PANEL_WIDTH,
                    minWidth: 480,
                    height: LEFT_PANEL_HEIGHT,
                    flexDirection: 'column',
                    margin: {
                      left: Math.min(
                        canvasInfo.width * 0.15,
                        (canvasInfo.width - LEFT_PANEL_WIDTH) / 2
                      )
                    }
                  }}
                  // uiBackground={{ color: { ...Color4.Red(), a: 0.5 } }}
                >
                  {/* HEADER */}
                  <UiEntity
                    uiTransform={{
                      width: '100%',
                      height: HEADER_HEIGHT,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    // uiBackground={{ color: Color4.Red() }}
                  >
                    {/* BACK BUTTON */}
                    <TextIconButton
                      uiTransform={{
                        margin: 0,
                        display: this.isBackButtonVisible ? 'flex' : 'none',
                        width: BUTTON_WIDTH / 3
                      }}
                      iconColor={RUBY}
                      icon={{ atlasName: 'icons', spriteName: 'LeftArrow' }}
                      onMouseDown={() => {
                        console.log('click back')
                        utils.timers.setTimeout(() => {
                          this.status = 'menu'
                          this.updateLayout()
                          this.toastOpen = false
                        }, 100)
                      }}
                      value={'BACK'}
                      fontSize={BUTTON_FONT_SIZE * 0.7}
                      fontColor={ALMOST_BLACK}
                      onMouseEnter={function (): void {
                        throw new Error('Function not implemented.')
                      }}
                      onMouseLeave={function (): void {
                        throw new Error('Function not implemented.')
                      }}
                      backgroundColor={ALMOST_WHITE}
                    />
                    {/* LOGO DECENTRALAND */}
                    <UiEntity
                      uiTransform={{
                        display: this.isLogoVisible ? 'flex' : 'none',
                        width: HEADER_HEIGHT * 5.3 * 0.55,
                        height: HEADER_HEIGHT * 0.55
                      }}
                      uiBackground={{
                        textureMode: 'stretch',
                        texture: { src: 'assets/images/login/LogoWithText.png' }
                      }}
                    />
                  </UiEntity>

                  {/* CONTENT */}
                  <UiEntity
                    uiTransform={{
                      width: '100%',
                      minWidth: 479.9,
                      flexDirection: 'column'
                    }}
                    // uiBackground={{ color: {...Color4.Blue(), a:0.5} }}
                  >
                    {/* TITLE */}

                    <UiEntity
                      // uiBackground={{ color: {...Color4.Yellow(), a:0.5} }}
                      uiTransform={{
                        display: this.titleText !== '' ? 'flex' : 'none',
                        width: '100%',
                        height: 'auto'
                      }}
                      uiText={{
                        value: this.titleText,
                        fontSize: TITLE_FONT_SIZE,
                        textAlign: 'middle-left'
                      }}
                    />

                    {/* SUBTITLE */}
                    <UiEntity
                      // uiBackground={{ color: {...Color4.Purple(), a:0.5} }}
                      uiTransform={{
                        display: this.subtitleText !== '' ? 'flex' : 'none',
                        width: '100%',
                        height: 'auto'
                      }}
                      uiText={{
                        value: this.subtitleText,
                        fontSize: SUBTITLE_FONT_SIZE,
                        textAlign: 'middle-left'
                      }}
                    />
                    {/* END SUBTITLE */}

                    {/* PARRAGRAPH */}
                    <UiEntity
                      // uiBackground={{ color: {...Color4.Black(), a:0.5} }}
                      uiTransform={{
                        display: this.parragraphText !== '' ? 'flex' : 'none',
                        width: '100%',
                        height: 'auto'
                      }}
                      uiText={{
                        value: this.parragraphText,
                        fontSize: PARAGRAPH_FONT_SIZE,
                        textAlign: 'middle-left'
                      }}
                    />
                    {/* END PARRAGRAPH */}

                    {/* CODE SPACE */}
                    {this.status === 'secure-step' && (
                      <UiEntity
                        uiTransform={{
                          width: '100%',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          flexDirection: 'column'
                        }}
                        // uiBackground={{ color:{...Color4.Gray(), a:0.5}}}
                      >
                        <UiEntity
                          uiTransform={{
                            width: '100%',
                            height: CODE_FONT_SIZE,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            flexDirection: 'row'
                          }}
                        >
                          <UiEntity
                            uiTransform={{
                              width: 'auto',
                              // width: CODE_FONT_SIZE * 1.5,
                              height: CODE_FONT_SIZE
                              // margin: { left: PARAGRAPH_FONT_SIZE * 0.5 }
                            }}
                            uiText={{
                              value: this.codeText,
                              fontSize: CODE_FONT_SIZE,
                              textAlign: 'middle-left',
                              font: 'monospace'
                            }}
                          />
                          <UiEntity
                            uiTransform={{
                              width: PARAGRAPH_FONT_SIZE,
                              height: PARAGRAPH_FONT_SIZE,
                              margin: { left: PARAGRAPH_FONT_SIZE },
                              alignItems: 'center',
                              flexDirection: 'row'
                            }}
                            uiBackground={{
                              textureMode: 'stretch',
                              texture: { src: 'assets/images/InfoButton.png' }
                            }}
                            onMouseDown={() => {
                              this.toastOpen = !this.toastOpen
                            }}
                          >
                            <ArrowToast
                              uiTransform={{
                                display: this.toastOpen ? 'flex' : 'none',
                                width: CODE_FONT_SIZE * 2.2,
                                height: CODE_FONT_SIZE * 0.75,
                                positionType: 'absolute',
                                position: { left: PARAGRAPH_FONT_SIZE }
                              }}
                              text={
                                'Keep this number private. It ensures that your sign-in is secure and unique to you.'
                              }
                              fontSize={PARAGRAPH_FONT_SIZE * 0.7}
                              arrowSide={'left'}
                            />
                          </UiEntity>
                        </UiEntity>
                        {/* EXPIRATION TIME */}
                        <UiEntity
                          uiTransform={{
                            width: '100%',
                            height: PARAGRAPH_FONT_SIZE * 0.7
                          }}
                          uiText={{
                            value:
                              'Verification number will expire in ' +
                              this.countDown +
                              ' minutes',
                            fontSize: PARAGRAPH_FONT_SIZE * 0.7,
                            textAlign: 'middle-left'
                          }}
                        />
                      </UiEntity>
                    )}
                    {/* END CODE SPACE */}
                    {/* BUTTONS & SPINNER */}
                    <UiEntity
                      uiTransform={{
                        width: BUTTON_WIDTH,
                        flexDirection: 'column',
                        alignItems: this.isSpinnerVisible
                          ? 'center'
                          : 'flex-start'
                      }}
                      // uiBackground={{ color: {...Color4.Red(), a:0.2} }}
                    >
                      {/* SPINNER */}
                      {this.isSpinnerVisible && (
                        <UiEntity
                          uiTransform={{
                            width: BUTTON_WIDTH / 4,
                            height: BUTTON_WIDTH / 4
                          }}
                          uiBackground={{
                            textureMode: 'stretch',
                            texture: { src: 'assets/images/Spinner.png' }
                          }}
                        />
                      )}

                      {/* FIRST BUTTON */}
                      {this.isFirstButtonVisible && (
                        <TextButton
                          uiTransform={{
                            width: BUTTON_WIDTH
                          }}
                          backgroundColor={this.firstButtonBackground}
                          isLoading={this.firstButtonLoading}
                          onMouseDown={() => {
                            utils.timers.setTimeout(() => {
                              this.nextStep()
                            }, 200)
                          }}
                          onMouseEnter={() =>
                            (this.firstButtonBackground = CLICKED_PRIMARY_COLOR)
                          }
                          onMouseLeave={() =>
                            (this.firstButtonBackground = RUBY)
                          }
                          value={this.firstButtonText}
                          fontSize={BUTTON_FONT_SIZE}
                        />
                      )}

                      {/* SECOND BUTTON */}
                      {this.isSecondButtonVisible && (
                        <TextButton
                          uiTransform={{
                            width: BUTTON_WIDTH
                          }}
                          backgroundColor={this.secondButtonBackground}
                          isLoading={this.secondButtonLoading}
                          onMouseDown={() => {
                            if (this.status === 'ready-to-start') {
                              this.toastOpen = false
                              utils.timers.setTimeout(() => {
                                this.status = 'secure-step'
                                this.updateLayout()
                              }, 200)
                            }
                          }}
                          onMouseEnter={() =>
                            (this.secondButtonBackground = Color4.Gray())
                          }
                          onMouseLeave={() =>
                            (this.secondButtonBackground = ALMOST_BLACK)
                          }
                          value={this.secondButtonText}
                          fontSize={BUTTON_FONT_SIZE}
                        />
                      )}
                    </UiEntity>
                    {/* END BUTTONS & SPINNER */}
                  </UiEntity>
                </UiEntity>
              </UiEntity>
            )}
          </UiEntity>
        )}
      </Canvas>
    )
  }
}
