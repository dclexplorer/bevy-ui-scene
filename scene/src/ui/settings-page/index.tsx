import { Color4 } from '@dcl/ecs-math'
import {
  UiCanvasInformation,
  UiScrollResult,
  UiTransform,
  engine
} from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { ALMOST_BLACK, ALMOST_WHITE, ORANGE } from '../../utils/constants'
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
    this.slider2SavedPos = this.slider2Pos
    this.slider3SavedPos = this.slider3Pos
    this.slider4SavedPos = this.slider4Pos
    this.slider5SavedPos = this.slider5Pos
    this.slider6SavedPos = this.slider6Pos
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

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
      />
    )
  }
}
