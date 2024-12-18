import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import IconButton from '../../components/iconButton'
import TextButton from '../../components/textButton'
import { type UIController } from '../../controllers/ui.controller'
import {
  RUBY,
  LEFT_PANEL_WIDTH_FACTOR,
  LEFT_PANEL_MIN_WIDTH,
  ALMOST_BLACK
} from '../../utils/constants'
import { type Invitation } from '../../utils/definitions'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'

export class InvitationPopUp {
  private readonly uiController: UIController
  public fontSize: number = 14
  invitation: Invitation | undefined
  closeBackground: Color4 | undefined
  confirmBackground: Color4 = RUBY
  rejectBackground: Color4 = Color4.Black()
  cancelBackground: Color4 = Color4.Black()
  profileBackground: Color4 | undefined = undefined
  profileHint: boolean = false

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  profileEnter(): void {
    this.profileBackground = { ...Color4.White(), a: 0.2 }
    this.profileHint = true
  }

  rejectEnter(): void {
    this.rejectBackground = { ...Color4.Black(), a: 0.8 }
  }

  rejectInvitation(): void {
    this.updateButtons()
    this.invitation = undefined
  }

  cancelEnter(): void {
    this.cancelBackground = { ...Color4.Black(), a: 0.8 }
  }

  cancelInvitation(): void {
    this.updateButtons()
    this.invitation = undefined
  }

  confirmEnter(): void {
    this.confirmBackground = { ...RUBY, a: 0.8 }
  }

  confirmInvitation(): void {
    this.updateButtons()
    this.invitation = undefined
  }

  updateButtons(): void {
    this.confirmBackground = RUBY
    this.rejectBackground = Color4.Black()
    this.cancelBackground = Color4.Black()
    this.closeBackground = undefined
    this.profileBackground = undefined
    this.profileHint = false
  }


  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    // console.log(this.invitation)
    if (canvasInfo === null) return null
    if (this.invitation === undefined) return null

    const player = getPlayer({ userId: this.invitation.id })
    const playerName = player?.avatar?.name ?? 'userId not found'
    const playerFound: boolean = player !== null

    let panelWidth: number

    if (canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR < LEFT_PANEL_MIN_WIDTH) {
      panelWidth = LEFT_PANEL_MIN_WIDTH
    } else {
      panelWidth = canvasInfo.width * LEFT_PANEL_WIDTH_FACTOR
    }

    let panelHeight: number

    if (canvasInfo.height * 0.2 < 250) {
      panelHeight = 250
    } else {
      panelHeight = canvasInfo.height * 0.2
    }

    return (
      <UiEntity
        uiTransform={{
          padding: {
            top: panelHeight * 0.05,
            bottom: panelHeight * 0.05,
            left: panelWidth * 0.1,
            right: panelWidth * 0.1
          },
          margin: { left: canvasInfo.width / 100 },
          positionType: 'absolute',
          position: { left: panelWidth, bottom: 0 },
          width: panelWidth,
          height: panelHeight,
          flexDirection: 'column',
          alignItems: 'center'
        }}
        uiBackground={{
          color: { ...Color4.Black(), a: 0.9 },
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
            width: panelWidth * 0.8,
            alignItems: 'center'
          }}
        >
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              flexGrow: 1,
              alignItems: 'center'
            }}
          >
            <Label
              uiTransform={{ width: '100%', height: this.fontSize }}
              value={this.invitation.date}
              color={{ ...Color4.White(), a: 0.2 }}
              fontSize={this.fontSize * 0.8}
              textAlign="middle-left"
            />
            <Label
              uiTransform={{ width: '100%', height: this.fontSize }}
              value={
                this.invitation.status === 'sent'
                  ? 'Friend request sent'
                  : 'Friend request received'
              }
              color={Color4.White()}
              fontSize={this.fontSize}
              textAlign="middle-left"
            />
          </UiEntity>
          <IconButton
            uiTransform={{
              height: 2 * this.fontSize,
              width: 2 * this.fontSize
            }}
            onMouseEnter={() => {
              this.closeBackground = ALMOST_BLACK
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            onMouseDown={() => {
              this.invitation = undefined
              this.updateButtons()
            }}
            backgroundColor={this.closeBackground}
            icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
          />
        </UiEntity>

        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: panelWidth * 0.8,
            margin: { top: this.fontSize, bottom: this.fontSize * 0.5 },
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <UiEntity
            uiTransform={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <UiEntity
              uiTransform={{
                width: this.fontSize * 2,
                height: this.fontSize * 2
              }}
              uiBackground={
                playerFound
                  ? { avatarTexture: { userId: this.invitation.id } }
                  : getBackgroundFromAtlas({
                      atlasName: 'icons',
                      spriteName: 'DdlIconColor'
                    })
              }
            />
            <Label
              value={playerName}
              color={Color4.White()}
              fontSize={this.fontSize * 1.2}
              textAlign="middle-left"
              uiTransform={{ height: this.fontSize * 1.2 }}
            />
          </UiEntity>
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
        </UiEntity>

        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: panelWidth * 0.8,
            height: panelHeight * 0.4,
            overflow: 'scroll'
          }}
          uiBackground={{
            color: { ...Color4.White(), a: 0.01 },
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
            uiTransform={{
              padding: {
                right: this.fontSize,
                left: this.fontSize * 0.5,
                top: this.fontSize * 0.5,
                bottom: this.fontSize * 0.5
              }
            }}
            value={this.invitation.message}
            color={Color4.White()}
            fontSize={this.fontSize}
            textAlign="middle-left"
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            display: this.invitation.status === 'received' ? 'flex' : 'none',

            flexDirection: 'row',
            alignItems: 'center',
            width: panelWidth * 0.8,
            justifyContent: 'space-between',
            flexGrow: 1
          }}
        >
          <TextButton
            uiTransform={{
              width: '47.5%',
              height: 'auto'
            }}
            onMouseDown={() => {
              this.rejectInvitation()
            }}
            onMouseEnter={() => {
              this.rejectEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            backgroundColor={this.rejectBackground}
            value={'REJECT'}
            fontSize={this.fontSize * 0.8}
          />
          <TextButton
            uiTransform={{
              width: '47.5%',
              height: 'auto'
            }}
            onMouseDown={() => {
              this.confirmInvitation()
            }}
            onMouseEnter={() => {
              this.confirmEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            backgroundColor={this.confirmBackground}
            value={'CONFIRM'}
            fontSize={this.fontSize * 0.8}
          />
        </UiEntity>
        <UiEntity
          uiTransform={{
            display: this.invitation.status === 'sent' ? 'flex' : 'none',
            flexDirection: 'row',
            alignItems: 'center',
            width: panelWidth * 0.8,
            justifyContent: 'space-between',
            flexGrow: 1
          }}
        >
          <TextButton
            uiTransform={{
              width: '100%',
              height: 'auto'
            }}
            onMouseDown={() => {
              this.cancelInvitation()
            }}
            onMouseEnter={() => {
              this.cancelEnter()
            }}
            onMouseLeave={() => {
              this.updateButtons()
            }}
            backgroundColor={this.cancelBackground}
            value={'CANCEL INVITATION'}
            fontSize={this.fontSize * 0.8}
          />
        </UiEntity>
      </UiEntity>
    )
  }
}
