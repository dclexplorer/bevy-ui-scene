import { Color4 } from '@dcl/ecs-math'
import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import TextIconButton from '../../components/textIconButton'
import { ALMOST_BLACK, ALMOST_WHITE, ORANGE } from '../../utils/constants'

export class SettingsPage {
  private generalTextColor: Color4 = ALMOST_BLACK
  private graphicsTextColor: Color4 = ALMOST_BLACK
  private audioTextColor: Color4 = ALMOST_BLACK
  private controlsTextColor: Color4 = ALMOST_BLACK
  private generalBackgroundColor: Color4 = ALMOST_WHITE
  private graphicsBackgroundColor: Color4 = ALMOST_WHITE
  private audioBackgroundColor: Color4 = ALMOST_WHITE
  private controlsBackgroundColor: Color4 = ALMOST_WHITE
  private pathText: string = ''
  private buttonClicked: 'general'|'audio'|'graphics'|'controls' = 'general'

  setButtonClicked(button: 'general'|'audio'|'graphics'|'controls'):void{
    this.buttonClicked = button
    this.pathText = 'Settings/'+button
  }

  updateButtons() {
    this.generalBackgroundColor = ALMOST_WHITE
    this.graphicsBackgroundColor = ALMOST_WHITE
    this.audioBackgroundColor = ALMOST_WHITE
    this.controlsBackgroundColor = ALMOST_WHITE
    this.generalTextColor = ALMOST_BLACK
    this.graphicsTextColor = ALMOST_BLACK
    this.audioTextColor = ALMOST_BLACK
    this.controlsTextColor = ALMOST_BLACK

    switch (this.buttonClicked) {
      case 'general':
        this.generalBackgroundColor = ORANGE
        this.generalTextColor = ALMOST_WHITE
        break
      case 'audio':
        this.audioBackgroundColor = ORANGE
        this.audioTextColor = ALMOST_WHITE
        break
      case 'graphics':
        this.graphicsBackgroundColor = ORANGE
        this.graphicsTextColor = ALMOST_WHITE
        break
      case 'controls':
        this.controlsBackgroundColor = ORANGE
        this.controlsTextColor = ALMOST_WHITE
        break
    }
  }



  mainUi(): ReactEcs.JSX.Element | null {
    this.updateButtons()
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
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: { left: '10%' }
          }}
          uiBackground={{ color: { ...Color4.Black(), a: 0.7 } }}
        >
          <UiEntity
            uiTransform={{
              width: 'auto',
              height: 'auto'
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
              padding:{left:10, right:10},
              width: 'auto'
            }}
            iconColor={this.generalTextColor}
            iconSrc={'assets/images/navbar/Settings off.png'}
            value={'General'}
            fontSize={16}
            fontColor={this.generalTextColor}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onMouseDown={() => {this.setButtonClicked('general')}}
            backgroundColor={this.generalBackgroundColor}
          />

          <TextIconButton
            uiTransform={{
              margin: { left: 10, right: 10 },
              padding:{left:10, right:10},
              width: 'auto'
            }}
            iconColor={this.graphicsTextColor}
            iconSrc={'assets/images/icons/Graphics.png'}
            value={'Graphics'}
            fontSize={16}
            fontColor={this.graphicsTextColor}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onMouseDown={() => {this.setButtonClicked('graphics')}}
            backgroundColor={this.graphicsBackgroundColor}
          />
          <TextIconButton
            uiTransform={{
              margin: { left: 10, right: 10 },
              padding:{left:10, right:10},
              width: 'auto'
            }}
            iconColor={this.audioTextColor}
            iconSrc={'assets/images/context/SpeakerOn.png'}
            value={'Audio'}
            fontSize={16}
            fontColor={this.audioTextColor}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onMouseDown={() => {this.setButtonClicked('audio')}}
            backgroundColor={this.audioBackgroundColor}
          />

          <TextIconButton
            uiTransform={{
              margin: { left: 10, right: 10 },
              padding:{left:10, right:10},
              width: 'auto'
            }}
            iconColor={this.controlsTextColor}
            iconSrc={'assets/images/builder/ControlsIcn.png'}
            value={'Controls'}
            fontSize={16}
            fontColor={this.controlsTextColor}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
            onMouseDown={() => {this.setButtonClicked('controls')}}
            backgroundColor={this.controlsBackgroundColor}
          />
        </UiEntity>
      </UiEntity>
    )
  }
}
