import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type Callback, Label, UiEntity } from '@dcl/sdk/react-ecs'
import IconButton from '../../components/iconButton'
import TextButton from '../../components/textButton'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  LEFT_PANEL_MIN_WIDTH,
  LEFT_PANEL_WIDTH_FACTOR,
  RUBY
} from '../../utils/constants'
import Canvas from '../canvas/canvas'

export class ActionPopUp {
  private readonly uiController: UIController
  public fontSize: number = 14
  public message: string | undefined
  public action: Callback | undefined

  closeBackground: Color4 | undefined
  confirmBackground: Color4 = RUBY
  cancelBackground: Color4 = Color4.Black()

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  cancelEnter(): void {
    this.cancelBackground = { ...Color4.Black(), a: 0.8 }
  }

  cancelAction(): void {
    this.updateButtons()
    this.action = undefined
  }

  confirmEnter(): void {
    this.confirmBackground = { ...RUBY, a: 0.8 }
  }

  confirmAction(): void {
    if (this.action !== undefined) {
      this.action()
    }
    this.updateButtons()
    this.action = undefined
  }

  updateButtons(): void {
    this.confirmBackground = RUBY
    this.cancelBackground = Color4.Black()
    this.closeBackground = undefined
  }

  close(): void {
    this.uiController.actionPopUpVisible = false
    this.updateButtons()
    this.action = undefined
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    if (this.action === undefined) return null
    if (this.message === undefined) return null

    let panelWidth: number

    if (canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR < LEFT_PANEL_MIN_WIDTH) {
      panelWidth = LEFT_PANEL_MIN_WIDTH
    } else {
      panelWidth = canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR
    }

    let panelHeight: number

    if (canvasInfo.height * 0.2 < 250) {
      panelHeight = 250
    } else {
      panelHeight = canvasInfo.height * 0.2
    }

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          uiBackground={{
            color: { ...Color4.Black(), a: 0.9 }
          }}
        >
          <UiEntity
            uiTransform={{
              padding: {
                top: panelHeight * 0.05,
                bottom: panelHeight * 0.05,
                left: panelWidth * 0.1,
                right: panelWidth * 0.1
              },

              width: panelWidth,
              height: 'auto',
              maxHeight: panelHeight,
              flexDirection: 'column',
              alignItems: 'center'
            }}
            uiBackground={{
              color: { ...ALMOST_WHITE, a: 0.9 },
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
            {/* CLOSE BUTTON */}
            <UiEntity
              uiTransform={{
                width: '100%',
                height: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <IconButton
                uiTransform={{
                  height: 2 * this.fontSize,
                  width: 2 * this.fontSize
                }}
                onMouseEnter={() => {
                  this.closeBackground = ALMOST_BLACK
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.close()
                  this.updateButtons()
                }}
                backgroundColor={this.closeBackground}
                icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                width: panelWidth * 0.8,
                height: 'auto',
                maxHeight: '50%',
                overflow: 'scroll'
              }}
            >
              <Label
                uiTransform={{
                  padding: {
                    right: this.fontSize,
                    left: this.fontSize * 0.5,
                    top: this.fontSize * 0.5,
                    bottom: this.fontSize * 0.5
                  }
                }}
                value={this.message}
                color={ALMOST_BLACK}
                fontSize={this.fontSize}
                textAlign="middle-left"
              />
            </UiEntity>
            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                width: panelWidth * 0.8,
                justifyContent: 'space-between',
                flexGrow: 1
              }}
            >
              <TextButton
                uiTransform={{
                  width: '47.5%',
                  height: 'auto'
                }}
                onMouseDown={() => {
                  this.cancelAction()
                }}
                onMouseEnter={() => {
                  this.cancelEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                backgroundColor={this.cancelBackground}
                value={'CANCEL'}
                fontSize={this.fontSize * 0.8}
              />
              <TextButton
                uiTransform={{
                  width: '47.5%',
                  height: 'auto'
                }}
                onMouseDown={() => {
                  this.confirmAction()
                }}
                onMouseEnter={() => {
                  this.confirmEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                backgroundColor={this.confirmBackground}
                value={'CONFIRM'}
                fontSize={this.fontSize * 0.8}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}
