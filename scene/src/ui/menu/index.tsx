import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import IconButton from '../../components/iconButton'
import TextIconButton from '../../components/textIconButton'
import { type UIController } from '../../controllers/ui.controller'
import { ALMOST_BLACK } from '../../utils/constants'
import { type Icon } from '../../utils/definitions'
import Canvas from '../canvas/canvas'

export type MenuPage = 'map' | 'backpack' | 'settings'
const SELECTED_BUTTON_COLOR: Color4 = { ...Color4.Gray(), a: 0.3 }

export class MainMenu {
  public activePage: MenuPage | undefined = 'settings'
  private readonly uiController: UIController
  readonly backpackIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Backpack off'
  }

  readonly mapIcon: Icon = { atlasName: 'navbar', spriteName: 'Map off' }
  readonly settingsIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Settings off'
  }

  private closeButtonColor: Color4 = Color4.Black()

  private backpackBackground: Color4 = Color4.create(0, 0, 0, 0)
  private mapBackground: Color4 = Color4.create(0, 0, 0, 0)
  private settingsBackground: Color4 = Color4.create(0, 0, 0, 0)

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  mapEnter(): void {
    this.mapIcon.spriteName = 'Map on'
    this.mapBackground = SELECTED_BUTTON_COLOR
    console.log('on mouse enter map')
  }

  backpackEnter(): void {
    this.backpackIcon.spriteName = 'Backpack on'
    this.backpackBackground = SELECTED_BUTTON_COLOR
    console.log('on mouse enter backpack')
  }

  settingsEnter(): void {
    this.settingsIcon.spriteName = 'Settings on'
    this.settingsBackground = SELECTED_BUTTON_COLOR
    console.log('on mouse enter settings')
  }

  hide(): void {
    this.uiController.isMainMenuVisible = false
    this.closeButtonColor = ALMOST_BLACK
  }

  show(page: MenuPage): void {
    this.uiController.settingsPage.updateButtons()
    this.activePage = page
    this.uiController.isMainMenuVisible = true
    this.updateButtons()
  }

  updateButtons(): void {
    this.settingsIcon.spriteName = 'Settings off'
    this.settingsBackground = Color4.create(0, 0, 0, 0)
    this.backpackIcon.spriteName = 'Backpack off'
    this.backpackBackground = Color4.create(0, 0, 0, 0)
    this.mapIcon.spriteName = 'Map off'
    this.mapBackground = Color4.create(0, 0, 0, 0)
    switch (this.activePage) {
      case 'settings':
        this.settingsEnter()
        break
      case 'map':
        this.mapEnter()
        break
      case 'backpack':
        this.backpackEnter()
        break
    }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    // const sideBarHeight: number = Math.max(canvasInfo.height * 0.024, 46)
    const buttonSize: number = Math.max(canvasInfo.height * 0.024, 46)

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
          uiBackground={{ color: Color4.Red() }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '8%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}
            uiBackground={{
              color: { ...Color4.Black(), a: 1 }
            }}
          >
            <UiEntity
              uiTransform={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <TextIconButton
                uiTransform={{
                  height: '90%',
                  width: 4 * buttonSize,
                  margin: { left: 15, right: 15 }
                }}
                onMouseEnter={() => {
                  this.mapEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.show('map')
                }}
                backgroundColor={this.mapBackground}
                icon={this.mapIcon}
                value={'MAP [M]'}
                fontSize={10}
                iconSize={50}
                direction={'column'}
              />

              <TextIconButton
                uiTransform={{
                  height: '90%',
                  width: 4 * buttonSize,
                  margin: { left: 15, right: 15 }
                }}
                onMouseEnter={() => {
                  this.backpackEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.show('backpack')
                }}
                backgroundColor={this.backpackBackground}
                icon={this.backpackIcon}
                value={'BACKPACK [B]'}
                fontSize={10}
                iconSize={50}
                direction={'column'}
              />

              <TextIconButton
                uiTransform={{
                  height: '90%',
                  width: 4 * buttonSize,
                  margin: { left: 15, right: 15 }
                }}
                onMouseEnter={() => {
                  this.settingsEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.show('settings')
                  
                }}
                backgroundColor={this.settingsBackground}
                icon={this.settingsIcon}
                value={'SETTINGS [P]'}
                fontSize={10}
                iconSize={50}
                direction={'column'}
              />
            </UiEntity>

            <IconButton
              onMouseEnter={() => {
                this.closeButtonColor = ALMOST_BLACK
              }}
              onMouseLeave={() => {
                this.closeButtonColor = Color4.Black()
              }}
              onMouseDown={() => {
                this.hide()
              }}
              uiTransform={{
                width: buttonSize,
                height: buttonSize,
                positionType: 'absolute',
                position: { right: 45 }
              }}
              backgroundColor={this.closeButtonColor}
              icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '100%',
              height: 'auto',
              flexGrow: 1
            }}
            uiBackground={{ color: { ...Color4.Green(), a: 0.1 } }}
          >
            {this.activePage === 'map' && this.uiController.mapPage.mainUi()}
            {this.activePage === 'backpack' &&
              this.uiController.backpackPage.mainUi()}
            {this.activePage === 'settings' &&
              this.uiController.settingsPage.mainUi()}
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}
