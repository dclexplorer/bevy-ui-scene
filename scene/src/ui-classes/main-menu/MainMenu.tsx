import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import ButtonIcon from '../../components/button-icon/ButtonIcon'
import { ButtonTextAtlasIcon } from '../../components/button-text-icon'
import { type UIController } from '../../controllers/ui.controller'
import { ALMOST_BLACK } from '../../utils/constants'
import { type AtlasIcon } from '../../utils/definitions'
import Canvas from '../../components/canvas/Canvas'
import { ProfileButton } from '../profile/profile-button'
import { type MenuPage } from './MainMenu.types'

const SELECTED_BUTTON_COLOR: Color4 = { ...Color4.Gray(), a: 0.3 }

export default class MainMenu {
  public activePage: MenuPage | undefined = 'settings'
  private readonly uiController: UIController
  private readonly profileButton: ProfileButton
  readonly backpackAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Backpack off'
  }

  readonly mapAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Map off'
  }

  readonly exploreAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Explore off'
  }

  readonly settingsAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Settings off'
  }

  private closeButtonColor: Color4 | undefined

  private backpackBackground: Color4 | undefined
  private mapBackground: Color4 | undefined
  private exploreBackground: Color4 | undefined
  private settingsBackground: Color4 | undefined

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.profileButton = new ProfileButton(uiController)
  }

  mapEnter(): void {
    this.mapAtlasIcon.spriteName = 'Map on'
    this.mapBackground = SELECTED_BUTTON_COLOR
  }

  backpackEnter(): void {
    this.backpackAtlasIcon.spriteName = 'Backpack on'
    this.backpackBackground = SELECTED_BUTTON_COLOR
  }

  exploreEnter(): void {
    this.exploreAtlasIcon.spriteName = 'Explore on'
    this.exploreBackground = SELECTED_BUTTON_COLOR
  }

  settingsEnter(): void {
    this.settingsAtlasIcon.spriteName = 'Settings on'
    this.settingsBackground = SELECTED_BUTTON_COLOR
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
    this.settingsAtlasIcon.spriteName = 'Settings off'
    this.settingsBackground = undefined
    this.backpackAtlasIcon.spriteName = 'Backpack off'
    this.backpackBackground = undefined
    this.mapAtlasIcon.spriteName = 'Map off'
    this.mapBackground = undefined
    this.exploreAtlasIcon.spriteName = 'Explore off'
    this.exploreBackground = undefined
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
      case 'explore':
        this.exploreEnter()
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
              <ButtonTextAtlasIcon
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
                icon={this.mapAtlasIcon}
                value={'MAP [M]'}
                fontSize={10}
                iconSize={50}
                direction={'column'}
              />

              <ButtonTextAtlasIcon
                uiTransform={{
                  height: '90%',
                  width: 4 * buttonSize,
                  margin: { left: 15, right: 15 }
                }}
                onMouseEnter={() => {
                  this.exploreEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.show('explore')
                }}
                backgroundColor={this.exploreBackground}
                icon={this.exploreAtlasIcon}
                value={'EXPLORE'}
                fontSize={10}
                iconSize={50}
                direction={'column'}
              />

              <ButtonTextAtlasIcon
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
                icon={this.backpackAtlasIcon}
                value={'BACKPACK [B]'}
                fontSize={10}
                iconSize={50}
                direction={'column'}
              />

              <ButtonTextAtlasIcon
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
                icon={this.settingsAtlasIcon}
                value={'SETTINGS [P]'}
                fontSize={10}
                iconSize={50}
                direction={'column'}
              />
            </UiEntity>
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
            {this.activePage === 'explore' &&
              this.uiController.explorePage.mainUi()}
            {this.activePage === 'backpack' &&
              this.uiController.backpackPage.mainUi()}
            {this.activePage === 'settings' &&
              this.uiController.settingsPage.mainUi()}
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: 'auto',
              height: '8%',
              positionType: 'absolute',
              alignItems: 'center',
              position: { right: buttonSize, top: 0 }
            }}
          >
            {this.profileButton.mainUi()}
            <ButtonIcon
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
                height: buttonSize
              }}
              backgroundColor={this.closeButtonColor}
              icon={{ atlasName: 'icons', spriteName: 'CloseAtlasIcon' }}
            />
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}
