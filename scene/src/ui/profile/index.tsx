import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import TextButton from '../../components/textButton'
import TextIconButton from '../../components/textIconButton'
import { ALMOST_WHITE, RUBY } from '../../utils/constants'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { type UIController } from '../../controllers/ui.controller'
import Canvas from '../canvas/canvas'

export class Profile {
  private readonly name: string = 'BevyUser'
  private readonly tag: string = '#1234'
  private readonly verified: boolean = true
  private readonly wallet: string = '0x10e...a7a92'
  private isCardOpen: boolean = false
  private isProfileOpen: boolean = false
  public fontSize: number = 16
  private readonly uiController: UIController

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  hideProfile(): void {
    this.isProfileOpen = false
  }

  hideCard(): void {
    this.isCardOpen = false
  }

  showProfile(): void {
    this.isProfileOpen = true
  }

  showCard(): void {
    this.isCardOpen = true
    this.uiController.isProfileVisible = true
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const rightMarginIfMenuVisible: number = Math.max(canvasInfo.height * 0.024, 46) * 2 + 10
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            pointerFilter: 'block'
          }}
          uiBackground={{
            color: {...Color4.Black(), a:0.2}
          }}
          onMouseDown={() => {
            this.uiController.isProfileVisible = false
          }}
        >
          {/* CARD */}

          {this.isCardOpen && (
            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 15,
                positionType: 'absolute',
                position: this.uiController.isMainMenuVisible ? {top:'9%',right:rightMarginIfMenuVisible} : {top:300,left:'3%'},
                width: 300,
                height: 'auto',
                pointerFilter: 'block'
              }}
              onMouseDown={() => {}}
              uiBackground={{
                texture: { src: 'assets/images/backgrounds/roundedTop.png' },
                color: Color4.create(0.01, 0.01, 0.01, 1),
                textureMode: 'nine-slices',
                textureSlices: {
                  top: 0.42,
                  bottom: 0.42,
                  left: 0.42,
                  right: 0.42
                }
              }}
            >
              {/* AVATAR HEAD */}

              <UiEntity
                uiTransform={{
                  width: 3 * this.fontSize,
                  height: 3 * this.fontSize
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
              <UiEntity
                uiTransform={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {/* Name */}
                <UiEntity
                  uiTransform={{
                    width: 'auto',
                    height: 'auto'
                  }}
                  uiText={{
                    value: this.name,
                    fontSize: this.fontSize,
                    color: {...Color4.create(0, 124/255, 176/255 ,1)},
                    textAlign: 'middle-right'
                  }}
                />
                <UiEntity
                  uiTransform={{
                    width: 'auto',
                    height: 'auto'
                  }}
                  uiText={{
                    value: this.tag,
                    fontSize: this.fontSize,
                    color: { ...ALMOST_WHITE, a: 0.5 },
                    textAlign: 'middle-left'
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
              <UiEntity
                uiTransform={{
                  width: 'auto',
                  height: this.fontSize
                }}
                uiText={{
                  value: 'WALLET ADDRESS',
                  fontSize: this.fontSize,
                  color: { ...ALMOST_WHITE, a: 0.5 },
                  textAlign: 'middle-left'
                }}
              />
              <UiEntity
                uiTransform={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {/* Address */}
                <UiEntity
                  uiTransform={{
                    width: 'auto',
                    height: 'auto'
                  }}
                  uiText={{
                    value: '0x10e...a7a92',
                    fontSize: this.fontSize,
                    color: ALMOST_WHITE,
                    textAlign: 'middle-left'
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
                      spriteName: 'CopyIcon'
                    })}
                  />
                )}
              </UiEntity>
              <TextButton
                onMouseDown={() => {}}
                uiTransform={{ width: '90%', height: this.fontSize * 3 }}
                value={'MY PROFILE'}
                fontSize={this.fontSize}
                backgroundColor={{ ...ALMOST_WHITE, a: 0.1 }}
              />
              <UiEntity
                uiTransform={{ margin: '5%', width: '100%', height: 1 }}
                uiBackground={{ color: { ...Color4.White(), a: 0.1 } }}
              />
              <TextIconButton
                onMouseDown={() => {}}
                uiTransform={{
                  width: '90%',
                  height: this.fontSize * 3,
                  justifyContent: 'flex-start'
                }}
                value={'SIGN OUT'}
                fontSize={this.fontSize}
                icon={{
                  atlasName: 'icons',
                  spriteName: 'LogoutIcon'
                }}
              />
              <TextIconButton
                onMouseDown={() => {}}
                uiTransform={{
                  width: '90%',
                  height: this.fontSize * 3,
                  justifyContent: 'flex-start'
                }}
                value={'EXIT'}
                fontSize={this.fontSize}
                icon={{
                  atlasName: 'icons',
                  spriteName: 'ExitIcn'
                }}
                fontColor={Color4.Red()}
                iconColor={Color4.Red()}
              />

              <UiEntity
                uiTransform={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 1.5 * this.fontSize,
                  positionType: 'absolute',
                  position: { bottom: -0.9 * this.fontSize }
                }}
                uiBackground={{
                  texture: {
                    src: 'assets/images/backgrounds/roundedBottom.png'
                  },
                  color: Color4.Black(),
                  textureMode: 'nine-slices',
                  textureSlices: {
                    top: 0.42,
                    bottom: 0.42,
                    left: 0.42,
                    right: 0.42
                  }
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: '50%',
                    height: 'auto'
                  }}
                  uiText={{
                    value: 'Terms of Service',
                    fontSize: this.fontSize * 0.75,
                    color: { ...ALMOST_WHITE, a: 0.5 },
                    textAlign: 'middle-center'
                  }}
                />
                <UiEntity
                  uiTransform={{
                    width: '50%',
                    height: 'auto'
                  }}
                  uiText={{
                    value: 'Privacy Policy',
                    fontSize: this.fontSize * 0.75,
                    color: { ...ALMOST_WHITE, a: 0.5 },
                    textAlign: 'middle-center'
                  }}
                />
              </UiEntity>
            </UiEntity>
          )}

          {/* PROFILE */}
          {this.isProfileOpen && (
            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',

                width: '50%',
                height: '70%',
                pointerFilter: 'block'
              }}
              uiBackground={{
                texture: { src: 'assets/images/backgrounds/roundedp.png' },
                color: Color4.Red(),
                textureMode: 'nine-slices',
                textureSlices: {
                  top: 0.5,
                  bottom: 0.5,
                  left: 0.5,
                  right: 0.5
                }
              }}
            ></UiEntity>
          )}
        </UiEntity>
      </Canvas>
    )
  }
}
