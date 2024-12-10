import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
// import IconButton from '../../components/iconButton'
import TextButton from '../../components/textButton'
import { type UIController } from '../../controllers/ui.controller'
import { ALMOST_BLACK, ALMOST_WHITE, TEST_FRIENDS } from '../../utils/constants'
import { type Friend, type Icon } from '../../utils/definitions'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'

export class Friends {
  private readonly uiController: UIController
  public fontSize: number = 14

  private readonly friendsIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Friends off'
  }

  public buttonClicked: 'pending' | 'friends' = 'friends'
  private friendsTextColor: Color4 = ALMOST_WHITE
  private pendingTextColor: Color4 = ALMOST_BLACK
  private readonly friendsList: Friend[] = TEST_FRIENDS

  private isOnlineOpen: boolean = false
  private isOfflineOpen: boolean = false

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  setButtonClicked(button: 'pending' | 'friends'): void {
    this.buttonClicked = button
    this.updateButtons()
  }

  friendsTabEnter(): void {
    this.friendsTextColor = ALMOST_WHITE
  }

  pendingTabEnter(): void {
    this.pendingTextColor = ALMOST_WHITE
  }

  updateButtons(): void {
    this.pendingTextColor = ALMOST_BLACK
    this.friendsTextColor = ALMOST_BLACK
    this.friendsIcon.spriteName = 'Friends off'

    switch (this.buttonClicked) {
      case 'friends':
        this.friendsTabEnter()
        break
      case 'pending':
        this.pendingTabEnter()
        break
    }
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    let panelWidth: number

    if (canvasInfo.width * 0.15 < 250) {
      panelWidth = 250
    } else {
      panelWidth = canvasInfo.width * 0.15
    }

    return (
      <UiEntity
        uiTransform={{
          width: panelWidth,
          minWidth: 250,
          height: 250,
          // maxHeight: canvasInfo.height * 0.4,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column'
        }}
        uiBackground={{
          color: { ...Color4.Black(), a: 0.05 },
          textureMode: 'nine-slices',
          texture: {
            src: 'assets/images/backgrounds/rounded.png'
          },
          textureSlices: {
            top: 0.5,
            bottom: 0.5,
            left: 0.5,
            right: 0.5
          }
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <TextButton
            uiTransform={{
              width: '50%',
              margin: 0
            }}
            value={'Friends'}
            fontSize={14}
            fontColor={this.friendsTextColor}
            onMouseEnter={() => {
              this.friendsTabEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.setButtonClicked('friends')
            }}
          />
          <TextButton
            uiTransform={{
              width: '50%',
              margin: 0
            }}
            value={'Invitations'}
            fontSize={14}
            fontColor={this.pendingTextColor}
            onMouseEnter={() => {
              this.pendingTabEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.setButtonClicked('pending')
            }}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            display: this.buttonClicked === 'pending' ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: 'auto'
          }}
        ></UiEntity>
        <UiEntity
          uiTransform={{
            display: this.buttonClicked === 'friends' ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: 'auto'
          }}
        >
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 'auto'
            }}
            onMouseDown={() => {
              this.isOnlineOpen = !this.isOnlineOpen
            }}
            uiBackground={{color:ALMOST_WHITE}}
          >
            <Label
              value={
                'ONLINE (' +
                this.friendsList
                  .filter((friend) => friend.status === 'online')
                  .length.toString() +
                ')'
              }
              fontSize={this.fontSize}
              color={ALMOST_BLACK}

            />
            <UiEntity
              uiTransform={{
                width: this.fontSize,
                height: this.fontSize
              }}
              uiBackground={{...getBackgroundFromAtlas({
                atlasName: 'icons',
                spriteName: this.isOnlineOpen ? 'UpArrow' : 'DownArrow'
              }), color: ALMOST_BLACK}}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              display:this.isOnlineOpen?'flex':'none',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 'auto',
              overflow:'scroll'
            }}
            
            uiBackground={{color:Color4.Red()}}
          >
            {this.friendsList.filter((friend) => friend.status === 'online').map((friend) => <Label value={friend.name} /> )}
           
          </UiEntity>

          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: 'auto'
            }}
            onMouseDown={() => {
              this.isOfflineOpen = !this.isOfflineOpen
            }}
            uiBackground={{color:ALMOST_WHITE}}
          >
            <Label
              value={
                'OFFLINE (' +
                this.friendsList
                  .filter((friend) => friend.status === 'offline')
                  .length.toString() +
                ')'
              }
              fontSize={this.fontSize}
              color={ALMOST_BLACK}
            />
            <UiEntity
              uiTransform={{
                width: this.fontSize,
                height: this.fontSize
              }}
              uiBackground={{...getBackgroundFromAtlas({
                atlasName: 'icons',
                spriteName: this.isOfflineOpen ? 'UpArrow' : 'DownArrow'
              }), color: ALMOST_BLACK}}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              display:this.isOfflineOpen?'flex':'none',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              flexShrink: 1,
              overflow:'scroll'
            }}
            
            uiBackground={{color:Color4.Red()}}
          >
            {this.friendsList.filter((friend) => friend.status === 'offline').map((friend) => <Label value={friend.name} /> )}
           
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
