import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import type { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type Position, UiEntity } from '@dcl/sdk/react-ecs'
import ButtonIcon from '../../components/button-icon/ButtonIcon'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../../components/canvas/Canvas'
// import { openExternalUrl } from '~system/RestrictedActions'
import { BevyApi } from '../../bevy-api'
import { type AtlasIcon } from '../../utils/definitions'
import { ALPHA_BLACK_PANEL, SELECTED_BUTTON_COLOR } from '../../utils/constants'
import { ChatsAndLogs } from './chat-and-logs'
import { Friends } from './friends'
import { SceneInfo } from './scene-info'

export default class MainHud {
  public fontSize: number = 16
  public readonly isSideBarVisible: boolean = true
  private readonly uiController: UIController
  readonly bellAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Notifications off'
  }

  readonly backpackAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Backpack off'
  }

  readonly walletAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Wallet'
  }

  readonly mapAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Map off'
  }

  readonly settingsAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Settings off'
  }

  private readonly helpAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'HelpAtlasIcon Off'
  }

  private readonly exploreAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Explore off'
  }

  private readonly friendsAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Friends off'
  }

  private readonly chatAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Chat off'
  }

  private readonly voiceChatAtlasIcon: AtlasIcon = {
    atlasName: 'voice-chat',
    spriteName: 'Mic off'
  }

  // private cameraAtlasIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Camera Off'}
  // private experiencesAtlasIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'ExperienceAtlasIconOff'}
  private readonly emotesAtlasIcon: AtlasIcon = {
    atlasName: 'navbar',
    spriteName: 'Emote off'
  }

  private backpackHint: boolean = false
  private bellHint: boolean = false
  private emotesHint: boolean = false
  private exploreHint: boolean = false
  private helpHint: boolean = false
  private mapHint: boolean = false
  private settingsHint: boolean = false
  private walletHint: boolean = false
  private chatHint: boolean = false
  private voiceChatHint: boolean = false
  private friendsHint: boolean = false
  // private cameraHint: boolean = false
  // private experiencesHint: boolean = false

  private bellBackground: Color4 | undefined = undefined
  private backpackBackground: Color4 | undefined = undefined
  private emotesBackground: Color4 | undefined = undefined
  private exploreBackground: Color4 | undefined = undefined
  private helpBackground: Color4 | undefined = undefined
  private mapBackground: Color4 | undefined = undefined
  private settingsBackground: Color4 | undefined = undefined
  private walletBackground: Color4 | undefined = undefined
  private chatBackground: Color4 | undefined = undefined
  private voiceChatBackground: Color4 | undefined = undefined
  private friendsBackground: Color4 | undefined = undefined
  // private cameraBackground: Color4 | undefined = undefined
  // private experiencesBackground: Color4 | undefined = undefined

  public readonly sceneName: string = 'Scene Name'
  public readonly sceneCoords: { x: number; y: number } = { x: -5, y: 0 }
  public readonly isSdk6: boolean = true
  public readonly isFav: boolean = true

  private readonly sceneInfo: SceneInfo
  private readonly chatAndLogs: ChatsAndLogs
  public chatOpen: boolean = false
  public friendsOpen: boolean = false
  public voiceChatOn: boolean = false
  private readonly friends: Friends

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.sceneInfo = new SceneInfo(uiController)
    this.chatAndLogs = new ChatsAndLogs(uiController)
    this.friends = new Friends(uiController)
  }

  voiceChatDown(): void {
    if (this.voiceChatOn) {
      this.voiceChatAtlasIcon.spriteName = 'Mic off'
      this.voiceChatOn = false
    } else {
      this.voiceChatAtlasIcon.spriteName = 'Mic on'
      this.voiceChatOn = true
    }
  }

  walletEnter(): void {
    this.walletAtlasIcon.spriteName = 'Wallet on'
    this.walletBackground = SELECTED_BUTTON_COLOR
    this.walletHint = true
  }

  exploreEnter(): void {
    this.exploreAtlasIcon.spriteName = 'Explore on'
    this.exploreBackground = SELECTED_BUTTON_COLOR
    this.exploreHint = true
  }

  notificationsEnter(): void {
    this.bellAtlasIcon.spriteName = 'Notifications on'
    this.bellBackground = SELECTED_BUTTON_COLOR
    this.bellHint = true
  }

  mapEnter(): void {
    this.mapAtlasIcon.spriteName = 'Map on'
    this.mapBackground = SELECTED_BUTTON_COLOR
    this.mapHint = true
  }

  backpackEnter(): void {
    this.backpackAtlasIcon.spriteName = 'Backpack on'
    this.backpackBackground = SELECTED_BUTTON_COLOR
    this.backpackHint = true
  }

  settingsEnter(): void {
    this.settingsAtlasIcon.spriteName = 'Settings on'
    this.settingsBackground = SELECTED_BUTTON_COLOR
    this.settingsHint = true
  }

  helpEnter(): void {
    this.helpAtlasIcon.spriteName = 'HelpAtlasIcon On'
    this.helpBackground = SELECTED_BUTTON_COLOR
    this.helpHint = true
  }

  emotesEnter(): void {
    this.emotesAtlasIcon.spriteName = 'Emote on'
    this.emotesBackground = SELECTED_BUTTON_COLOR
    this.emotesHint = true
  }

  friendsEnter(): void {
    this.friendsAtlasIcon.spriteName = 'Friends on'
    this.friendsBackground = SELECTED_BUTTON_COLOR
    this.friendsHint = true
  }

  chatEnter(): void {
    this.chatAtlasIcon.spriteName = 'Chat on'
    this.chatBackground = SELECTED_BUTTON_COLOR
    this.chatHint = true
  }

  voiceChatEnter(): void {
    this.voiceChatBackground = SELECTED_BUTTON_COLOR
    this.voiceChatHint = true
  }

  updateButtons(): void {
    this.walletAtlasIcon.spriteName = 'Wallet'
    this.walletBackground = undefined
    this.walletHint = false
    this.bellAtlasIcon.spriteName = 'Notifications off'
    this.bellBackground = undefined
    this.bellHint = false
    this.mapAtlasIcon.spriteName = 'Map off'
    this.mapBackground = undefined
    this.mapHint = false
    this.backpackAtlasIcon.spriteName = 'Backpack off'
    this.backpackBackground = undefined
    this.backpackHint = false
    this.settingsAtlasIcon.spriteName = 'Settings off'
    this.settingsBackground = undefined
    this.settingsHint = false
    this.helpAtlasIcon.spriteName = 'HelpAtlasIcon Off'
    this.helpBackground = undefined
    this.helpHint = false
    this.emotesAtlasIcon.spriteName = 'Emote off'
    this.emotesBackground = undefined
    this.emotesHint = false
    this.exploreAtlasIcon.spriteName = 'Explore off'
    this.exploreBackground = undefined
    this.exploreHint = false

    if (!this.friendsOpen) {
      this.friendsAtlasIcon.spriteName = 'Friends off'
      this.friendsBackground = undefined
    }
    this.friendsHint = false
    if (!this.chatOpen) {
      this.chatAtlasIcon.spriteName = 'Chat off'
      this.chatBackground = undefined
    }
    this.chatHint = false
    if (!this.voiceChatOn) {
      this.voiceChatAtlasIcon.spriteName = 'Mic off'
      this.voiceChatBackground = undefined
    }
    this.voiceChatHint = false
  }

  openCloseChat(): void {
    this.chatEnter()
    this.chatOpen = !this.chatOpen
    this.friendsOpen = false
    this.updateButtons()
  }

  openCloseFriends(): void {
    this.friendsEnter()
    this.friendsOpen = !this.friendsOpen
    this.chatOpen = false
    this.updateButtons()
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const buttonSize: number = 38
    const buttonMargin: Partial<Position> = { top: 5, bottom: 5 }

    let leftPosition: number
    if ((canvasInfo.width * 2.5) / 100 < 45) {
      leftPosition = 45 + (canvasInfo.width * 1) / 100
    } else {
      leftPosition = (canvasInfo.width * 3.4) / 100
    }

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: (canvasInfo.width * 2.5) / 100,
            minWidth: 45,
            height: '100%',
            position: { left: 0, top: 0 },
            positionType: 'absolute'
          }}
          // onMouseEnter={() => (this.isSideBarVisible = true)}
          // onMouseLeave={() => (this.isSideBarVisible = false)}
        >
          <UiEntity
            uiTransform={{
              display: this.isSideBarVisible ? 'flex' : 'none',
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            uiBackground={{
              color: ALPHA_BLACK_PANEL
            }}
          >
            <UiEntity
              uiTransform={{
                display: this.isSideBarVisible ? 'flex' : 'none',
                width: '100%',
                height: 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <ButtonIcon
                uiTransform={{
                  margin: { top: 5, bottom: 5 },
                  height: (canvasInfo.width * 2.1) / 100,
                  minHeight: buttonSize,
                  width: (canvasInfo.width * 2.1) / 100,

                  minWidth: buttonSize
                }}
                onMouseEnter={() => {
                  this.walletEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.uiController.profile.showCard()
                }}
                backgroundColor={this.walletBackground}
                icon={this.walletAtlasIcon}
                hintText={'Profile'}
                showHint={this.walletHint}
              />

              <ButtonIcon
                uiTransform={{
                  height: (canvasInfo.width * 2.1) / 100,
                  minHeight: buttonSize,
                  width: (canvasInfo.width * 2.1) / 100,

                  minWidth: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.notificationsEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  console.log('clicked')
                }}
                backgroundColor={this.bellBackground}
                icon={this.bellAtlasIcon}
                hintText={'Notifications'}
                showHint={this.bellHint}
              />

              <UiEntity
                uiTransform={{ height: 1, width: '80%' }}
                uiBackground={{ color: SELECTED_BUTTON_COLOR }}
              />

              <ButtonIcon
                uiTransform={{
                  height: (canvasInfo.width * 2.1) / 100,
                  minHeight: buttonSize,
                  width: (canvasInfo.width * 2.1) / 100,

                  minWidth: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.mapEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.uiController.menu?.show('map')
                }}
                backgroundColor={this.mapBackground}
                icon={this.mapAtlasIcon}
                hintText={'Map'}
                showHint={this.mapHint}
              />
              <ButtonIcon
                uiTransform={{
                  height: (canvasInfo.width * 2.1) / 100,
                  minHeight: buttonSize,
                  width: (canvasInfo.width * 2.1) / 100,

                  minWidth: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.exploreEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.uiController.menu?.show('explore')
                }}
                backgroundColor={this.exploreBackground}
                icon={this.exploreAtlasIcon}
                hintText={'Explore'}
                showHint={this.exploreHint}
              />

              <ButtonIcon
                uiTransform={{
                  height: (canvasInfo.width * 2.1) / 100,
                  minHeight: buttonSize,
                  width: (canvasInfo.width * 2.1) / 100,

                  minWidth: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.backpackEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.uiController.menu?.show('backpack')
                }}
                backgroundColor={this.backpackBackground}
                icon={this.backpackAtlasIcon}
                hintText={'Backpack'}
                showHint={this.backpackHint}
              />

              <ButtonIcon
                uiTransform={{
                  height: (canvasInfo.width * 2.1) / 100,
                  minHeight: buttonSize,
                  width: (canvasInfo.width * 2.1) / 100,

                  minWidth: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.settingsEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.uiController.menu?.show('settings')
                }}
                backgroundColor={this.settingsBackground}
                icon={this.settingsAtlasIcon}
                hintText={'Settings'}
                showHint={this.settingsHint}
              />

              <UiEntity
                uiTransform={{ height: 1, width: '80%' }}
                uiBackground={{ color: SELECTED_BUTTON_COLOR }}
              />

              <ButtonIcon
                uiTransform={{
                  height: (canvasInfo.width * 2.1) / 100,
                  minHeight: buttonSize,
                  width: (canvasInfo.width * 2.1) / 100,

                  minWidth: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.helpEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  BevyApi.openSceneLogger().catch(console.error)
                  // openExternalUrl({ url: 'https://decentraland.org/help/' }).catch(console.error)
                }}
                backgroundColor={this.helpBackground}
                icon={this.helpAtlasIcon}
                hintText={'Help'}
                showHint={this.helpHint}
              />
            </UiEntity>

            <UiEntity
              uiTransform={{
                display: this.isSideBarVisible ? 'flex' : 'none',
                width: '100%',
                height: 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              {/* <ButtonIcon uiTransform={{height:buttonSize, width:buttonSize}}
                onMouseEnter={()=>{this.cameraEnter()}}
                onMouseLeave={()=>{this.cameraLeave()}}
                onMouseDown={()=>{console.log('Camera clicked')}}
                backgroundColor={this.cameraBackground}
                icon={this.cameraAtlasIcon}
                hintText={'Camera'}
                showHint={this.cameraHint} />

                <ButtonIcon uiTransform={{height:buttonSize, width:buttonSize}}
                onMouseEnter={()=>{this.experiencesEnter()}}
                onMouseLeave={()=>{this.updateButtons()}}
                onMouseDown={()=>{console.log('clicked')}}
                backgroundColor={this.experiencesBackground}
                icon={this.experiencesAtlasIcon}
                hintText={'Experiences'}
                showHint={this.experiencesHint} />
              */}
              <ButtonIcon
                uiTransform={{
                  height: buttonSize,
                  width: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.friendsEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.openCloseFriends()
                }}
                backgroundColor={this.friendsBackground}
                icon={this.friendsAtlasIcon}
                hintText={'Friends'}
                showHint={this.friendsHint}
                notifications={
                  this.uiController.friends.incomingFriendsMessages +
                  this.uiController.friends.requestsNumber
                }
              />
              <ButtonIcon
                uiTransform={{
                  height: buttonSize,
                  width: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.voiceChatEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.voiceChatDown()
                }}
                backgroundColor={this.voiceChatBackground}
                icon={this.voiceChatAtlasIcon}
                hintText={'Voice Chat'}
                showHint={this.voiceChatHint}
              />
              <ButtonIcon
                uiTransform={{
                  height: buttonSize,
                  width: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.chatEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  this.openCloseChat()
                }}
                backgroundColor={this.chatBackground}
                icon={this.chatAtlasIcon}
                hintText={'Chat'}
                showHint={this.chatHint}
                notifications={0}
              />

              <ButtonIcon
                uiTransform={{
                  height: (canvasInfo.width * 2.1) / 100,
                  minHeight: buttonSize,
                  width: (canvasInfo.width * 2.1) / 100,

                  minWidth: buttonSize,
                  margin: buttonMargin
                }}
                onMouseEnter={() => {
                  this.emotesEnter()
                }}
                onMouseLeave={() => {
                  this.updateButtons()
                }}
                onMouseDown={() => {
                  console.log('clicked')
                }}
                backgroundColor={this.emotesBackground}
                icon={this.emotesAtlasIcon}
                hintText={'Emotes'}
                showHint={this.emotesHint}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
        {this.sceneInfo.mainUi()}
        <UiEntity
          uiTransform={{
            alignItems: 'flex-end',
            width: 'auto',
            height: 'auto',
            position: {
              left: this.uiController.mainHud.isSideBarVisible
                ? leftPosition
                : canvasInfo.width * 0.01,
              bottom: canvasInfo.width * 0.01
            },
            positionType: 'absolute'
          }}
        >
          <UiEntity
            uiTransform={{
              flexDirection: 'column-reverse',
              display: this.chatOpen ? 'flex' : 'none',
              width: 'auto',
              height: 'auto',
              margin: { right: canvasInfo.width / 100 }
            }}
          >
            {this.chatAndLogs.mainUi()}
          </UiEntity>

          <UiEntity
            uiTransform={{
              flexDirection: 'column-reverse',
              display: this.friendsOpen ? 'flex' : 'none',
              width: 'auto',
              height: 'auto'
            }}
          >
            {this.friends.mainUi()}
          </UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}
