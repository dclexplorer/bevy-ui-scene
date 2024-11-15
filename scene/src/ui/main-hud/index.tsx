import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import Canvas from '../canvas/canvas'
import { type UIController } from '../../controllers/ui.controller'
import IconButton from '../../components/iconButton'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { openExternalUrl } from '~system/RestrictedActions'
import { BevyApi } from '../../bevy-api'

const SELECTED_BUTTON_COLOR: Color4 = { ...Color4.Gray(), a: 0.3 }

export class MainHud {
  private readonly isSideBarVisible: boolean = true
  private readonly uiController: UIController
  private bellIcon: string = 'assets/images/navbar/Notifications off.png'
  private backpackIcon: string = 'assets/images/navbar/Backpack off.png'
  private walletIcon: string = 'assets/images/navbar/Wallet.png'
  private mapIcon: string = 'assets/images/navbar/Map off.png'
  private settingsIcon: string = 'assets/images/navbar/Settings off.png'
  private helpIcon: string = 'assets/images/navbar/HelpIcon Off.png'
  // private friendsIcon: string = 'assets/images/navbar/Friends off.png'
  // private cameraIcon: string = 'assets/images/navbar/Camera Off.png'
  // private experiencesIcon: string = 'assets/images/navbar/ExperienceIconOff.png'
  private emotesIcon: string = 'assets/images/navbar/Emote off.png'

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
    this.walletIcon = 'assets/images/navbar/Wallet on.png'
    this.walletBackground = SELECTED_BUTTON_COLOR
    this.walletHint = true
    console.log('on mouse enter wallet')
  }

  walletLeave(): void {
    this.walletIcon = 'assets/images/navbar/Wallet.png'
    this.walletBackground = Color4.create(0, 0, 0, 0)
    this.walletHint = false
    console.log('on mouse leave wallet')
  }

  notificationsEnter(): void {
    this.bellIcon = 'assets/images/navbar/Notifications on.png'
    this.bellBackground = SELECTED_BUTTON_COLOR
    this.bellHint = true
    console.log('on mouse enter notifications')
  }

  notificationsLeave(): void {
    this.bellIcon = 'assets/images/navbar/Notifications off.png'
    this.bellBackground = Color4.create(0, 0, 0, 0)
    this.bellHint = false
    console.log('on mouse leave notifications')
  }

  mapEnter(): void {
    this.mapIcon = 'assets/images/navbar/Map on.png'
    this.mapBackground = SELECTED_BUTTON_COLOR
    this.mapHint = true
    console.log('on mouse enter map')
  }

  mapLeave(): void {
    this.mapIcon = 'assets/images/navbar/Map off.png'
    this.mapBackground = Color4.create(0, 0, 0, 0)
    this.mapHint = false
    console.log('on mouse leave map')
  }

  backpackEnter(): void {
    this.backpackIcon = 'assets/images/navbar/Backpack on.png'
    this.backpackBackground = SELECTED_BUTTON_COLOR
    this.backpackHint = true
    console.log('on mouse enter backpack')
  }

  backpackLeave(): void {
    this.backpackIcon = 'assets/images/navbar/Backpack off.png'
    this.backpackBackground = Color4.create(0, 0, 0, 0)
    this.backpackHint = false
    console.log('on mouse leave backpack')
  }

  settingsEnter(): void {
    this.settingsIcon = 'assets/images/navbar/Settings on.png'
    this.settingsBackground = SELECTED_BUTTON_COLOR
    this.settingsHint = true
    console.log('on mouse enter settings')
  }

  settingsLeave(): void {
    this.settingsIcon = 'assets/images/navbar/Settings off.png'
    this.settingsBackground = Color4.create(0, 0, 0, 0)
    this.settingsHint = false
    console.log('on mouse leave settings')
  }

  helpEnter(): void {
    this.helpIcon = 'assets/images/navbar/HelpIcon On.png'
    this.helpBackground = SELECTED_BUTTON_COLOR
    this.helpHint = true
    console.log('on mouse enter help')
  }

  helpLeave(): void {
    this.helpIcon = 'assets/images/navbar/HelpIcon Off.png'
    this.helpBackground = Color4.create(0, 0, 0, 0)
    this.helpHint = false
    console.log('on mouse leave help')
  }

  // cameraEnter():void{
  //   this.cameraIcon = 'assets/images/navbar/Camera On.png'
  //   this.cameraBackground = SELECTED_BUTTON_COLOR
  //   this.cameraHint = true
  //   console.log('on mouse enter camera')
  // }

  // cameraLeave():void{
  //   this.cameraIcon = 'assets/images/navbar/Camera Off.png'
  //   this.cameraBackground = Color4.create(0,0,0,0)
  //   this.cameraHint = false
  //   console.log('on mouse leave camera')
  // }

  // experiencesEnter():void{
  //   this.experiencesIcon = 'assets/images/navbar/ExperienceIconOn.png'
  //   this.experiencesBackground = SELECTED_BUTTON_COLOR
  //   this.experiencesHint = true
  //   console.log('on mouse enter experiences')
  // }

  // experiencesLeave():void{
  //   this.experiencesIcon = 'assets/images/navbar/ExperienceIconOff.png'
  //   this.experiencesBackground = Color4.create(0,0,0,0)
  //   this.experiencesHint = false
  //   console.log('on mouse leave experiences')
  // }

  // friendsEnter():void{
  //   this.friendsIcon = 'assets/images/navbar/Friends on.png'
  //   this.friendsBackground = SELECTED_BUTTON_COLOR
  //   this.friendsHint = true
  //   console.log('on mouse enter friends')
  // }

  // friendsLeave():void{
  //     this.friendsIcon = 'assets/images/navbar/Friends off.png'
  //     this.friendsBackground = Color4.create(0,0,0,0)
  //     this.friendsHint = false
  //     console.log('on mouse leave friends')
  // }

  emotesEnter(): void {
    this.emotesIcon = 'assets/images/navbar/Emote on.png'
    this.emotesBackground = SELECTED_BUTTON_COLOR
    this.emotesHint = true
    console.log('on mouse enter emotes')
  }

  emotesLeave(): void {
    this.emotesIcon = 'assets/images/navbar/Emote off.png'
    this.emotesBackground = Color4.create(0, 0, 0, 0)
    this.emotesHint = false
    console.log('on mouse leave emotes')
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const sideBarHeight: number = Math.max(canvasInfo.height * 0.024, 46)
    const buttonSize: number = sideBarHeight * 0.9

    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            width: '2.4%',
            height: '100%',
            position: { left: 270, top: 0 },
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
                uiTransform={{ height: buttonSize, width: buttonSize }}
                onMouseEnter={() => {
                  this.walletEnter()
                }}
                onMouseLeave={() => {
                  this.walletLeave()
                }}
                onMouseDown={() => {
                  console.log('Wallet clicked')
                }}
                backgroundColor={this.walletBackground}
                iconSrc={this.walletIcon}
                hintText={'Wallet'}
                showHint={this.walletHint}
              />

              <IconButton
                uiTransform={{ height: buttonSize, width: buttonSize }}
                onMouseEnter={() => {
                  this.notificationsEnter()
                }}
                onMouseLeave={() => {
                  this.notificationsLeave()
                }}
                onMouseDown={() => {
                  console.log('clicked')
                }}
                backgroundColor={this.bellBackground}
                iconSrc={this.bellIcon}
                hintText={'Notifications'}
                showHint={this.bellHint}
              />

              <UiEntity
                uiTransform={{ height: 1, width: '80%' }}
                uiBackground={{ color: SELECTED_BUTTON_COLOR }}
              />

              <IconButton
                uiTransform={{ height: buttonSize, width: buttonSize }}
                onMouseEnter={() => {
                  this.mapEnter()
                }}
                onMouseLeave={() => {
                  this.mapLeave()
                }}
                onMouseDown={() => {
                  this.uiController.menu?.show('map')
                }}
                backgroundColor={this.mapBackground}
                iconSrc={this.mapIcon}
                hintText={'Map'}
                showHint={this.mapHint}
              />

              <IconButton
                uiTransform={{ height: buttonSize, width: buttonSize }}
                onMouseEnter={() => {
                  this.backpackEnter()
                }}
                onMouseLeave={() => {
                  this.backpackLeave()
                }}
                onMouseDown={() => {
                  this.uiController.menu?.show('backpack')
                }}
                backgroundColor={this.backpackBackground}
                iconSrc={this.backpackIcon}
                hintText={'Backpack'}
                showHint={this.backpackHint}
              />

              <IconButton
                uiTransform={{ height: buttonSize, width: buttonSize }}
                onMouseEnter={() => {
                  this.settingsEnter()
                }}
                onMouseLeave={() => {
                  this.settingsLeave()
                }}
                onMouseDown={() => {
                  this.uiController.menu?.show('settings')
                }}
                backgroundColor={this.settingsBackground}
                iconSrc={this.settingsIcon}
                hintText={'Settings'}
                showHint={this.settingsHint}
              />

              <UiEntity
                uiTransform={{ height: 1, width: '80%' }}
                uiBackground={{ color: SELECTED_BUTTON_COLOR }}
              />

              <IconButton
                uiTransform={{ height: buttonSize, width: buttonSize }}
                onMouseEnter={() => {
                  this.helpEnter()
                }}
                onMouseLeave={() => {
                  this.helpLeave()
                }}
                onMouseDown={() => {
                  BevyApi.openSceneLogger().catch(console.error)
                  // openExternalUrl({ url: 'https://decentraland.org/help/' }).catch(console.error)
                  
                }}
                backgroundColor={this.helpBackground}
                iconSrc={this.helpIcon}
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
                iconSrc={this.cameraIcon}
                hintText={'Camera'}
                showHint={this.cameraHint} />

                <IconButton uiTransform={{height:buttonSize, width:buttonSize}} 
                onMouseEnter={()=>{this.experiencesEnter()}}
                onMouseLeave={()=>{this.experiencesLeave()}}
                onMouseDown={()=>{console.log('clicked')}}
                backgroundColor={this.experiencesBackground}
                iconSrc={this.experiencesIcon}
                hintText={'Experiences'}
                showHint={this.experiencesHint} />

                <IconButton uiTransform={{height:buttonSize, width:buttonSize}} 
                onMouseEnter={()=>{this.friendsEnter()}}
                onMouseLeave={()=>{this.friendsLeave()}}
                onMouseDown={()=>{console.log('Wallet clicked')}}
                backgroundColor={this.friendsBackground}
                iconSrc={this.friendsIcon}
                hintText={'Friends'}
                showHint={this.friendsHint} /> */}

              <IconButton
                uiTransform={{ height: buttonSize, width: buttonSize }}
                onMouseEnter={() => {
                  this.emotesEnter()
                }}
                onMouseLeave={() => {
                  this.emotesLeave()
                }}
                onMouseDown={() => {
                  console.log('clicked')
                }}
                backgroundColor={this.emotesBackground}
                iconSrc={this.emotesIcon}
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
