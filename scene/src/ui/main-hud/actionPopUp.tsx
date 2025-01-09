import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type Callback, Label, UiEntity } from '@dcl/sdk/react-ecs'
import IconButton from '../../components/button-icon/ButtonIcon'
import TextButton from '../../components/button-text/ButtonText'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  LEFT_PANEL_MIN_WIDTH,
  LEFT_PANEL_WIDTH_FACTOR,
  RUBY
} from '../../utils/constants'
import Canvas from '../canvas/canvas'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'

export class ActionPopUp {
  private readonly uiController: UIController
  public fontSize: number = 14
  public tittle: string | undefined
  public message: string | undefined
  public action: Callback | undefined
  public actionText: string | undefined
  public cancel: Callback | undefined
  public cancelText: string | undefined

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
    if (this.cancel !== undefined) {
      this.cancel()
      console.log('WARNING POP UP CANCEL ACTION PRESSED')
    }
    this.undefineButtons()
    this.hide()
  }

  confirmEnter(): void {
    this.confirmBackground = { ...RUBY, a: 0.8 }
  }

  confirmAction(): void {
    if (this.action !== undefined) {
      this.action()
    }
    this.hide()
  }

  undefineButtons(): void {
    this.action = undefined
    this.cancel = undefined
    this.actionText = undefined
    this.cancelText = undefined
    this.updateButtons()
  }

  updateButtons(): void {
    this.confirmBackground = RUBY
    this.cancelBackground = Color4.Black()
    this.closeBackground = undefined
  }

  close(): void {
    this.hide()
    this.updateButtons()
  }

  show(): void {
    this.uiController.actionPopUpVisible = true
  }

  hide(): void {
    this.uiController.actionPopUpVisible = false
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
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
            justifyContent: 'center',
            zIndex: 1
          }}
          uiBackground={{
            color: { ...Color4.Black(), a: 0.9 }
          }}
          onMouseDown={() => {
            this.close()
          }}
        >
          <UiEntity
            uiTransform={{
              padding: {
                top: panelHeight * 0.05,
                bottom: panelHeight * 0.1
              },

              width: panelWidth,
              height: 'auto',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between'
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
            {/* ERROR AREA */}
            <UiEntity
              uiTransform={{
                flexDirection: 'column',

                width: panelWidth * 0.8,
                height: panelHeight * 0.4,
                flexGrow: 1
              }}
            >
              <UiEntity
                uiTransform={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  margin: { bottom: this.fontSize * 0.5 }
                }}
              >
                {/* ICON */}
                <UiEntity
                  uiBackground={{
                    ...getBackgroundFromAtlas({
                      atlasName: 'navbar',
                      spriteName: 'HelpIcon Off'
                    }),
                    color: ALMOST_BLACK
                  }}
                  uiTransform={{
                    height: 2 * this.fontSize,
                    width: 2 * this.fontSize
                  }}
                />

                {/* TITTLE */}
                <Label
                  uiTransform={{
                    width: '50%',
                    flexGrow: 1
                  }}
                  value={this.tittle ?? ''}
                  color={Color4.Black()}
                  fontSize={this.fontSize * 1.2}
                  textAlign="middle-left"
                />

                {/* CLOSE BUTTON */}
                <IconButton
                  uiTransform={{
                    height: 2 * this.fontSize,
                    width: 2 * this.fontSize
                  }}
                  onMouseEnter={() => {
                    this.closeBackground = { ...ALMOST_BLACK, a: 0.8 }
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
                  iconColor={ALMOST_BLACK}
                />
              </UiEntity>

              {/* SCROLLEABLE AREA */}
              <UiEntity
                uiTransform={{
                  flexDirection: 'column',
                  width: '100%',
                  height: 'auto',
                  maxHeight: panelHeight * 0.4,
                  flexGrow: 1,
                  overflow: 'scroll'
                }}
              >
                {/* MESSAGE */}
                <Label
                  uiTransform={{
                    padding: {
                      right: this.fontSize,
                      left: this.fontSize * 0.5
                    },
                    flexGrow: 1,
                    minHeight: this.fontSize * 4
                  }}
                  value={this.message}
                  color={ALMOST_BLACK}
                  fontSize={this.fontSize}
                  textAlign="middle-left"
                />
              </UiEntity>
            </UiEntity>

            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                width: panelWidth * 0.8,
                justifyContent: 'space-between'
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
                value={this.cancelText ?? 'CANCEL'}
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
                value={this.actionText ?? 'CONFIRM'}
                fontSize={this.fontSize * 0.8}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}
