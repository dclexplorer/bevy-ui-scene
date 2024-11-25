import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import IconButton from '../../components/iconButton'
import TextButton from '../../components/textButton'
import TextIconButton from '../../components/textIconButton'
import { type UIController } from '../../controllers/ui.controller'
import { ALMOST_BLACK, ALMOST_WHITE, ORANGE, RUBY } from '../../utils/constants'
import { getBackgroundFromAtlas } from '../../utils/ui-utils'
import Canvas from '../canvas/canvas'
import { Label } from '@dcl/react-ecs/dist/components/Label'
import ChipButton from '../../components/chipButton'

export class Profile {
  private readonly isMyProfile: boolean = true
  private readonly statusIconSprite: string =
    'assets/images/passport/Online.png'

  private readonly name: string = 'BevyUser'
  private readonly tag: string = '#1234'
  private readonly verified: boolean = true
  private readonly wallet: string = '0x10e...a7a92'
  private isCardOpen: boolean = false
  private isProfileOpen: boolean = true
  public fontSize: number = 16
  private readonly uiController: UIController
  private closeButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
  private overviewBackground: Color4 = ORANGE
  private overviewText: Color4 = ALMOST_WHITE
  private badgesBackground: Color4 = ALMOST_WHITE
  private badgesText: Color4 = ALMOST_BLACK
  private activePage: 'overview' | 'badges' = 'overview'
  private editInfoButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
  private editLinksButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
  private readonly links: Array<{ name: string; url: string }> = [
    { name: 'DCL Explorers', url: 'https://dclexplorer.com' }, { name: 'Hello World', url: 'https://dclexplorer.com' }, { name: 'Hello World', url: 'https://dclexplorer.com' }, { name: 'Hello World', url: 'https://dclexplorer.com' }, { name: 'Hello World', url: 'https://dclexplorer.com' }
  ]

  private isLinkEditing: boolean = false
  private addLinkBackground: Color4 ={ ...Color4.Black(), a: 0.35 }

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  updatePage(activePage: 'overview' | 'badges'): void {
    this.overviewBackground = ALMOST_WHITE
    this.overviewText = ALMOST_BLACK
    this.badgesBackground = ALMOST_WHITE
    this.badgesText = ALMOST_BLACK

    if (activePage === 'overview') {
      this.overviewBackground = ORANGE
      this.overviewText = ALMOST_WHITE
    }
    if (activePage === 'badges') {
      this.badgesBackground = ORANGE
      this.badgesText = ALMOST_WHITE
    }
    this.activePage = activePage
  }

  hideProfile(): void {
    this.uiController.isProfileVisible = false
    this.isCardOpen = false
    this.isProfileOpen = false
  }

  showProfile(): void {
    this.isProfileOpen = true
    this.isCardOpen = false
    this.updatePage(this.activePage)
  }

  showCard(): void {
    this.isCardOpen = true
    this.uiController.isProfileVisible = true
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null

    const rightMarginIfMenuVisible: number =
      Math.max(canvasInfo.height * 0.024, 46) * 2 + 10
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            pointerFilter: 'block'
          }}
          uiBackground={{
            color: { ...Color4.Black(), a: 0.2 }
          }}
          onMouseDown={() => {
            this.hideProfile()
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
                position: this.uiController.isMainMenuVisible
                  ? { top: '9%', right: rightMarginIfMenuVisible }
                  : { top: 300, left: '3%' },
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
                    top: 0.5,
                    bottom: 0.5,
                    left: 0.5,
                    right: 0.5
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
                    color: { ...Color4.create(0, 124 / 255, 176 / 255, 1) },
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
                    value: this.wallet,
                    fontSize: this.fontSize,
                    color: ALMOST_WHITE,
                    textAlign: 'middle-left'
                  }}
                />
                {/* copy ICON */}
                {this.verified && (
                  <UiEntity
                    uiTransform={{
                      width: this.fontSize,
                      height: this.fontSize
                    }}
                    uiBackground={{
                      ...getBackgroundFromAtlas({
                        atlasName: 'icons',
                        spriteName: 'CopyIcon'
                      }),
                      color: { ...ALMOST_WHITE, a: 0.2 }
                    }}
                  />
                )}
              </UiEntity>
              <TextButton
                onMouseDown={() => {
                  this.showProfile()
                }}
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
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',

                width: '90%',
                height: '90%',
                pointerFilter: 'block'
              }}
              uiBackground={{
                texture: { src: 'assets/images/passport/background.png' },
                textureMode: 'stretch'
              }}
            >
              <UiEntity
                uiTransform={{
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: this.fontSize,
                  width: '33%',
                  height: '100%',
                  pointerFilter: 'block'
                }}
                uiBackground={
                  {
                    // color:Color4.Black()
                  }
                }
              >
                <UiEntity
                  uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',

                    width: '100%',
                    height: 'auto',
                    pointerFilter: 'block'
                  }}
                >
                  <UiEntity
                    uiTransform={{
                      width: this.fontSize * 0.5,
                      height: this.fontSize * 0.5
                    }}
                    uiBackground={{
                      texture: { src: this.statusIconSprite },
                      textureMode: 'stretch'
                    }}
                  />
                  <UiEntity
                    uiTransform={{
                      width: 'auto',
                      height: 'auto'
                    }}
                    uiText={{
                      value: this.name,
                      fontSize: this.fontSize,
                      color: { ...Color4.create(0, 124 / 255, 176 / 255, 1) },
                      textAlign: 'middle-right'
                    }}
                  />
                  {this.isMyProfile && (
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
                  )}

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
                  {/* copy ICON */}

                  <UiEntity
                    uiTransform={{
                      width: this.fontSize,
                      height: this.fontSize
                    }}
                    uiBackground={{
                      ...getBackgroundFromAtlas({
                        atlasName: 'icons',
                        spriteName: 'CopyIcon'
                      }),
                      color: { ...ALMOST_WHITE, a: 0.2 }
                    }}
                  />
                </UiEntity>
                <UiEntity
                  uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    height: 'auto'
                  }}
                >
                  {/* Address */}
                  <UiEntity
                    uiTransform={{
                      width: 'auto',
                      height: 'auto'
                    }}
                    uiText={{
                      value: this.wallet,
                      fontSize: this.fontSize * 0.75,
                      color: { ...ALMOST_WHITE, a: 0.2 },
                      textAlign: 'middle-left'
                    }}
                  />
                  {/* copy ICON */}

                  <UiEntity
                    uiTransform={{
                      width: this.fontSize * 0.75,
                      height: this.fontSize * 0.75
                    }}
                    uiBackground={{
                      ...getBackgroundFromAtlas({
                        atlasName: 'icons',
                        spriteName: 'CopyIcon'
                      }),
                      color: { ...ALMOST_WHITE, a: 0.2 }
                    }}
                  />
                </UiEntity>
              </UiEntity>

              <UiEntity
                uiTransform={{
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: this.fontSize,
                  width: '67%',
                  height: '100%',
                  pointerFilter: 'block'
                }}
                uiBackground={
                  {
                    // color:Color4.Red()
                  }
                }
              >
                {/* NAVBAR */}
                <UiEntity
                  uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: { bottom: this.fontSize },
                    width: '100%',
                    height: '8%',
                    pointerFilter: 'block'
                  }}
                  // uiBackground={{color:Color4.Yellow()}}
                >
                  <UiEntity>
                    <TextButton
                      onMouseDown={() => {
                        this.updatePage('overview')
                      }}
                      value={'Overview'}
                      fontSize={this.fontSize}
                      fontColor={this.overviewText}
                      backgroundColor={this.overviewBackground}
                    />
                    <TextButton
                      onMouseDown={() => {
                        this.updatePage('badges')
                      }}
                      value={'Badges'}
                      fontSize={this.fontSize}
                      fontColor={this.badgesText}
                      backgroundColor={this.badgesBackground}
                    />
                  </UiEntity>
                  <IconButton
                    onMouseEnter={() => {
                      this.closeButtonColor = { ...Color4.Black(), a: 0.7 }
                    }}
                    onMouseLeave={() => {
                      this.closeButtonColor = { ...Color4.Black(), a: 0.35 }
                    }}
                    onMouseDown={() => {
                      this.hideProfile()
                    }}
                    uiTransform={{
                      width: 2 * this.fontSize,
                      height: 2 * this.fontSize
                    }}
                    backgroundColor={this.closeButtonColor}
                    icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
                  />
                </UiEntity>

                {/* CONTENT */}
                <UiEntity
                  uiTransform={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: canvasInfo.height * 0.9 * 0.85,

                    pointerFilter: 'block'
                  }}
                  // uiBackground={{color:Color4.Green()}}
                >
                  {/* OVERVIEW */}
                  {this.activePage === 'overview' && (
                    <UiEntity
                      uiTransform={{
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        overflow: 'scroll'
                      }}
                      // uiBackground={{ color: Color4.Gray() }}
                    >
                      {/* BADGES */}
                      <UiEntity
                        uiTransform={{
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          margin: {
                            bottom: this.fontSize,
                            right: this.fontSize
                          },
                          width: '96%',
                          padding: this.fontSize,
                          height: canvasInfo.height * 0.9 * 0.85 * 0.5,
                          pointerFilter: 'block'
                        }}
                        uiBackground={{
                          color: { ...Color4.Black(), a: 0.35 },
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
                            width: '100%',
                            height: 'auto',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Label value={'BADGES'} fontSize={this.fontSize} />
                        </UiEntity>
                      </UiEntity>

                      {/* INFO */}
                      <UiEntity
                        uiTransform={{
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          margin: {
                            bottom: this.fontSize,
                            right: this.fontSize
                          },
                          width: '96%',
                          padding: this.fontSize,
                          height: canvasInfo.height * 0.9 * 0.85 * 0.5,
                          pointerFilter: 'block'
                        }}
                        uiBackground={{
                          color: { ...Color4.Black(), a: 0.35 },
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
                        {/* INFO */}
                        <UiEntity
                          uiTransform={{
                            width: '100%',
                            height: 'auto',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            margin: { top: this.fontSize }
                          }}
                        >
                          <Label value={'INFO'} fontSize={this.fontSize} />
                          <IconButton
                            onMouseEnter={() => {
                              this.editInfoButtonColor = {
                                ...Color4.Black(),
                                a: 0.7
                              }
                            }}
                            onMouseLeave={() => {
                              this.editInfoButtonColor = {
                                ...Color4.Black(),
                                a: 0.35
                              }
                            }}
                            onMouseDown={() => {}}
                            uiTransform={{
                              width: 2 * this.fontSize,
                              height: 2 * this.fontSize
                            }}
                            backgroundColor={this.editInfoButtonColor}
                            icon={{ atlasName: 'icons', spriteName: 'Edit' }}
                          />
                        </UiEntity>

                        {/* LINKS */}
                        <UiEntity
                          uiTransform={{
                            width: '100%',
                            height: 'auto',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            margin: { top: this.fontSize }
                          }}
                        >
                          <Label value={'LINKS'} fontSize={this.fontSize} />
                          <IconButton
                            onMouseEnter={() => {
                              this.editLinksButtonColor = {
                                ...Color4.Black(),
                                a: 0.7
                              }
                            }}
                            onMouseLeave={() => {
                              this.editLinksButtonColor = {
                                ...Color4.Black(),
                                a: 0.35
                              }
                            }}
                            onMouseDown={() => {
                              this.isLinkEditing = true
                            }}
                            uiTransform={{
                              width: 2 * this.fontSize,
                              height: 2 * this.fontSize
                            }}
                            backgroundColor={this.editLinksButtonColor}
                            icon={{ atlasName: 'icons', spriteName: 'Edit' }}
                          />
                        </UiEntity>
                        <UiEntity>
                        {this.links.length === 0 && (
                          <Label
                            value={'No links'}
                            fontSize={this.fontSize}
                            textAlign="middle-left"
                          />
                        )}
                        {this.isLinkEditing && (
                          <Label
                            value={'Add a maximum of 5 links to promote your personal website or social networks'}
                            fontSize={this.fontSize * .8}
                            textAlign="middle-left"
                          />
                        )}
                        </UiEntity>
                        <UiEntity>
                        {this.links.length === 0 && (
                          <Label
                            value={'No links'}
                            fontSize={this.fontSize}
                            textAlign="middle-left"
                          />
                        )}
                        
                        {this.links.length > 0 && (
                          <UiEntity
                            uiTransform={{
                              width: '100%',
                              height: 'auto',
                              flexDirection: 'row',
                              justifyContent: 'space-between', 
                              flexWrap:'wrap'
                            }}
                          >
                            {this.links.map((link, index) => (
                                <ChipButton
                                  onMouseDown={() => {}}
                                  value={link.name}
                                  fontColor={{
                                    ...Color4.create(0, 124 / 255, 176 / 255, 1)
                                  }}
                                  iconColor={{
                                    ...Color4.create(0, 124 / 255, 176 / 255, 1)
                                  }}
                                  backgroundColor={{...Color4.Black(), a:0.2}}
                                  fontSize={this.fontSize}
                                  uiTransform={{
                                    height: this.fontSize * 2,
                                    padding: { left: this.fontSize / 2 }
                                  }}
                                  icon={{
                                    atlasName: 'icons',
                                    spriteName: 'Link'
                                  }}
                                  deleteChip={() => {
                                    if (index > -1) {
                                      this.links.splice(index, 1)
                                    }
                                  }}
                                  isRemovable={this.isLinkEditing}
                                />
                            ))}
                            
                          </UiEntity>
                        )}
                        {this.isLinkEditing && this.links.length < 5 && (
                          <TextButton
                          uiTransform={{height: this.fontSize * 2, width: 8 * this.fontSize}}
                          backgroundColor={this.addLinkBackground}
                          value={'+ ADD'}
                          fontSize={this.fontSize} 
                          onMouseDown={()=>{}} 
                          // onMouseDown={()=>{this.openAddLink()}} 
                          onMouseEnter={()=>{this.addLinkBackground = {...Color4.Black(), a:0.7}}} 
                          onMouseLeave={()=>{this.addLinkBackground = {...Color4.Black(), a:0.35}}}
                          />
                        )}
                        </UiEntity>
                      </UiEntity>

                      {/* EQUIPPED ITEMS */}
                      <UiEntity
                        uiTransform={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',

                          width: '100%',
                          height: '20%',
                          pointerFilter: 'block'
                        }}
                        uiBackground={{
                          color: { ...Color4.Black(), a: 0.35 },
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
                      ></UiEntity>
                    </UiEntity>
                  )}

                  {/* BADGES */}
                  {this.activePage === 'badges' && (
                    <UiEntity
                      uiTransform={{
                        width: '100%',
                        height: '85%',
                        flexDirection: 'column',
                        overflow: 'scroll'
                      }}
                      uiBackground={{ color: Color4.Gray() }}
                    >
                      {/*  */}
                      <UiEntity
                        uiTransform={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          margin: { bottom: this.fontSize },
                          width: '100%',
                          height: 'auto',
                          pointerFilter: 'block'
                        }}
                        uiBackground={{
                          color: { ...Color4.Black(), a: 1 },
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
                      ></UiEntity>
                    </UiEntity>
                  )}
                </UiEntity>
              </UiEntity>
            </UiEntity>
          )}
        </UiEntity>
      </Canvas>
    )
  }
}
