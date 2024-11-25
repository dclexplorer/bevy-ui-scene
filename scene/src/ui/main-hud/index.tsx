import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type Position, UiEntity } from '@dcl/sdk/react-ecs'
import IconButton from '../../components/iconButton'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/canvas'
// import { openExternalUrl } from '~system/RestrictedActions'
import { BevyApi } from '../../bevy-api'

const SELECTED_BUTTON_COLOR: Color4 = { ...Color4.Gray(), a: 0.3 }

export class MainHud {
  private readonly isSideBarVisible: boolean = true
  private readonly uiController: UIController
  readonly bellIcon: { atlasName: string; spriteName: string } = {
    atlasName: 'navbar',
    spriteName: 'Notifications off'
  }

  readonly backpackIcon: { atlasName: string; spriteName: string } = {
    atlasName: 'navbar',
    spriteName: 'Backpack off'
  }

  readonly walletIcon: { atlasName: string; spriteName: string } = {
    atlasName: 'navbar',
    spriteName: 'Wallet'
  }

  readonly mapIcon: { atlasName: string; spriteName: string } = {
    atlasName: 'navbar',
    spriteName: 'Map off'
  }

  readonly settingsIcon: { atlasName: string; spriteName: string } = {
    atlasName: 'navbar',
    spriteName: 'Settings off'
  }

  private readonly helpIcon: { atlasName: string; spriteName: string } = {
    atlasName: 'navbar',
    spriteName: 'HelpIcon Off'
  }

  // private friendsIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Friends off'}
  // private cameraIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Camera Off'}
  // private experiencesIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'ExperienceIconOff'}
  private readonly emotesIcon: { atlasName: string; spriteName: string } = {
    atlasName: 'navbar',
    spriteName: 'Emote off'
  }

  private bellHint: boolean = false
  private backpackHint: boolean = false
  private walletHint: boolean = false
  private mapHint: boolean = false
  private settingsHint: boolean = false
  private helpHint: boolean = false
  // private friendsHint: boolean = false
  // private cameraHint: boolean = false
  // private experiencesHint: boolean = false
  private emotesHint: boolean = false

  private bellBackground: Color4 = Color4.create(0, 0, 0, 0)
  private backpackBackground: Color4 = Color4.create(0, 0, 0, 0)
  private walletBackground: Color4 = Color4.create(0, 0, 0, 0)
  private mapBackground: Color4 = Color4.create(0, 0, 0, 0)
  private settingsBackground: Color4 = Color4.create(0, 0, 0, 0)
  private helpBackground: Color4 = Color4.create(0, 0, 0, 0)
  // private friendsBackground: Color4 = Color4.create(0, 0, 0, 0)
  // private cameraBackground: Color4 = Color4.create(0, 0, 0, 0)
  // private experiencesBackground: Color4 = Color4.create(0, 0, 0, 0)
  private emotesBackground: Color4 = Color4.create(0, 0, 0, 0)

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  walletEnter(): void {
    this.walletIcon.spriteName = 'Wallet on'
    this.walletBackground = SELECTED_BUTTON_COLOR
    this.walletHint = true
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

  updateButtons(): void {
    this.walletIcon.spriteName = 'Wallet'
    this.walletBackground = Color4.create(0, 0, 0, 0)
    this.walletHint = false
    this.bellIcon.spriteName = 'Notifications off'
    this.bellBackground = Color4.create(0, 0, 0, 0)
    this.bellHint = false
    this.mapIcon.spriteName = 'Map off'
    this.mapBackground = Color4.create(0, 0, 0, 0)
    this.mapHint = false
    this.backpackIcon.spriteName = 'Backpack off'
    this.backpackBackground = Color4.create(0, 0, 0, 0)
    this.backpackHint = false
    this.settingsIcon.spriteName = 'Settings off'
    this.settingsBackground = Color4.create(0, 0, 0, 0)
    this.settingsHint = false
    this.helpIcon.spriteName = 'HelpIcon Off'
    this.helpBackground = Color4.create(0, 0, 0, 0)
    this.helpHint = false
    this.emotesIcon.spriteName = 'Emote off'
    this.emotesBackground = Color4.create(0, 0, 0, 0)
    this.emotesHint = false
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const sideBarHeight: number = Math.max(canvasInfo.height * 0.024, 46)
    const buttonSize: number = sideBarHeight * 0.9
    const buttonMargin: Partial<Position> = { top: 5, bottom: 5 }

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: '2.4%',
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
                  margin: { top: 300, bottom: 5 },
                  height: buttonSize,
                  width: buttonSize
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
                  height: buttonSize,
                  width: buttonSize,
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
                  height: buttonSize,
                  width: buttonSize,
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
                  height: buttonSize,
                  width: buttonSize,
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
                  height: buttonSize,
                  width: buttonSize,
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
                  height: buttonSize,
                  width: buttonSize,
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

                <IconButton uiTransform={{height:buttonSize, width:buttonSize}}
                onMouseEnter={()=>{this.friendsEnter()}}
                onMouseLeave={()=>{this.updateButtons()}}
                onMouseDown={()=>{console.log('Wallet clicked')}}
                backgroundColor={this.friendsBackground}
                icon={this.friendsIcon}
                hintText={'Friends'}
                showHint={this.friendsHint} /> */}

              <IconButton
                uiTransform={{
                  height: buttonSize,
                  width: buttonSize,
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
      </Canvas>
    )
  }
}
