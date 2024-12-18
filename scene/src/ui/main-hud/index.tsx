import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type Position, UiEntity } from '@dcl/sdk/react-ecs'
import IconButton from '../../components/iconButton'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/canvas'
// import { openExternalUrl } from '~system/RestrictedActions'
import { BevyApi } from '../../bevy-api'
import { SceneInfo } from './sceneInfo'
import { type Icon } from '../../utils/definitions'
import { ChatAndLogs } from './chat-and-logs'
import { Friends } from './friends'
import { SELECTED_BUTTON_COLOR } from '../../utils/constants'

export class MainHud {
  public fontSize: number = 16
  public readonly isSideBarVisible: boolean = true
  private readonly uiController: UIController
  readonly bellIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Notifications off'
  }

  readonly backpackIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Backpack off'
  }

  readonly walletIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Wallet'
  }

  readonly mapIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Map off'
  }

  readonly settingsIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Settings off'
  }

  private readonly helpIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'HelpIcon Off'
  }

  private readonly exploreIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Explore off'
  }

  private readonly friendsIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Friends off'
  }

  private readonly chatIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Chat off'
  }

  private readonly voiceChatIcon: Icon = {
    atlasName: 'voice-chat',
    spriteName: 'Mic off'
  }

  // private cameraIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Camera Off'}
  // private experiencesIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'ExperienceIconOff'}
  private readonly emotesIcon: Icon = {
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
  private readonly chatAndLogs: ChatAndLogs
  public chatOpen: boolean = false
  public friendsOpen: boolean = false
  public voiceChatOn: boolean = false
  private readonly friends: Friends

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.sceneInfo = new SceneInfo(uiController)
    this.chatAndLogs = new ChatAndLogs(uiController)
    this.friends = new Friends(uiController)
  }

  voiceChatDown(): void {
    if (this.voiceChatOn) {
      this.voiceChatIcon.spriteName = 'Mic off'
      this.voiceChatOn = false
    } else {
      this.voiceChatIcon.spriteName = 'Mic on'
      this.voiceChatOn = true
    }
  }

  walletEnter(): void {
    this.walletIcon.spriteName = 'Wallet on'
    this.walletBackground = SELECTED_BUTTON_COLOR
    this.walletHint = true
  }

  exploreEnter(): void {
    this.exploreIcon.spriteName = 'Explore on'
    this.exploreBackground = SELECTED_BUTTON_COLOR
    this.exploreHint = true
  }

  notificationsEnter(): void {
    this.bellIcon.spriteName = 'Notifications on'
    this.bellBackground = SELECTED_BUTTON_COLOR
    this.bellHint = true
  }

  mapEnter(): void {
    this.mapIcon.spriteName = 'Map on'
    this.mapBackground = SELECTED_BUTTON_COLOR
    this.mapHint = true
  }

  backpackEnter(): void {
    this.backpackIcon.spriteName = 'Backpack on'
    this.backpackBackground = SELECTED_BUTTON_COLOR
    this.backpackHint = true
  }

  settingsEnter(): void {
    this.settingsIcon.spriteName = 'Settings on'
    this.settingsBackground = SELECTED_BUTTON_COLOR
    this.settingsHint = true
  }

  helpEnter(): void {
    this.helpIcon.spriteName = 'HelpIcon On'
    this.helpBackground = SELECTED_BUTTON_COLOR
    this.helpHint = true
  }

  emotesEnter(): void {
    this.emotesIcon.spriteName = 'Emote on'
    this.emotesBackground = SELECTED_BUTTON_COLOR
    this.emotesHint = true
  }

  friendsEnter(): void {
    this.friendsIcon.spriteName = 'Friends on'
    this.friendsBackground = SELECTED_BUTTON_COLOR
    this.friendsHint = true
  }

  chatEnter(): void {
    this.chatIcon.spriteName = 'Chat on'
    this.chatBackground = SELECTED_BUTTON_COLOR
    this.chatHint = true
  }

  voiceChatEnter(): void {
    this.voiceChatBackground = SELECTED_BUTTON_COLOR
    this.voiceChatHint = true
  }

  updateButtons(): void {
    this.walletIcon.spriteName = 'Wallet'
    this.walletBackground = undefined
    this.walletHint = false
    this.bellIcon.spriteName = 'Notifications off'
    this.bellBackground = undefined
    this.bellHint = false
    this.mapIcon.spriteName = 'Map off'
    this.mapBackground = undefined
    this.mapHint = false
    this.backpackIcon.spriteName = 'Backpack off'
    this.backpackBackground = undefined
    this.backpackHint = false
    this.settingsIcon.spriteName = 'Settings off'
    this.settingsBackground = undefined
    this.settingsHint = false
    this.helpIcon.spriteName = 'HelpIcon Off'
    this.helpBackground = undefined
    this.helpHint = false
    this.emotesIcon.spriteName = 'Emote off'
    this.emotesBackground = undefined
    this.emotesHint = false
    this.exploreIcon.spriteName = 'Explore off'
    this.exploreBackground = undefined
    this.exploreHint = false

    if (!this.friendsOpen) {
      this.friendsIcon.spriteName = 'Friends off'
      this.friendsBackground = undefined
    }
    this.friendsHint = false
    if (!this.chatOpen) {
      this.chatIcon.spriteName = 'Chat off'
      this.chatBackground = undefined
    }
    this.chatHint = false
    if (!this.voiceChatOn) {
      this.voiceChatIcon.spriteName = 'Mic off'
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
              color: { ...Color4.Black(), a: 0.8 }
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
              <IconButton
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
                icon={this.walletIcon}
                hintText={'Profile'}
                showHint={this.walletHint}
              />

              <IconButton
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
                icon={this.bellIcon}
                hintText={'Notifications'}
                showHint={this.bellHint}
              />

              <UiEntity
                uiTransform={{ height: 1, width: '80%' }}
                uiBackground={{ color: SELECTED_BUTTON_COLOR }}
              />

              <IconButton
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
                icon={this.mapIcon}
                hintText={'Map'}
                showHint={this.mapHint}
              />
              <IconButton
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
                icon={this.exploreIcon}
                hintText={'Explore'}
                showHint={this.exploreHint}
              />

              <IconButton
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
                icon={this.backpackIcon}
                hintText={'Backpack'}
                showHint={this.backpackHint}
              />

              <IconButton
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
                icon={this.settingsIcon}
                hintText={'Settings'}
                showHint={this.settingsHint}
              />

              <UiEntity
                uiTransform={{ height: 1, width: '80%' }}
                uiBackground={{ color: SELECTED_BUTTON_COLOR }}
              />

              <IconButton
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
                icon={this.helpIcon}
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
              {/* <IconButton uiTransform={{height:buttonSize, width:buttonSize}}
                onMouseEnter={()=>{this.cameraEnter()}}
                onMouseLeave={()=>{this.cameraLeave()}}
                onMouseDown={()=>{console.log('Camera clicked')}}
                backgroundColor={this.cameraBackground}
                icon={this.cameraIcon}
                hintText={'Camera'}
                showHint={this.cameraHint} />

                <IconButton uiTransform={{height:buttonSize, width:buttonSize}}
                onMouseEnter={()=>{this.experiencesEnter()}}
                onMouseLeave={()=>{this.updateButtons()}}
                onMouseDown={()=>{console.log('clicked')}}
                backgroundColor={this.experiencesBackground}
                icon={this.experiencesIcon}
                hintText={'Experiences'}
                showHint={this.experiencesHint} />
              */}
              <IconButton
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
                icon={this.friendsIcon}
                hintText={'Friends'}
                showHint={this.friendsHint}
                notifications={
                  this.uiController.friends.incomingFriendsMessages +
                  this.uiController.friends.requestsNumber
                }
              />
              <IconButton
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
                icon={this.voiceChatIcon}
                hintText={'Voice Chat'}
                showHint={this.voiceChatHint}
              />
              <IconButton
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
                icon={this.chatIcon}
                hintText={'Chat'}
                showHint={this.chatHint}
                notifications={0}
              />

              <IconButton
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
                icon={this.emotesIcon}
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
