import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { LoadingUI } from '../ui/loading-and-login/loading'
import { MainHud } from '../ui/main-hud'
import { MainMenu } from '../ui/menu'
import { type GameController } from './game.controller'
import { BackpackPage } from '../ui/backpack-page'
import { MapPage } from '../ui/map-page'
import { SettingsPage } from '../ui/settings-page'
import { ProfileButton } from '../ui/profile-button'
import { Profile } from '../ui/profile'
import { ExplorePage } from '../ui/explore-page'

export class UIController {
  public isMainMenuVisible: boolean = false
  public isProfileVisible: boolean = false
  public settingsPage: SettingsPage
  public backpackPage: BackpackPage
  public mapPage: MapPage
  public explorePage: ExplorePage

  profileButton: ProfileButton
  profile: Profile
  loadingAndLogin: LoadingUI
  gameController: GameController
  mainHud: MainHud
  menu: MainMenu

  constructor(gameController: GameController) {
    this.gameController = gameController
    this.loadingAndLogin = new LoadingUI(this)
    this.mainHud = new MainHud(this)
    this.menu = new MainMenu(this)
    this.settingsPage = new SettingsPage()
    this.backpackPage = new BackpackPage()
    this.mapPage = new MapPage()
    this.explorePage = new ExplorePage()
    this.profileButton = new ProfileButton(this)
    this.profile = new Profile(this)

    ReactEcsRenderer.setUiRenderer(this.ui.bind(this))
  }

  ui(): ReactEcs.JSX.Element {
    return (
      <UiEntity>
        {this.mainHud.mainUi()}
        {this.isMainMenuVisible && this.menu.mainUi()}
        {this.isProfileVisible && this.profile.mainUi()}
        {/* Loading & Login */}
        {/* {this.loadingAndLogin?.mainUi()} */}
      </UiEntity>
    )
  }
}
