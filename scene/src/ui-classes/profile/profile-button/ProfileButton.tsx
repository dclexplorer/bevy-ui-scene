import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import {ALMOST_WHITE, ROUNDED_TEXTURE_BACKGROUND, RUBY} from '../../../utils/constants'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import { type UIController } from '../../../controllers/ui.controller'

export default class ProfileButton {
  private readonly name: string = 'BevyUser'
  private readonly verified: boolean = true
  private readonly wallet: string = '0x10e...a7a92'
  public fontSize: number = 16
  private readonly uiController: UIController

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  showProfileCard(): void {
    this.uiController.isProfileVisible = true
    this.uiController.profile.showCard()
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: 'auto',
          height: 'auto',
          margin: { right: 10 }
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: { right: 10 }
          }}
          onMouseDown={() => {
            this.showProfileCard()
          }}
          uiBackground={{
              ...ROUNDED_TEXTURE_BACKGROUND,
            color: { ...ALMOST_WHITE, a: 0.5 }
          }}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        >
          {/* AVATAR HEAD */}

          <UiEntity
            uiTransform={{
              width: 2 * this.fontSize,
              height: 2 * this.fontSize,
              margin: 5
            }}
            uiBackground={{
              color: RUBY,
              textureMode: 'nine-slices',
              texture: {
                src: 'assets/images/backgrounds/rounded.png'
              },
              textureSlices: {
                top: 0.25,
                bottom: 0.25,
                left: 0.25,
                right: 0.25
              }
            }}
          />

          {/* NAME */}
          <UiEntity
            uiTransform={{
              width: 'auto',
              height: 'auto'
            }}
            uiText={{
              value: this.name,
              fontSize: this.fontSize,
              color: ALMOST_WHITE,
              textAlign: 'middle-center'
            }}
          />
          {/* VERIFIED ICON */}
          {this.verified && (
            <UiEntity
              uiTransform={{
                width: this.fontSize,
                height: this.fontSize
              }}
              uiBackground={getBackgroundFromAtlas({
                atlasName: 'icons',
                spriteName: 'Verified'
              })}
            />
          )}
        </UiEntity>
      </UiEntity>
    )
  }
}
