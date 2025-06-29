import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import ButtonIcon from '../../components/button-icon/ButtonIcon'
import { ButtonTextIcon } from '../../components/button-text-icon'
import { type UIController } from '../../controllers/ui.controller'
import { ALMOST_BLACK } from '../../utils/constants'
import { type AtlasIcon } from '../../utils/definitions'
import { ProfileButton } from '../profile/profile-button'
import { type MenuPage } from './MainMenu.types'
import { COLOR } from '../../components/color-palette'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { playPreviewEmote } from '../../components/backpack/AvatarPreview'
import {
  initOutfitsCatalog,
  disposeOutfitsCatalog
} from '../../components/backpack/OutfitAvatar'
import { DeleteOutfitDialog } from './backpack-page/delete-outfit-dialog'

const SELECTED_BUTTON_COLOR: Color4 = { ...Color4.Gray(), a: 0.3 }
const BUTTON_TEXT_COLOR_INACTIVE = Color4.Gray()

export default class MainMenu {
  public activePage: MenuPage | undefined = 'settings'
  public isOpen = (): boolean => this.open
  private readonly uiController: UIController
  private readonly profileButton: ProfileButton
  private open: boolean = false

  readonly backpackIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Backpack off'
  }

  readonly mapIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Map off'
  }

  readonly exploreIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Explore off'
  }

  readonly settingsIcon: AtlasIcon = {
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
    this.mapIcon.spriteName = 'Map on'
    this.mapBackground = SELECTED_BUTTON_COLOR
  }

  backpackEnter(): void {
    this.backpackIcon.spriteName = 'Backpack on'
    this.backpackBackground = SELECTED_BUTTON_COLOR
  }

  exploreEnter(): void {
    this.exploreIcon.spriteName = 'Explore on'
    this.exploreBackground = SELECTED_BUTTON_COLOR
  }

  settingsEnter(): void {
    this.settingsIcon.spriteName = 'Settings on'
    this.settingsBackground = SELECTED_BUTTON_COLOR
  }

  hide(): void {
    void this.uiController.backpackPage.saveAvatar()
    this.uiController.isMainMenuVisible = false
    this.closeButtonColor = ALMOST_BLACK
    playPreviewEmote('')
    disposeOutfitsCatalog()
    this.open = false
  }

  show(page: MenuPage): void {
    this.open = true
    this.uiController.settingsPage.updateButtons()
    this.activePage = page
    this.uiController.isMainMenuVisible = true
    this.updateButtons()
    this.uiController.show(page)
    initOutfitsCatalog().catch(console.error)
  }

  updateButtons(): void {
    this.settingsIcon.spriteName = 'Settings off'
    this.settingsBackground = undefined
    this.backpackIcon.spriteName = 'Backpack off'
    this.backpackBackground = undefined
    this.mapIcon.spriteName = 'Map off'
    this.mapBackground = undefined
    this.exploreIcon.spriteName = 'Explore off'
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
    const canvasScaleRatio = getCanvasScaleRatio()
    const buttonSize: number =
      Math.max(canvasInfo.height * 0.024, 46) * canvasScaleRatio
    const ICON_SIZE = 50 * canvasScaleRatio
    const BUTTON_ICON_FONT_SIZE = 24 * canvasScaleRatio
    const buttonTransform: UiTransformProps = {
      height: 100 * canvasScaleRatio,
      margin: { left: 10 * canvasScaleRatio },
      padding: { left: 20 * canvasScaleRatio, right: 20 * canvasScaleRatio },
      flexDirection: 'column'
    }
    const LOGO_WIDTH = 165 * canvasScaleRatio * 2.1
    const LOGO_HEIGHT = 24 * canvasScaleRatio * 2.1

    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
      >
        <DeleteOutfitDialog />
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
          uiBackground={{ color: Color4.create(0, 0, 0, 1) }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '6%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}
            uiBackground={{
              color: COLOR.MAIN_MENU_BACKGROUND
            }}
          >
            <UiEntity
              uiTransform={{
                width: LOGO_WIDTH,
                height: LOGO_HEIGHT,
                margin: { left: 20 },
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
              uiBackground={{
                texture: {
                  wrapMode: 'clamp',
                  src: 'assets/images/menu/menu-logo.png'
                },
                textureMode: 'stretch'
              }}
            ></UiEntity>
            <UiEntity
              uiTransform={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              <ButtonTextIcon
                uiTransform={buttonTransform}
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
                value={'<b>MAP</b> [M]'}
                fontSize={BUTTON_ICON_FONT_SIZE}
                iconSize={ICON_SIZE}
                iconColor={
                  this.activePage === 'map'
                    ? undefined
                    : BUTTON_TEXT_COLOR_INACTIVE
                }
                fontColor={
                  this.activePage === 'map'
                    ? undefined
                    : BUTTON_TEXT_COLOR_INACTIVE
                }
              />

              <ButtonTextIcon
                uiTransform={buttonTransform}
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
                icon={this.exploreIcon}
                value={'<b>EXPLORE</b> [X]'}
                fontSize={BUTTON_ICON_FONT_SIZE}
                iconSize={ICON_SIZE}
                iconColor={
                  this.activePage === 'explore'
                    ? undefined
                    : BUTTON_TEXT_COLOR_INACTIVE
                }
                fontColor={
                  this.activePage === 'explore'
                    ? undefined
                    : BUTTON_TEXT_COLOR_INACTIVE
                }
              />

              <ButtonTextIcon
                uiTransform={buttonTransform}
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
                value={'<b>BACKPACK</b> [B]'}
                fontSize={BUTTON_ICON_FONT_SIZE}
                iconSize={ICON_SIZE}
                iconColor={
                  this.activePage === 'backpack'
                    ? undefined
                    : BUTTON_TEXT_COLOR_INACTIVE
                }
                fontColor={
                  this.activePage === 'backpack'
                    ? undefined
                    : BUTTON_TEXT_COLOR_INACTIVE
                }
              />

              <ButtonTextIcon
                uiTransform={buttonTransform}
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
                value={'<b>SETTINGS</b> [P]'}
                fontSize={BUTTON_ICON_FONT_SIZE}
                iconSize={ICON_SIZE}
                iconColor={
                  this.activePage === 'settings'
                    ? undefined
                    : BUTTON_TEXT_COLOR_INACTIVE
                }
                fontColor={
                  this.activePage === 'settings'
                    ? undefined
                    : BUTTON_TEXT_COLOR_INACTIVE
                }
              />
            </UiEntity>
          </UiEntity>
          <UiEntity
            uiTransform={{
              width: '100%',
              height: 8 * canvasScaleRatio
            }}
            uiBackground={{
              texture: {
                src: 'assets/images/menu/hr-gradient.png'
              },
              textureMode: 'stretch'
            }}
          ></UiEntity>
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
              this.uiController.backpackPage.render()}
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
              icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
