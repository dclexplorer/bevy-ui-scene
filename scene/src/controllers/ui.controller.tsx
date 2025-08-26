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
import Photos from 'src/ui-classes/photos/Photos'
import {
  initEmotesWheel,
  renderEmotesWheel
} from '../emotes-wheel/emotes-wheel'
import { getWaitFor } from '../utils/function-utils'
import { sleep } from '../utils/dcl-utils'
import { getPlayer } from '@dcl/sdk/src/players'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { type ReactElement } from '@dcl/react-ecs'
import { Canvas } from '../components/canvas'
import { store } from '../state/store'
import { BevyApi } from '../bevy-api'
import { PopupStack } from '../components/popup-stack'
import { setupNotifications } from '../ui-classes/main-hud/notifications-menu'
import {
  initRealTimeNotifications,
  NotificationToastStack
} from '../ui-classes/main-hud/notification-toast-stack'
import { updateHudStateAction } from '../state/hud/actions'
import { listenPermissionRequests } from '../ui-classes/main-hud/permissions-popups/permissions-popup-service'
import { getRealm } from '~system/Runtime'
import { BigMap } from '../ui-classes/main-hud/big-map/big-map-view'

let loadingAndLogin: any = null

export function logout(): void {
  if (!loadingAndLogin) return

  BevyApi.logout()
  loadingAndLogin.startLoading()
  loadingAndLogin.setStatus('sign-in-or-guest')
}
let uiControllerSingletonInstance: UIController
export const getUiController = () => uiControllerSingletonInstance

export class UIController {
  public isPhotosVisible: boolean = false
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
  photosPanel: Photos

  show(page: string): void {
    if (page === 'backpack') {
      void this.backpackPage.init()
    }
  }

  constructor(gameController: GameController) {
    uiControllerSingletonInstance = this
    this.gameController = gameController
    this.loadingAndLogin = loadingAndLogin = new LoadingAndLogin(this)
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
    this.photosPanel = new Photos(this)

    this.loadingAndLogin.onFinish(() => {
      const waitFor = getWaitFor(sleep)

      ;(async () => {
        // TODO review with bevy-explorer dev or protocol why getPlayer().emotes is empty at first
        listenPermissionRequests().catch(console.error)

        await waitFor(() => (getPlayer()?.emotes?.length ?? 0) > 0, 3000)
        store.dispatch(
          updateHudStateAction({
            realmURL: (await getRealm({})).realmInfo?.baseUrl ?? 'main' // TODO REVIEW
          })
        )
        store.dispatch(
          updateHudStateAction({
            loggedIn: true
          })
        )
        void initEmotesWheel({
          showBackpackMenu: () => {
            if (!this.isMainMenuVisible) {
              this.menu?.show('backpack')
            }
          }
        })

        void this.backpackPage.init()

        setupNotifications().catch(console.error)
        initRealTimeNotifications()
      })().catch(console.error)
    })
    ReactEcsRenderer.setUiRenderer(this.ui.bind(this))
  }

  ui(): ReactEcs.JSX.Element {
    return (
      <Canvas>
        {InteractableArea({ active: false })}
        {this.mainHud.mainUi()}

        {this.isMainMenuVisible && this.menu.mainUi()}
        {this.isProfileVisible && this.profile.mainUi()}
        {this.isFriendsVisible && this.friends.mainUi()}
        {this.actionPopUpVisible && this.actionPopUp.mainUi()}

        {this.isPhotosVisible && this.photosPanel.mainUi()}
        {/* Loading & Login */}
        {this.loadingAndLogin?.mainUi()}
        {this.actionPopUpVisible && this.actionPopUp.mainUi()}
        {this.warningPopUpVisible && this.warningPopUp.mainUi()}
        {!this.isMainMenuVisible && renderEmotesWheel()}
        {store.getState().hud.mapModeActive && BigMap()}
        {this.sceneInfoCardVisible && this.sceneCard.mainUi()}
        {NotificationToastStack()}
        {PopupStack()}
      </Canvas>
    )
  }
}

function InteractableArea({
  active = false,
  opacity = 0.1
}: {
  active?: boolean
  opacity?: number
}): ReactElement | null {
  if (!active) return null
  const canvas = UiCanvasInformation.get(engine.RootEntity)
  if (!canvas?.interactableArea) return null
  const viewportState = store.getState().viewport
  const { interactableArea } = viewportState
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: {
          left: interactableArea.left,
          top: interactableArea.top
        },
        width: canvas.width - (interactableArea.right + interactableArea.left),
        height:
          canvas.height - (interactableArea.top + interactableArea.bottom),
        zIndex: 999999
      }}
      uiBackground={{
        color: Color4.create(0, 1, 1, opacity)
      }}
    />
  )
}
