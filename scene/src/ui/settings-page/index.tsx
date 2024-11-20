import { Color4 } from '@dcl/ecs-math'
import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, UiScrollResult, UiTransform, engine } from '@dcl/sdk/ecs'
import TextIconButton from '../../components/textIconButton'
import { ALMOST_BLACK, ALMOST_WHITE, ORANGE } from '../../utils/constants'
import Slider from '../../components/slider'

export class SettingsPage {
  private readonly slider1Id:string = 'rendering-scale'
  private slider1Value:number = 50
  private slider1Pos:number = 0
  private readonly slider2Id:string = 'anti-aliasing'
  private slider2Value:number = 50
  private slider2Pos:number = 0


  private backgroundIcon: string = 'assets/images/menu/GeneralImg.png'
  private generalTextColor: Color4 = ALMOST_WHITE
  private graphicsTextColor: Color4 = ALMOST_BLACK
  private audioTextColor: Color4 = ALMOST_BLACK
  private controlsTextColor: Color4 = ALMOST_BLACK
  private restoreTextColor: Color4 = Color4.Red()
  private generalBackgroundColor: Color4 = ORANGE
  private graphicsBackgroundColor: Color4 = ALMOST_WHITE
  private audioBackgroundColor: Color4 = ALMOST_WHITE
  private controlsBackgroundColor: Color4 = ALMOST_WHITE
  private restoreBackgroundColor: Color4 = ALMOST_WHITE
  private buttonClicked: 'general' | 'audio' | 'graphics' | 'controls' =
    'general'

    constructor() {
      engine.addSystem(this.controllerSystem.bind(this))
    }

  setButtonClicked(
    button: 'general' | 'audio' | 'graphics' | 'controls'
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

  controlsEnter(): void {
    this.controlsBackgroundColor = ORANGE
    this.controlsTextColor = ALMOST_WHITE
  }

  restoreEnter(): void {
    this.restoreBackgroundColor = Color4.Red()
    this.restoreTextColor = ALMOST_WHITE
  }

  updateButtons(): void {
    
    this.generalBackgroundColor = ALMOST_WHITE
    this.graphicsBackgroundColor = ALMOST_WHITE
    this.audioBackgroundColor = ALMOST_WHITE
    this.controlsBackgroundColor = ALMOST_WHITE
    this.generalTextColor = ALMOST_BLACK
    this.graphicsTextColor = ALMOST_BLACK
    this.audioTextColor = ALMOST_BLACK
    this.controlsTextColor = ALMOST_BLACK
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
      case 'controls':
        this.controlsEnter()
        this.backgroundIcon = 'assets/images/menu/GeneralImg.png'
        break
    }
  }

  controllerSystem(): void {
  	for (const [, pos, uiTransform] of engine.getEntitiesWith(
  		UiScrollResult,
  		UiTransform
  	)) {
  		if (uiTransform.elementId !== this.slider1Id) {
  			continue
  		}

  		if (pos.value === undefined) {
  			break
  		}

      this.slider1Value = 100 -  Math.floor(100 *pos.value.x)
    }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const sliderWidth:number = 200

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
          uiBackground={{ color: { ...Color4.Black(), a: 0.7 } }}
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
              iconColor={this.generalTextColor}
              icon={{ atlasName: 'navbar', spriteName: 'Settings off' }}
              value={'General'}
              fontSize={16}
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
            />

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.graphicsTextColor}
              icon={{ atlasName: 'icons', spriteName: 'Graphics' }}
              value={'Graphics'}
              fontSize={16}
              fontColor={this.graphicsTextColor}
              onMouseEnter={() => {
                this.graphicsEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('graphics')
                this.slider1Pos = 0.5

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
              fontSize={16}
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
              iconColor={this.controlsTextColor}
              icon={{ atlasName: 'icons', spriteName: 'ControlsIcn' }}
              value={'Controls'}
              fontSize={16}
              fontColor={this.controlsTextColor}
              onMouseEnter={() => {
                this.controlsEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('controls')
              }}
              backgroundColor={this.controlsBackgroundColor}
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
              fontSize={16}
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            margin: 60,
            // height:'80%',
            flexGrow: 1
          }}
          uiBackground={{
            color: { ...Color4.Black(), a: 0.7 }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '80%',
              height: '80%',
              flexDirection: 'column'
            }}
            uiBackground={{
              // color: { ...Color4.Red(), a: 1 }
            }}
          >
            <Slider title={'Rendering Scale'} fontSize={16} value={this.slider1Value.toString()+'%'} uiTransform={{width:sliderWidth, height:100}} sliderSize={sliderWidth*2} id={this.slider1Id} position={this.slider1Pos} />
            <Slider title={'Rendering Scale'} fontSize={16} value={this.slider1Value.toString()+'%'} uiTransform={{width:sliderWidth, height:100}} sliderSize={sliderWidth*2} id={this.slider2Id} position={this.slider1Pos} />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
