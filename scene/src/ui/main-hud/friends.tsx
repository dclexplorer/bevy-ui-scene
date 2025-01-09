import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
// import IconButton from '../../components/iconButton'
import FriendItem from '../../components/friendItem'
import IconButton from '../../components/button-icon/iconButton'
import InvitationItem from '../../components/invitationItem'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_WHITE,
  ALPHA_BLACK_PANEL,
  LEFT_PANEL_MIN_WIDTH,
  LEFT_PANEL_WIDTH_FACTOR,
  SELECTED_BUTTON_COLOR,
  TEST_FRIENDS,
  TEST_INVITATIONS,
  UNSELECTED_TEXT_WHITE
} from '../../utils/constants'
import {
  type Friend,
  type Icon,
  type Invitation
} from '../../utils/definitions'
import { getBackgroundFromAtlas, getName } from '../../utils/ui-utils'
import { InvitationPopUp } from './invitationPopUp'

export class Friends {
  private readonly uiController: UIController
  private readonly invitationPopUp: InvitationPopUp

  public fontSize: number = 14
  private selectedId: string | undefined

  private readonly friendsIcon: Icon = {
    atlasName: 'navbar',
    spriteName: 'Friends off'
  }

  public buttonClicked: 'requests' | 'friends' = 'friends'
  private friendsTextColor: Color4 = ALMOST_WHITE
  private requestsTextColor: Color4 = UNSELECTED_TEXT_WHITE
  private readonly friendsList: Friend[] = TEST_FRIENDS
  private readonly invitationsList: Invitation[] = TEST_INVITATIONS
  public requestsNumber: number = TEST_INVITATIONS.filter(
    (invitation) => invitation.status === 'received'
  ).length

  public incomingFriendsMessages: number = 1

  private isOnlineOpen: boolean = false
  private isOfflineOpen: boolean = false
  private isReceivedOpen: boolean = false
  private isSentOpen: boolean = false
  messageBackground: Color4 | undefined
  messageHint: boolean = false
  profileBackground: Color4 | undefined
  profileHint: boolean = false
  unfriendBackground: Color4 | undefined
  unfriendHint: boolean = false
  blockBackground: Color4 | undefined
  blockHint: boolean = false

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.invitationPopUp = new InvitationPopUp(uiController)
  }

  setButtonClicked(button: 'requests' | 'friends'): void {
    this.buttonClicked = button
    this.selectedId = undefined
    this.invitationPopUp.invitation = undefined
    this.updateButtons()
  }

  friendsTabEnter(): void {
    this.friendsTextColor = ALMOST_WHITE
  }

  requestsTabEnter(): void {
    this.requestsTextColor = ALMOST_WHITE
  }

  updateButtons(): void {
    this.requestsTextColor = UNSELECTED_TEXT_WHITE
    this.friendsTextColor = UNSELECTED_TEXT_WHITE
    this.friendsIcon.spriteName = 'Friends off'

    this.messageBackground = undefined
    this.profileBackground = undefined
    this.unfriendBackground = undefined
    this.blockBackground = undefined

    this.messageHint = false
    this.profileHint = false
    this.unfriendHint = false
    this.blockHint = false

    switch (this.buttonClicked) {
      case 'friends':
        this.friendsTabEnter()
        break
      case 'requests':
        this.requestsTabEnter()
        break
    }
  }

  messageEnter(): void {
    this.messageBackground = SELECTED_BUTTON_COLOR
    this.messageHint = true
  }

  profileEnter(): void {
    this.profileBackground = SELECTED_BUTTON_COLOR
    this.profileHint = true
  }

  profileDown(): void {
    this.uiController.profile.showCard()
  }

  unfriendEnter(): void {
    this.unfriendBackground = SELECTED_BUTTON_COLOR
    this.unfriendHint = true
  }

  unfriendDown(): void {
    this.uiController.actionPopUp.show()
    this.uiController.actionPopUp.action = () => {
      console.log('unfriend')
    }
    this.uiController.actionPopUp.message = `Are you sure you want to unfriend ${getName(
      this.selectedId ?? ''
    )}?`
  }

  messageDown(): void {
    this.uiController.mainHud.openCloseChat()
  }

  blockDown(): void {
    this.uiController.actionPopUp.show()
    this.uiController.actionPopUp.action = () => {
      console.log('block')
    }
    this.uiController.actionPopUp.message = `Are you sure you want to unfriend and block ${getName(
      this.selectedId ?? ''
    )}?`
  }

  blockEnter(): void {
    this.blockBackground = SELECTED_BUTTON_COLOR
    this.blockHint = true
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    let panelWidth: number

    if (canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR < LEFT_PANEL_MIN_WIDTH) {
      panelWidth = LEFT_PANEL_MIN_WIDTH
    } else {
      panelWidth = canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR
    }

    let panelHeight: number

    if (canvasInfo.height * 0.4 < 250) {
      panelHeight = 250
    } else {
      panelHeight = canvasInfo.height * 0.4
    }

    return (
      <UiEntity
        uiTransform={{
          width: panelWidth,
          height: panelHeight,
          padding: { right: panelWidth * 0.05, left: panelWidth * 0.05 },
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'column'
        }}
        uiBackground={{
          color: ALPHA_BLACK_PANEL,
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
            width: '100%',
            height: panelHeight * 0.1
          }}
        >
          <UiEntity
            uiTransform={{
              width: '50%',
              flexDirection: 'row',
              justifyContent: 'center'
            }}
            onMouseEnter={() => {
              this.friendsTabEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.setButtonClicked('friends')
            }}
          >
            <UiEntity
              uiTransform={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Label
                value={'FRIENDS'}
                color={this.friendsTextColor}
                fontSize={this.fontSize}
                textAlign="middle-right"
              />
              <UiEntity
                uiTransform={{
                  width: this.fontSize,
                  height: this.fontSize,
                  display: this.incomingFriendsMessages > 0 ? 'flex' : 'none'
                }}
                uiBackground={{
                  color: { ...Color4.Red(), a: 1 },
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
                <Label
                  uiTransform={{ height: '100%', width: '100%' }}
                  value={this.incomingFriendsMessages.toString()}
                  color={ALMOST_WHITE}
                  fontSize={this.fontSize * 0.8}
                  textAlign="middle-center"
                />
              </UiEntity>
            </UiEntity>
          </UiEntity>

          <UiEntity
            uiTransform={{
              width: '50%',
              margin: 0,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={() => {
              this.requestsTabEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.setButtonClicked('requests')
              this.selectedId = undefined
            }}
          >
            <Label
              value={'REQUESTS'}
              color={this.requestsTextColor}
              fontSize={this.fontSize}
            />
            <UiEntity
              uiTransform={{
                width: this.fontSize,
                height: this.fontSize,
                display: this.requestsNumber > 0 ? 'flex' : 'none'
              }}
              uiBackground={{
                color: { ...Color4.Red(), a: 1 },
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
              <Label
                uiTransform={{ height: '100%', width: '100%' }}
                value={this.requestsNumber.toString()}
                color={ALMOST_WHITE}
                fontSize={this.fontSize * 0.8}
                textAlign="middle-center"
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>

        {/* FRIENDS */}
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
              height: panelHeight * 0.06
            }}
            onMouseDown={() => {
              this.isOnlineOpen = !this.isOnlineOpen
            }}
          >
            <Label
              value={
                'ONLINE (' +
                this.friendsList
                  .filter((friend) => friend.status === 'online')
                  .length.toString() +
                ')'
              }
              color={ALMOST_WHITE}
            />
            <UiEntity
              uiTransform={{
                width: this.fontSize,
                height: this.fontSize
              }}
              uiBackground={{
                ...getBackgroundFromAtlas({
                  atlasName: 'icons',
                  spriteName: this.isOnlineOpen ? 'UpArrow' : 'DownArrow'
                }),
                color: ALMOST_WHITE
              }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              display: this.isOnlineOpen ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              height: 'auto',
              maxHeight: this.isOfflineOpen
                ? panelHeight * 0.375
                : panelHeight * 0.75,
              // maxHeight: this.isOfflineOpen? '35%' : '70%',
              overflow: 'scroll'
            }}
          >
            {this.friendsList
              .filter((friend) => friend.status === 'online')
              .map((friend) => (
                <FriendItem
                  fontSize={this.fontSize}
                  uiTransform={{ width: '85%', height: 3 * this.fontSize }}
                  userId={friend.id}
                  backgroundColor={
                    this.selectedId === friend.id
                      ? { ...Color4.White(), a: 0.08 }
                      : undefined
                  }
                  onMouseDown={() => {
                    if (this.selectedId !== friend.id) {
                      this.selectedId = friend.id
                    } else {
                      this.selectedId = undefined
                    }
                  }}
                />
              ))}
          </UiEntity>

          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: panelHeight * 0.06
            }}
            onMouseDown={() => {
              this.isOfflineOpen = !this.isOfflineOpen
            }}
          >
            <Label
              value={
                'OFFLINE (' +
                this.friendsList
                  .filter((friend) => friend.status === 'offline')
                  .length.toString() +
                ')'
              }
              color={ALMOST_WHITE}
            />
            <UiEntity
              uiTransform={{
                width: this.fontSize,
                height: this.fontSize
              }}
              uiBackground={{
                ...getBackgroundFromAtlas({
                  atlasName: 'icons',
                  spriteName: this.isOfflineOpen ? 'UpArrow' : 'DownArrow'
                }),
                color: ALMOST_WHITE
              }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              display: this.isOfflineOpen ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              overflow: 'scroll',
              maxHeight: this.isOnlineOpen
                ? panelHeight * 0.375
                : panelHeight * 0.75
            }}
          >
            {this.friendsList
              .filter((friend) => friend.status === 'offline')
              .map((friend) => (
                <FriendItem
                  fontSize={this.fontSize}
                  userId={friend.id}
                  uiTransform={{ width: '85%', height: 3 * this.fontSize }}
                  backgroundColor={
                    this.selectedId === friend.id
                      ? { ...Color4.White(), a: 0.08 }
                      : undefined
                  }
                  onMouseDown={() => {
                    if (this.selectedId !== friend.id) {
                      this.selectedId = friend.id
                    } else {
                      this.selectedId = undefined
                    }
                  }}
                />
              ))}
          </UiEntity>
        </UiEntity>

        {/* REQUESTS */}
        <UiEntity
          uiTransform={{
            display: this.buttonClicked === 'requests' ? 'flex' : 'none',
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
              height: panelHeight * 0.06
            }}
            onMouseDown={() => {
              this.isReceivedOpen = !this.isReceivedOpen
            }}
          >
            <Label
              value={
                'RECEIVED (' +
                this.invitationsList
                  .filter((invitation) => invitation.status === 'received')
                  .length.toString() +
                ')'
              }
              color={ALMOST_WHITE}
            />
            <UiEntity
              uiTransform={{
                width: this.fontSize,
                height: this.fontSize
              }}
              uiBackground={{
                ...getBackgroundFromAtlas({
                  atlasName: 'icons',
                  spriteName: this.isReceivedOpen ? 'UpArrow' : 'DownArrow'
                }),
                color: ALMOST_WHITE
              }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              display: this.isReceivedOpen ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              height: 'auto',
              maxHeight: this.isSentOpen
                ? panelHeight * 0.375
                : panelHeight * 0.75,
              // maxHeight: this.isOfflineOpen? '35%' : '70%',
              overflow: 'scroll'
            }}
          >
            {this.invitationsList
              .filter((invitation) => invitation.status === 'received')
              .map((invitation) => (
                <InvitationItem
                  invitation={invitation}
                  fontSize={this.fontSize}
                  uiTransform={{ width: '85%', height: 3 * this.fontSize }}
                  onMouseDown={() => {
                    if (this.invitationPopUp.invitation !== invitation) {
                      this.invitationPopUp.invitation = invitation
                    } else {
                      this.invitationPopUp.invitation = undefined
                    }
                  }}
                  backgroundColor={
                    this.invitationPopUp.invitation === invitation
                      ? { ...Color4.White(), a: 0.08 }
                      : undefined
                  }
                />
              ))}
          </UiEntity>

          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: panelHeight * 0.06
            }}
            onMouseDown={() => {
              this.isSentOpen = !this.isSentOpen
            }}
          >
            <Label
              value={
                'SENT (' +
                this.invitationsList
                  .filter((invitation) => invitation.status === 'sent')
                  .length.toString() +
                ')'
              }
              color={ALMOST_WHITE}
            />
            <UiEntity
              uiTransform={{
                width: this.fontSize,
                height: this.fontSize
              }}
              uiBackground={{
                ...getBackgroundFromAtlas({
                  atlasName: 'icons',
                  spriteName: this.isSentOpen ? 'UpArrow' : 'DownArrow'
                }),
                color: ALMOST_WHITE
              }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              display: this.isSentOpen ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              overflow: 'scroll',
              maxHeight: this.isReceivedOpen
                ? panelHeight * 0.375
                : panelHeight * 0.75
            }}
            // uiBackground={{ color: Color4.Red() }}
          >
            {this.invitationsList
              .filter((invitation) => invitation.status === 'sent')
              .map((invitation) => (
                <InvitationItem
                  invitation={invitation}
                  fontSize={this.fontSize}
                  uiTransform={{ width: '85%', height: 3 * this.fontSize }}
                  onMouseDown={() => {
                    if (this.invitationPopUp.invitation !== invitation) {
                      this.invitationPopUp.invitation = invitation
                    } else {
                      this.invitationPopUp.invitation = undefined
                    }
                  }}
                  backgroundColor={
                    this.invitationPopUp.invitation === invitation
                      ? { ...Color4.White(), a: 0.08 }
                      : undefined
                  }
                />
              ))}
          </UiEntity>
        </UiEntity>

        <UiEntity
          uiTransform={{
            display: this.selectedId !== undefined ? 'flex' : 'none',
            padding: 5,
            positionType: 'absolute',
            position: { left: panelWidth, top: panelHeight * 0.1 },
            width: 'auto',
            height: 'auto',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          uiBackground={{
            color: ALPHA_BLACK_PANEL,
            textureMode: 'nine-slices',
            texture: {
              src: 'assets/images/backgrounds/roundedRight.png'
            },
            textureSlices: {
              top: 0.5,
              bottom: 0.5,
              left: 0.5,
              right: 0.5
            }
          }}
        >
          <IconButton
            uiTransform={{
              margin: 2,
              height: 2 * this.fontSize,
              width: 2 * this.fontSize
            }}
            onMouseEnter={() => {
              this.messageEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.messageDown()
            }}
            backgroundColor={this.messageBackground}
            icon={{ atlasName: 'context', spriteName: 'Chat' }}
            hintText={'Message'}
            showHint={this.messageHint}
          />
          <IconButton
            uiTransform={{
              margin: { top: 5, bottom: 5 },
              height: 2 * this.fontSize,
              width: 2 * this.fontSize
            }}
            onMouseEnter={() => {
              this.profileEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.uiController.profile.showProfile()
            }}
            backgroundColor={this.profileBackground}
            icon={{ atlasName: 'context', spriteName: 'Passport' }}
            hintText={'View Profile'}
            showHint={this.profileHint}
          />
          <IconButton
            uiTransform={{
              margin: { top: 5, bottom: 5 },
              height: 2 * this.fontSize,
              width: 2 * this.fontSize
            }}
            onMouseEnter={() => {
              this.unfriendEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.unfriendDown()
            }}
            backgroundColor={this.unfriendBackground}
            icon={{ atlasName: 'context', spriteName: 'Unfriends' }}
            hintText={'Unfriend'}
            showHint={this.unfriendHint}
          />
          <IconButton
            uiTransform={{
              margin: { top: 5, bottom: 5 },
              height: 2 * this.fontSize,
              width: 2 * this.fontSize
            }}
            onMouseEnter={() => {
              this.blockEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.blockDown()
            }}
            backgroundColor={this.blockBackground}
            icon={{ atlasName: 'context', spriteName: 'Block' }}
            hintText={'Block'}
            showHint={this.blockHint}
          />
        </UiEntity>
        {this.invitationPopUp.mainUi()}
      </UiEntity>
    )
  }
}
