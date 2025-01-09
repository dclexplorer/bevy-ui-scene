import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from './game.controller'
import { BackpackPage } from '../ui-classes/main-menu/backpack-page'
import { ProfileButton } from '../ui-classes/profile/profile-button'
import { Profile } from '../ui-classes/profile'
import { MainHud } from '../ui-classes/main-hud'
import { Friends } from '../ui-classes/main-hud/friends'
import { MainMenu } from '../ui-classes/main-menu'
import { ExplorePage } from '../ui-classes/main-menu/explore-page'
import { MapPage } from '../ui-classes/main-menu/map-page'
import { SettingsPage } from '../ui-classes/main-menu/settings-page'
import { LoadingAndLogin } from '../ui-classes/loading-and-login'
import { PopUpAction } from '../ui-classes/main-hud/pop-up-action'
import { PopUpWarning } from '../ui-classes/main-hud/pop-up-warning'
import { SceneInfoCard } from '../ui-classes/scene-info-card'

export class UIController {
  public isMainMenuVisible: boolean = false
  public isProfileVisible: boolean = false
  public isFriendsVisible: boolean = false
  public actionPopUpVisible: boolean = false
  public sceneInfoCardVisible: boolean = false
  public warningPopUpVisible: boolean = false
  public settingsPage: SettingsPage
  public backpackPage: BackpackPage
  public mapPage: MapPage
  public explorePage: ExplorePage

  profileButton: ProfileButton
  profile: Profile
  friends: Friends
  loadingAndLogin: LoadingAndLogin
  gameController: GameController
  mainHud: MainHud
  menu: MainMenu
  actionPopUp: PopUpAction
  sceneCard: SceneInfoCard
  warningPopUp: PopUpWarning

  constructor(gameController: GameController) {
    this.gameController = gameController
    this.loadingAndLogin = new LoadingAndLogin(this)
    this.mainHud = new MainHud(this)
    this.menu = new MainMenu(this)
    this.settingsPage = new SettingsPage(this)
    this.backpackPage = new BackpackPage()
    this.mapPage = new MapPage()
    this.explorePage = new ExplorePage()
    this.profileButton = new ProfileButton(this)
    this.profile = new Profile(this)
    this.friends = new Friends(this)
    this.actionPopUp = new PopUpAction(this)
    this.sceneCard = new SceneInfoCard(this)
    this.warningPopUp = new PopUpWarning(this)

    ReactEcsRenderer.setUiRenderer(this.ui.bind(this))
  }

  ui(): ReactEcs.JSX.Element {
    return (
      <UiEntity>
        {this.mainHud.mainUi()}
        {this.isMainMenuVisible && this.menu.mainUi()}
        {this.isProfileVisible && this.profile.mainUi()}
        {this.isFriendsVisible && this.friends.mainUi()}
        {this.actionPopUpVisible && this.actionPopUp.mainUi()}
        {this.sceneInfoCardVisible && this.sceneCard.mainUi()}
        {/* Loading & Login */}
        {this.loadingAndLogin?.mainUi()}
        {this.actionPopUpVisible && this.actionPopUp.mainUi()}
        {this.warningPopUpVisible && this.warningPopUp.mainUi()}
      </UiEntity>
    )
  }
}
