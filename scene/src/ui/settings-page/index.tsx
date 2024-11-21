import { Color4 } from '@dcl/ecs-math'
import ReactEcs, { Dropdown, Label, UiEntity } from '@dcl/sdk/react-ecs'
import {
  UiCanvasInformation,
  UiScrollResult,
  UiTransform,
  engine
} from '@dcl/sdk/ecs'
import TextIconButton from '../../components/textIconButton'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  DESPAWN_WORKAROUND_DESCRIPTION,
  DESPAWN_WORKAROUND_TITLE,
  MAX_AVATARS_DESCRIPTION,
  MAX_AVATARS_TITLE,
  MAX_DOWNLOADS_DESCRIPTION,
  MAX_DOWNLOADS_TITLE,
  MAX_VIDEOS_DESCRIPTION,
  MAX_VIDEOS_TITLE,
  ORANGE,
  SCENE_LOAD_DISTANCE_DESCRIPTION,
  SCENE_LOAD_DISTANCE_TITLE,
  SCENE_THREADS_DESCRIPTION,
  SCENE_THREADS_TITLE,
  SCENE_UNLOAD_DISTANCE_DESCRIPTION,
  SCENE_UNLOAD_DISTANCE_TITLE,
  TARGET_FRAME_RATE_DESCRIPTION,
  TARGET_FRAME_RATE_TITLE
} from '../../utils/constants'
import Slider from '../../components/slider'
import IconButton from '../../components/iconButton'
import { type Icon } from '../../utils/definitions'

export class SettingsPage {
  private readonly slider1Id: string = 'scene-load-distance'
  private slider1Value: number = 50
  private slider1Pos: number = 0
  private slider1SavedPos: number = 0.1
  private readonly slider2Id: string = 'scene-unload-distance'
  private slider2Value: number = 50
  private slider2Pos: number = 0
  private slider2SavedPos: number = 0.1
  private readonly slider3Id: string = 'scene-threads'
  private slider3Value: number = 50
  private slider3Pos: number = 0
  private slider3SavedPos: number = 0.1
  private readonly slider4Id: string = 'max-av-downloads'
  private slider4Value: number = 50
  private slider4Pos: number = 0
  private slider4SavedPos: number = 0.1
  private readonly slider5Id: string = 'max-avatars'
  private slider5Value: number = 50
  private slider5Pos: number = 0
  private slider5SavedPos: number = 0.1
  private readonly slider6Id: string = 'max-downloads'
  private slider6Pos: number = 0
  private slider6Value: number = 50
  private slider6SavedPos: number = 0.1


  private readonly toggleIcon: Icon = {
    atlasName: 'toggles',
    spriteName: 'SwitchOn'
  }

  private toggleStatus: boolean = false

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

  private settingsInfoTitle: string = ''
  private settingsInfoDescription: string = ''

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

    this.toggleIcon.spriteName = this.toggleStatus ? 'SwitchOn' : 'SwitchOff'
  }

  controllerSystem(): void {
    for (const [, pos, uiTransform] of engine.getEntitiesWith(
      UiScrollResult,
      UiTransform
    )) {
      if (pos === undefined) break
      if (uiTransform.elementId === this.slider1Id && pos.value !== undefined) {
        this.slider1Value = 100 - Math.round(100 * pos.value.x)
        this.slider1Pos = pos.value.x
      }
      if (uiTransform.elementId === this.slider2Id && pos.value !== undefined) {
        this.slider2Value = 100 - Math.round(100 * pos.value.x)
        this.slider2Pos = pos.value.x
      }
      if (uiTransform.elementId === this.slider3Id && pos.value !== undefined) {
        this.slider3Value = 100 - Math.round(100 * pos.value.x)
        this.slider3Pos = pos.value.x
      }
      if (uiTransform.elementId === this.slider4Id && pos.value !== undefined) {
        this.slider4Value = 100 - Math.round(100 * pos.value.x)
        this.slider4Pos = pos.value.x
      }
      if (uiTransform.elementId === this.slider5Id && pos.value !== undefined) {
        this.slider5Value = 100 - Math.round(100 * pos.value.x)
        this.slider5Pos = pos.value.x
      }
      if (uiTransform.elementId === this.slider6Id && pos.value !== undefined) {
        this.slider6Value = 100 - Math.round(100 * pos.value.x)
        this.slider6Pos = pos.value.x
      }
    }
  }

  saveValues(): void {
    this.slider1SavedPos = this.slider1Pos
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

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
              iconColor={this.controlsTextColor}
              icon={{ atlasName: 'icons', spriteName: 'ControlsIcn' }}
              value={'Controls'}
              fontSize={fontSize}
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
              src: 'assets/images/buttonBackground100.png'
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
            uiBackground={{
              // color: { ...Color4.Blue(), a: 0.1 }
            }}
          >
            <Slider
              title={SCENE_LOAD_DISTANCE_TITLE}
              fontSize={fontSize}
              value={this.slider1Value.toString() + '%'}
              uiTransform={{ width: sliderWidth, height: sliderHeight }}
              sliderSize={sliderWidth * 2}
              id={this.slider1Id}
              position={1 - this.slider1SavedPos}
              onMouseEnter={() => {
                this.settingsInfoTitle = SCENE_LOAD_DISTANCE_TITLE
                this.settingsInfoDescription = SCENE_LOAD_DISTANCE_DESCRIPTION
              }}
            />
            <Slider
              title={SCENE_UNLOAD_DISTANCE_TITLE}
              fontSize={fontSize}
              value={this.slider2Value.toString() + '%'}
              uiTransform={{ width: sliderWidth, height: sliderHeight }}
              sliderSize={sliderWidth * 2}
              id={this.slider2Id}
              position={1 - this.slider2SavedPos}
              onMouseEnter={() => {
                this.settingsInfoTitle = SCENE_UNLOAD_DISTANCE_TITLE
                this.settingsInfoDescription = SCENE_UNLOAD_DISTANCE_DESCRIPTION
              }}
            />
            <UiEntity
              uiTransform={{
                width: sliderWidth,
                height: sliderHeight,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={() => {
                this.settingsInfoTitle = TARGET_FRAME_RATE_TITLE
                this.settingsInfoDescription = TARGET_FRAME_RATE_DESCRIPTION
              }}
            >
              <Label value={TARGET_FRAME_RATE_TITLE} fontSize={fontSize} />
              <Dropdown
                uiTransform={{ width: '40%' }}
                options={[
                  '10',
                  '15',
                  '20',
                  '30',
                  '60',
                  '120',
                  '144',
                  'Uncapped'
                ]}
                color={ALMOST_WHITE}
                font="sans-serif"
                fontSize={fontSize}
                // selectedIndex={value}
                // onChange={(index) => value = index}
              />
            </UiEntity>

            <Slider
              title={SCENE_THREADS_TITLE}
              fontSize={fontSize}
              value={this.slider3Value.toString() + '%'}
              uiTransform={{ width: sliderWidth, height: sliderHeight }}
              sliderSize={sliderWidth * 2}
              id={this.slider3Id}
              position={1 - this.slider3SavedPos}
              onMouseEnter={() => {
                this.settingsInfoTitle = SCENE_THREADS_TITLE
                this.settingsInfoDescription = SCENE_THREADS_DESCRIPTION
              }}
            />
            <Slider
              title={MAX_VIDEOS_TITLE}
              fontSize={fontSize}
              value={this.slider4Value.toString() + '%'}
              uiTransform={{ width: sliderWidth, height: sliderHeight }}
              sliderSize={sliderWidth * 2}
              id={this.slider4Id}
              position={1 - this.slider4SavedPos}
              onMouseEnter={() => {
                this.settingsInfoTitle = MAX_VIDEOS_TITLE
                this.settingsInfoDescription = MAX_VIDEOS_DESCRIPTION
              }}
            />
            <Slider
              title={MAX_AVATARS_TITLE}
              fontSize={fontSize}
              value={this.slider5Value.toString() + '%'}
              uiTransform={{ width: sliderWidth, height: sliderHeight }}
              sliderSize={sliderWidth * 2}
              id={this.slider5Id}
              position={1 - this.slider5SavedPos}
              onMouseEnter={() => {
                this.settingsInfoTitle = MAX_AVATARS_TITLE
                this.settingsInfoDescription = MAX_AVATARS_DESCRIPTION
              }}
            />
            <Slider
              title={MAX_DOWNLOADS_TITLE}
              fontSize={fontSize}
              value={this.slider6Value.toString() + '%'}
              uiTransform={{ width: sliderWidth, height: sliderHeight }}
              sliderSize={sliderWidth * 2}
              id={this.slider6Id}
              position={1 - this.slider6SavedPos}
              onMouseEnter={() => {
                this.settingsInfoTitle = MAX_DOWNLOADS_TITLE
                this.settingsInfoDescription = MAX_DOWNLOADS_DESCRIPTION
              }}
            />
            <UiEntity
              uiTransform={{
                width: sliderWidth,
                height: sliderHeight,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={() => {
                this.settingsInfoTitle = DESPAWN_WORKAROUND_TITLE
                this.settingsInfoDescription = DESPAWN_WORKAROUND_DESCRIPTION
              }}
            >
              <Label value={DESPAWN_WORKAROUND_TITLE} fontSize={fontSize} />
              <IconButton
                onMouseDown={() => {
                  this.toggleStatus = !this.toggleStatus
                  this.updateButtons()
                }}
                uiTransform={{
                  width: sliderHeight / 3 / 0.55,
                  height: sliderHeight / 3
                }}
                icon={this.toggleIcon}
              />
            </UiEntity>
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '40%',
              height: canvasInfo.height * 0.7,
              flexDirection: 'column',
              alignItems: 'flex-start',
              margin:{left:'5%'}
              // overflow: 'scroll',
              // scrollVisible: 'hidden',
            }}
            uiBackground={{
              // color: { ...Color4.Red(), a: 0.1 }
            }}
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
              <Label value={this.settingsInfoTitle} fontSize={fontSize} />
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
              </UiEntity>
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
