import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import ButtonText from '../../components/button-text/ButtonText'
import { type UIController } from '../../controllers/ui.controller'
import { ROUNDED_TEXTURE_BACKGROUND, RUBY } from '../../utils/constants'
import { isValidURL } from '../../utils/ui-utils'

export default class AddLink {
  public fontSize: number = 16
  public url: string = ''
  public name: string = ''
  private readonly uiController: UIController
  private saveButtonColor: Color4 = RUBY
  private cancelButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  updateSaveButton(): void {
    if (this.name.length >= 1 && isValidURL(this.url)) {
      this.saveButtonColor = RUBY
    } else {
      this.saveButtonColor = Color4.Gray()
    }
  }

  show(): void {
    this.uiController.profile.addLinkOpen = true
    this.url = ''
    this.name = ''
    this.updateSaveButton()
  }

  hide(): void {
    this.uiController.profile.addLinkOpen = false
    this.url = ''
    this.name = ''
  }

  onSaveEnter(): void {
    if (this.name.length >= 1 && isValidURL(this.url)) {
      this.saveButtonColor = {
        ...RUBY,
        g: 0.5,
        b: 0.5
      }
    }
  }

  save(): void {
    console.log(this.url)
    console.log(this.name.length)
    if (this.name.length >= 1 && isValidURL(this.url)) {
      this.uiController.profile.linksToShow.push({
        name: this.name,
        url: this.url
      })
      this.hide()
    }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          display: this.uiController.profile.addLinkOpen ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          positionType: 'absolute',
          position: { top: 0, left: 0 },
          width: canvasInfo.width,
          height: canvasInfo.height,
          pointerFilter: 'block'
        }}
        uiBackground={{
          color: { ...Color4.Black(), a: 0.2 }
        }}
        onMouseDown={() => {
          this.hide()
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            padding: 25,
            width: 400,
            height: 300,
            pointerFilter: 'block'
          }}
          onMouseDown={() => {}}
          uiBackground={{
            ...ROUNDED_TEXTURE_BACKGROUND,
            color: Color4.Purple()
          }}
        >
          <Label
            value="Add Link"
            uiTransform={{
              width: '80%',
              height: this.fontSize * 1.5
            }}
            textAlign="middle-left"
            fontSize={this.fontSize * 1.2}
          />
          <Input
            uiTransform={{
              padding: this.fontSize * 0.5,
              width: '80%',
              height: this.fontSize * 2,
              alignContent: 'center'
            }}
            fontSize={this.fontSize}
            uiBackground={ROUNDED_TEXTURE_BACKGROUND}
            onChange={($) => {
              this.name = $
              this.updateSaveButton()
            }}
            placeholder="Enter Link Title"
          />
          <Input
            uiTransform={{
              padding: this.fontSize * 0.5,
              width: '80%',
              height: this.fontSize * 2,
              alignContent: 'center'
            }}
            fontSize={this.fontSize}
            onChange={($) => {
              this.url = $
              this.updateSaveButton()
            }}
            uiBackground={ROUNDED_TEXTURE_BACKGROUND}
            placeholder="Enter URL"
          />
          <UiEntity
            uiTransform={{
              width: '80%',
              height: 2 * this.fontSize,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: { top: this.fontSize }
            }}
          >
            <ButtonText
              onMouseEnter={() => {
                this.cancelButtonColor = {
                  ...Color4.Black(),
                  a: 0.7
                }
              }}
              onMouseLeave={() => {
                this.cancelButtonColor = {
                  ...Color4.Black(),
                  a: 0.35
                }
              }}
              onMouseDown={() => {
                this.hide()
              }}
              uiTransform={{
                width: '45%',
                height: 2 * this.fontSize
              }}
              backgroundColor={this.cancelButtonColor}
              value={'CANCEL'}
              fontSize={this.fontSize}
            />
            <ButtonText
              onMouseEnter={() => {
                this.onSaveEnter()
              }}
              onMouseLeave={() => {
                this.updateSaveButton()
              }}
              onMouseDown={() => {
                this.save()
              }}
              uiTransform={{
                width: '45%',
                height: 2 * this.fontSize
              }}
              backgroundColor={this.saveButtonColor}
              value={'SAVE'}
              fontSize={this.fontSize}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
