import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import Canvas from '../canvas/canvas'
import { type UIController } from '../../controllers/ui.controller'
import IconButton from '../../components/iconButton'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
// import { openExternalUrl } from '~system/RestrictedActions'
import { BevyApi } from '../../bevy-api'

const SELECTED_BUTTON_COLOR: Color4 = { ...Color4.Gray(), a: 0.3 }

export class MainHud {
  private readonly isSideBarVisible: boolean = true
  private readonly uiController: UIController
  private bellIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Notifications off.png'}
  private backpackIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Backpack off.png'}
  private walletIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Wallet.png'}
  private mapIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Map off.png'}
  private settingsIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Settings off.png'}
  private helpIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'HelpIcon Off.png'}
  // private friendsIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Friends off.png'}
  // private cameraIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Camera Off.png'}
  // private experiencesIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'ExperienceIconOff.png'}
  private emotesIcon: {atlasName:string, spriteName:string} = {atlasName:'navbar',  spriteName:'Emote off.png'}

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
    this.walletIcon.spriteName = 'Wallet on.png'
    this.walletBackground = SELECTED_BUTTON_COLOR
    this.walletHint = true    
  }

  walletLeave(): void {
    this.updateButtons()    
  }

  notificationsEnter(): void {
    this.bellIcon.spriteName ='Notifications on.png'
    this.bellBackground = SELECTED_BUTTON_COLOR
    this.bellHint = true    
  }

  notificationsLeave(): void {
    this.updateButtons()    
  }

  mapEnter(): void {
    this.mapIcon.spriteName ='Map on.png'
    this.mapBackground = SELECTED_BUTTON_COLOR
    this.mapHint = true    
  }

  mapLeave(): void {
    this.updateButtons()    
  }

  backpackEnter(): void {
    this.backpackIcon.spriteName ='Backpack on.png'
    this.backpackBackground = SELECTED_BUTTON_COLOR
    this.backpackHint = true    
  }

  backpackLeave(): void {
    this.updateButtons()    
  }

  settingsEnter(): void {
    this.settingsIcon.spriteName ='Settings on.png'
    this.settingsBackground = SELECTED_BUTTON_COLOR
    this.settingsHint = true    
  }

  settingsLeave(): void {
    this.updateButtons()    
  }

  helpEnter(): void {
    this.helpIcon.spriteName ='HelpIcon On.png'
    this.helpBackground = SELECTED_BUTTON_COLOR
    this.helpHint = true    
  }

  helpLeave(): void {
    this.updateButtons()    
  }

  emotesEnter(): void {
    this.emotesIcon.spriteName = 'Emote on.png'
    this.emotesBackground = SELECTED_BUTTON_COLOR
    this.emotesHint = true    
  }

  emotesLeave(): void {
    this.updateButtons()    
  }

  updateButtons(): void {
    this.walletIcon.spriteName ='Wallet.png'
    this.walletBackground = Color4.create(0, 0, 0, 0)
    this.walletHint = false
    this.bellIcon.spriteName ='Notifications off.png'
    this.bellBackground = Color4.create(0, 0, 0, 0)
    this.bellHint = false
    this.mapIcon.spriteName ='Map off.png'
    this.mapBackground = Color4.create(0, 0, 0, 0)
    this.mapHint = false
    this.backpackIcon.spriteName ='Backpack off.png'
    this.backpackBackground = Color4.create(0, 0, 0, 0)
    this.backpackHint = false
    this.settingsIcon.spriteName ='Settings off.png'
    this.settingsBackground = Color4.create(0, 0, 0, 0)
    this.settingsHint = false
    this.helpIcon.spriteName ='HelpIcon Off.png'
    this.helpBackground = Color4.create(0, 0, 0, 0)
    this.helpHint = false
    this.emotesIcon.spriteName = 'Emote off.png'
    this.emotesBackground = Color4.create(0, 0, 0, 0)
    this.emotesHint = false
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
                icon={this.walletIcon}
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
                icon={this.bellIcon}
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
                icon={this.mapIcon}
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
                icon={this.backpackIcon}
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
                icon={this.settingsIcon}
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
                onMouseLeave={()=>{this.experiencesLeave()}}
                onMouseDown={()=>{console.log('clicked')}}
                backgroundColor={this.experiencesBackground}
                icon={this.experiencesIcon}
                hintText={'Experiences'}
                showHint={this.experiencesHint} />

                <IconButton uiTransform={{height:buttonSize, width:buttonSize}} 
                onMouseEnter={()=>{this.friendsEnter()}}
                onMouseLeave={()=>{this.friendsLeave()}}
                onMouseDown={()=>{console.log('Wallet clicked')}}
                backgroundColor={this.friendsBackground}
                icon={this.friendsIcon}
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
