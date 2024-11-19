import { Color4 } from '@dcl/ecs-math'
import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import TextIconButton from '../../components/textIconButton'
import { ALMOST_BLACK, ALMOST_WHITE, ORANGE } from '../../utils/constants'

export class SettingsPage {
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
  private pathText: string = 'Settings/general'
  private buttonClicked: 'general' | 'audio' | 'graphics' | 'controls' =
    'general'

  setButtonClicked(
    button: 'general' | 'audio' | 'graphics' | 'controls'
  ): void {
    this.buttonClicked = button
    this.pathText = 'Settings/' + button
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
        break
      case 'audio':
        this.audioEnter()
        break
      case 'graphics':
        this.graphicsEnter()
        break
      case 'controls':
        this.controlsEnter()
        break
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
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
        uiText={{
          value: this.pathText,
          textAlign: 'middle-center',
          fontSize: 50
        }}
      >
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '8%',
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
            alignItems: 'center',
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
      </UiEntity>
    )
  }
}
