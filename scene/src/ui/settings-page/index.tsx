import { Color4 } from '@dcl/ecs-math'
import {
  UiCanvasInformation,
  // UiScrollResult,
  // UiTransform,
  engine
} from '@dcl/sdk/ecs'
import ReactEcs, { Dropdown, Label, UiEntity } from '@dcl/sdk/react-ecs'
import Slider from '../../components/slider'
import TextIconButton from '../../components/textIconButton'
import { type UIController } from '../../controllers/ui.controller'
import { ALMOST_BLACK, ALMOST_WHITE, ORANGE } from '../../utils/constants'
import { type Icon } from '../../utils/definitions'
import { BevyApi } from '../../bevy-api'

export class SettingsPage {
  private readonly uiController: UIController

  private readonly toggleIcon: Icon = {
    atlasName: 'toggles',
    spriteName: 'SwitchOn'
  }

  private readonly toggleStatus: boolean = false

  private backgroundIcon: string = 'assets/images/menu/GeneralImg.png'
  private generalTextColor: Color4 = ALMOST_WHITE
  private graphicsTextColor: Color4 = ALMOST_BLACK
  private audioTextColor: Color4 = ALMOST_BLACK
  private gameplayTextColor: Color4 = ALMOST_BLACK
  private performanceTextColor: Color4 = ALMOST_BLACK
  private restoreTextColor: Color4 = Color4.Red()
  private generalBackgroundColor: Color4 = ORANGE
  private graphicsBackgroundColor: Color4 = ALMOST_WHITE
  private audioBackgroundColor: Color4 = ALMOST_WHITE
  private gameplayBackgroundColor: Color4 = ALMOST_WHITE
  private performanceBackgroundColor: Color4 = ALMOST_WHITE
  private restoreBackgroundColor: Color4 = ALMOST_WHITE
  private buttonClicked:
    | 'general'
    | 'audio'
    | 'graphics'
    | 'gameplay'
    | 'performance' = 'performance'

  // private settingsInfoTitle: string = ''
  private settingsInfoDescription: string = ''
  private settingsSelectedDescription: string = ''

  constructor(uiController: UIController) {
    this.uiController = uiController
    engine.addSystem(this.controllerSystem.bind(this))
  }

  setButtonClicked(
    button: 'general' | 'audio' | 'graphics' | 'gameplay' | 'performance'
  ): void {
    this.buttonClicked = button
    this.updateButtons()
  }

  generalEnter(): void {
    this.generalBackgroundColor = ORANGE
    this.generalTextColor = ALMOST_WHITE
  }

  audioEnter(): void {
    this.audioBackgroundColor = ORANGE
    this.audioTextColor = ALMOST_WHITE
  }

  graphicsEnter(): void {
    this.graphicsBackgroundColor = ORANGE
    this.graphicsTextColor = ALMOST_WHITE
  }

  gameplayEnter(): void {
    this.gameplayBackgroundColor = ORANGE
    this.gameplayTextColor = ALMOST_WHITE
  }

  performanceEnter(): void {
    this.performanceBackgroundColor = ORANGE
    this.performanceTextColor = ALMOST_WHITE
  }

  restoreEnter(): void {
    this.restoreBackgroundColor = Color4.Red()
    this.restoreTextColor = ALMOST_WHITE
  }

  updateButtons(): void {
    this.generalBackgroundColor = ALMOST_WHITE
    this.graphicsBackgroundColor = ALMOST_WHITE
    this.audioBackgroundColor = ALMOST_WHITE
    this.gameplayBackgroundColor = ALMOST_WHITE
    this.performanceBackgroundColor = ALMOST_WHITE
    this.generalTextColor = ALMOST_BLACK
    this.graphicsTextColor = ALMOST_BLACK
    this.audioTextColor = ALMOST_BLACK
    this.gameplayTextColor = ALMOST_BLACK
    this.performanceTextColor = ALMOST_BLACK
    this.restoreTextColor = Color4.Red()
    this.restoreBackgroundColor = ALMOST_WHITE

    switch (this.buttonClicked) {
      case 'general':
        this.generalEnter()
        this.backgroundIcon = 'assets/images/menu/GeneralImg.png'
        break
      case 'audio':
        this.audioEnter()
        this.backgroundIcon = 'assets/images/menu/SoundImg.png'
        break
      case 'graphics':
        this.graphicsEnter()
        this.backgroundIcon = 'assets/images/menu/GraphicsImg.png'
        break
      case 'gameplay':
        this.gameplayEnter()
        this.backgroundIcon = 'assets/images/menu/GeneralImg.png'
        break
      case 'performance':
        this.performanceEnter()
        this.backgroundIcon = 'assets/images/menu/GeneralImg.png'
        break
    }

    this.toggleIcon.spriteName = this.toggleStatus ? 'SwitchOn' : 'SwitchOff'
  }

  selectOption(index: number): void {
    console.log(index)
  }

  controllerSystem(): void {
    // for (const [, pos, uiTransform] of engine.getEntitiesWith(
    //   UiScrollResult,
    //   UiTransform
    // )) {
    //   if (pos === undefined) break
    //   if (uiTransform.elementId === this.slider1Id && pos.value !== undefined) {
    //     this.slider1Value = 100 - Math.round(100 * pos.value.x)
    //     this.slider1Pos = pos.value.x
    //   }
    //   if (uiTransform.elementId === this.slider2Id && pos.value !== undefined) {
    //     this.slider2Value = 100 - Math.round(100 * pos.value.x)
    //     this.slider2Pos = pos.value.x
    //   }
    //   if (uiTransform.elementId === this.slider3Id && pos.value !== undefined) {
    //     this.slider3Value = 100 - Math.round(100 * pos.value.x)
    //     this.slider3Pos = pos.value.x
    //   }
    //   if (uiTransform.elementId === this.slider4Id && pos.value !== undefined) {
    //     this.slider4Value = 100 - Math.round(100 * pos.value.x)
    //     this.slider4Pos = pos.value.x
    //   }
    //   if (uiTransform.elementId === this.slider5Id && pos.value !== undefined) {
    //     this.slider5Value = 100 - Math.round(100 * pos.value.x)
    //     this.slider5Pos = pos.value.x
    //   }
    //   if (uiTransform.elementId === this.slider6Id && pos.value !== undefined) {
    //     this.slider6Value = 100 - Math.round(100 * pos.value.x)
    //     this.slider6Pos = pos.value.x
    //   }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    if (this.uiController.settings === undefined) return null

    const sliderWidth: number = canvasInfo.width * 0.3
    const sliderHeight: number = canvasInfo.height * 0.1
    const fontSize: number = canvasInfo.height * 0.02

    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          // positionType: 'absolute',
          // position:{top: 0, left: 0, right: 0, bottom: 0},
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/menu/Background.png' }
        }}
      >
        {/* Icon Background */}
        <UiEntity
          uiTransform={{
            width: canvasInfo.height * 0.65,
            height: canvasInfo.height * 0.65,
            positionType: 'absolute',
            position: { left: '0', bottom: '0' }
          }}
          uiBackground={{
            color: { ...Color4.White(), a: 0.3 },
            textureMode: 'stretch',
            texture: { src: this.backgroundIcon }
          }}
        />

        {/* NavBar */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '10%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: { left: '10%' }
          }}
          uiBackground={{
            color: { ...Color4.Black(), a: 0.7 }
          }}
        >
          <UiEntity
            uiTransform={{
              width: 'auto',
              height: 'auto',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <UiEntity
              uiTransform={{
                width: 'auto',
                height: 16
              }}
              uiText={{
                value: 'Settings',
                textAlign: 'middle-left',
                fontSize: 30
              }}
            />

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.performanceTextColor}
              icon={{ atlasName: 'icons', spriteName: 'Filter' }}
              value={'Performance'}
              fontSize={fontSize}
              fontColor={this.performanceTextColor}
              onMouseEnter={() => {
                this.performanceEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('performance')
              }}
              backgroundColor={this.performanceBackgroundColor}
            />
            {/* <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.generalTextColor}
              icon={{ atlasName: 'navbar', spriteName: 'Settings off' }}
              value={'General'}
              fontSize={fontSize}
              fontColor={this.generalTextColor}
              onMouseEnter={() => {
                this.generalEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('general')
              }}
              backgroundColor={this.generalBackgroundColor}
            /> */}

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.graphicsTextColor}
              icon={{ atlasName: 'icons', spriteName: 'Graphics' }}
              value={'Graphics'}
              fontSize={fontSize}
              fontColor={this.graphicsTextColor}
              onMouseEnter={() => {
                this.graphicsEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('graphics')
              }}
              backgroundColor={this.graphicsBackgroundColor}
            />

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.audioTextColor}
              icon={{ atlasName: 'context', spriteName: 'SpeakerOn' }}
              value={'Audio'}
              fontSize={fontSize}
              fontColor={this.audioTextColor}
              onMouseEnter={() => {
                this.audioEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('audio')
              }}
              backgroundColor={this.audioBackgroundColor}
            />

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.gameplayTextColor}
              icon={{ atlasName: 'icons', spriteName: 'ControlsIcn' }}
              value={'Gameplay'}
              fontSize={fontSize}
              fontColor={this.gameplayTextColor}
              onMouseEnter={() => {
                this.gameplayEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('gameplay')
              }}
              backgroundColor={this.gameplayBackgroundColor}
            />
          </UiEntity>

          <UiEntity
            uiTransform={{
              width: 'auto',
              height: 'auto'
            }}
          >
            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.restoreTextColor}
              icon={{ atlasName: 'icons', spriteName: 'RotateIcn' }}
              value={'RESET TO DEFAULT'}
              fontSize={fontSize}
              fontColor={this.restoreTextColor}
              onMouseEnter={() => {
                this.restoreEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                console.log('Restored default values')
              }}
              backgroundColor={this.restoreBackgroundColor}
            />
          </UiEntity>
        </UiEntity>

        {/* Content */}
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            margin: canvasInfo.height * 0.05,
            flexGrow: 1
          }}
          uiBackground={{
            textureMode: 'nine-slices',
            texture: {
              src: 'assets/images/backgrounds/rounded.png'
            },
            textureSlices: {
              top: 0.25,
              bottom: 0.25,
              left: 0.25,
              right: 0.25
            },
            color: { ...Color4.Black(), a: 0.7 }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '45%',
              height: canvasInfo.height * 0.7,
              flexDirection: 'column',
              alignItems: 'flex-start',
              overflow: 'scroll',
              scrollVisible: 'vertical'
            }}
            uiBackground={
              {
                // color: { ...Color4.Blue(), a: 0.1 }
              }
            }
          >
            <Dropdown
        options={[`Red`, `Blue`, `Green`]}
        onChange={this.selectOption}
        uiTransform={{
          width: '100px',
          height: '40px',
        }}
      />
            {this.uiController.settings
              .filter((setting) => {
                  return setting.category.toLowerCase() === this.buttonClicked
              })
              .map((setting, index) => {
                const namedVariants = setting.namedVariants ?? []
                if (namedVariants.length > 0) {
                  return (
                    <UiEntity
                    uiTransform={{
                      width: sliderWidth,
                      height: sliderHeight,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={() => {
                      // this.settingsInfoTitle = setting.name
                      this.settingsInfoDescription = setting.description
                      
                    }}
                  >
                    <Label value={setting.name} fontSize={fontSize} />
                    <Dropdown
                      key={index}
                      uiTransform={{ width: '40%' }}
                      // options={setting.namedVariants.map((variant) => variant.name)}
                      options={['asd', 'qwe', 'zxc']}
                      
                      color={ALMOST_WHITE}
                      font="sans-serif"
                      fontSize={fontSize}
                      selectedIndex={setting.value}
                      onChange={ this.selectOption
                        // (index) =>
                        // {BevyApi.setSetting(setting.name, setting.namedVariants.map((variant) => variant.name)[index]).catch(console.error)
                        // this.settingsSelectedDescription = setting.namedVariants[index].description
                        // }
                      }
                    />
                    </UiEntity>
                  )
                } else {
                return (
                  <Slider
                    title={setting.name}
                    fontSize={fontSize}
                    value={setting.value.toString()}
                    uiTransform={{ width: sliderWidth, height: sliderHeight }}
                    sliderSize={sliderWidth * 2}
                    id={setting.name}
                    position={
                      1 - setting.value / (setting.maxValue - setting.minValue)
                    }
                    onMouseEnter={() => {
                      // this.settingsInfoTitle = setting.name
                      this.settingsInfoDescription = setting.description
                      this.settingsSelectedDescription = ''
                    }}
                  />
                )}
              }
              )}
          </UiEntity>

          <UiEntity
            uiTransform={{
              width: '40%',
              height: canvasInfo.height * 0.7,
              flexDirection: 'column',
              alignItems: 'flex-start',
              margin: { left: '5%' }
              // overflow: 'scroll',
              // scrollVisible: 'hidden',
            }}
            uiBackground={
              {
                // color: { ...Color4.Red(), a: 0.1 }
              }
            }
          >
            <UiEntity
              uiTransform={{
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
              // uiBackground={{ color: Color4.Black() }}
            >
              <Label value={'Settings Info:'} fontSize={fontSize * 1.5} />
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: 1,
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
                uiBackground={{ color: ALMOST_WHITE }}
              />
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: '50%',
                  // height: 300,
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <Label
                  uiTransform={{ width: '100%', height: '100%' }}
                  value={this.settingsInfoDescription}
                  fontSize={fontSize}
                  textWrap="wrap"
                  textAlign="top-left"
                />
                <Label
                  uiTransform={{ width: '100%', height: '100%' }}
                  value={this.settingsSelectedDescription}
                  fontSize={fontSize}
                  textWrap="wrap"
                  textAlign="top-left"
                />
              </UiEntity>
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
