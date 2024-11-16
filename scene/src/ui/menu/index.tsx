import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import IconButton from '../../components/iconButton'
import { UIController } from '../../controllers/ui.controller'
import { ALMOST_BLACK } from '../../utils/constants'
import { BackpackPage } from '../backpack-page'
import Canvas from '../canvas/canvas'
import { MapPage } from '../map-page'
import { SettingsPage } from '../settings-page'
import TextIconButton from '../../components/textIconButton'
import { Icon } from '../../utils/definitions'

export type MenuPage = 'map' | 'backpack' | 'settings'
const SELECTED_BUTTON_COLOR: Color4 = { ...Color4.Gray(), a: 0.3 }

export class MainMenu {
  public activePage: MenuPage | undefined = 'settings'
  private readonly uiController: UIController
  private backpackIcon: Icon = {atlasName: 'navbar', spriteName:'Backpack off'}
  private mapIcon: Icon = {atlasName: 'navbar', spriteName:'Map off'}
  private settingsIcon: Icon = {atlasName: 'navbar', spriteName:'Settings off'}

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

  mapLeave(): void {
    this.updateButtons()
    console.log('on mouse leave map')
  }

  backpackEnter(): void {
    this.backpackIcon.spriteName = 'Backpack on'
    this.backpackBackground = SELECTED_BUTTON_COLOR
  }

  backpackLeave(): void {
    this.updateButtons()
  }

  settingsEnter(): void {
    this.settingsIcon.spriteName = 'Settings on'
    this.settingsBackground = SELECTED_BUTTON_COLOR
    console.log('on mouse enter settings')
  }

  settingsLeave(): void {
    this.updateButtons()
  }

  hide(): void {
    this.uiController.isMainMenuVisible = false
    this.closeButtonColor = ALMOST_BLACK
  }

  show(page: MenuPage): void {
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
        this.settingsIcon.spriteName = 'Settings on'
        this.settingsBackground = SELECTED_BUTTON_COLOR
        break
      case 'map':
        this.mapIcon.spriteName = 'Map on'
        this.mapBackground = SELECTED_BUTTON_COLOR
        break
      case 'backpack':
        this.backpackIcon.spriteName = 'Backpack on'
        this.backpackBackground = SELECTED_BUTTON_COLOR
    }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    this.updateButtons()
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const sideBarHeight: number = Math.max(canvasInfo.height * 0.024, 46)
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
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: 'assets/images/menu/Background.png' }
          }}
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
                  margin: { left: 5, right: 5 }
                }}
                onMouseEnter={() => {
                  this.mapEnter()
                }}
                onMouseLeave={() => {
                  this.mapLeave()
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
                  margin: { left: 5, right: 5 }
                }}
                onMouseEnter={() => {
                  this.backpackEnter()
                }}
                onMouseLeave={() => {
                  this.backpackLeave()
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
                  margin: { left: 5, right: 5 }
                }}
                onMouseEnter={() => {
                  this.settingsEnter()
                }}
                onMouseLeave={() => {
                  this.settingsLeave()
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
            uiBackground={{color:Color4.Blue()}}
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
