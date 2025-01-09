import { Label } from '@dcl/react-ecs/dist/components/Label'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import ChipButton from '../../components/chipButton'
import DropdownField from '../../components/dropdownField'
import IconButton from '../../components/button-icon/ButtonIcon'
import InputField from '../../components/inputField'
import TextButton from '../../components/button-text/ButtonText'
import TextIconButton from '../../components/textIconButton'
import { type UIController } from '../../controllers/ui.controller'
import {
  ALMOST_BLACK,
  ALMOST_WHITE,
  ALPHA_BLACK_NORMAL,
  COUNTRIES,
  EMPLOYMENT_STATUS,
  GENDERS,
  LANGUAGES,
  LINK_CHIP_HOVERED,
  ORANGE,
  PRONOUNS,
  RELATIONSHIP_STATUS,
  RUBY,
  SEXUAL_ORIENTATIONS
} from '../../utils/constants'
import { getBackgroundFromAtlas, isValidDate } from '../../utils/ui-utils'
import { AddLink } from '../add-link'
import Canvas from '../canvas/canvas'
import { BevyApi } from '../../bevy-api'

export class Profile {
  private savedIntro: string = ''
  private savedHobbie: string = ''
  private savedBirth: string = ''
  private typedIntro: string = ''
  private typedHobbie: string = ''
  private typedBirth: string = ''
  private savedProfession: string = ''
  private savedRealName: string = ''
  private typedProfession: string = ''
  private typedRealName: string = ''
  private readonly isMyProfile: boolean = true
  private readonly statusIconSprite: string =
    'assets/images/passport/Online.png'

  private readonly name: string = 'BevyUser'
  private readonly tag: string = '#1234'
  private readonly verified: boolean = true
  private readonly wallet: string = '0x10e...a7a92'
  private isCardOpen: boolean = false
  private isProfileOpen: boolean = false
  public fontSize: number = 16
  private readonly uiController: UIController
  private closeButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
  private overviewBackground: Color4 = ORANGE
  private overviewText: Color4 = ALMOST_WHITE
  private badgesBackground: Color4 = ALMOST_WHITE
  private badgesText: Color4 = ALMOST_BLACK
  private activePage: 'overview' | 'badges' = 'overview'
  private editInfoButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
  private saveInfoButtonColor: Color4 = RUBY
  private cancelInfoButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
  private editLinksButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
  private saveLinksButtonColor: Color4 = RUBY
  private cancelLinksButtonColor: Color4 = { ...Color4.Black(), a: 0.35 }
  public savedLinks: Array<{ name: string; url: string }> = [
    { name: 'DCL Explorers', url: 'https://dclexplorer.com' }
  ]

  public linksToShow: Array<{ name: string; url: string }> = [
    ...this.savedLinks
  ]

  private readonly linkChipsBackgrounds: Color4[] = [
    ALPHA_BLACK_NORMAL,
    ALPHA_BLACK_NORMAL,
    ALPHA_BLACK_NORMAL,
    ALPHA_BLACK_NORMAL,
    ALPHA_BLACK_NORMAL
  ]

  private isLinkEditing: boolean = false
  private isInfoEditing: boolean = false

  private isGenderOpen: boolean = false
  private isCountryOpen: boolean = false
  private isLanguageOpen: boolean = false
  private isPronounsOpen: boolean = false
  private isRelationshipStatusOpen: boolean = false
  private isSexualOrientationOpen: boolean = false
  private isEmploymentStatusOpen: boolean = false

  private selectedCountry: number = 0
  private selectedLanguage: number = 0
  private selectedPronouns: number = 0
  private selectedGender: number = 0
  private selectedRelationshipStatus: number = 0
  private selectedSexualOrientation: number = 0
  private selectedEmploymentStatus: number = 0
  private savedCountry: number = 0
  private savedLanguage: number = 0
  private savedPronouns: number = 0
  private savedGender: number = 0
  private savedRelationshipStatus: number = 0
  private savedSexualOrientation: number = 0
  private savedEmploymentStatus: number = 0

  private addLinkBackground: Color4 = { ...Color4.Black(), a: 0.35 }

  private readonly addLink: AddLink
  addLinkOpen: boolean = false

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.addLink = new AddLink(uiController)
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
    this.isInfoEditing = false
    this.isLinkEditing = false
    this.addLinkOpen = false
  }

  showProfile(): void {
    this.infoCancel()
    this.isProfileOpen = true
    this.isCardOpen = false
    this.updatePage(this.activePage)
    if (!this.uiController.isProfileVisible)
      this.uiController.isProfileVisible = true
  }

  showCard(): void {
    this.isCardOpen = true
    this.uiController.isProfileVisible = true
  }

  infoSave(): void {
    this.isInfoEditing = false
    this.isGenderOpen = false
    this.isCountryOpen = false
    this.isLanguageOpen = false
    this.isPronounsOpen = false
    this.isGenderOpen = false
    this.isRelationshipStatusOpen = false
    this.isSexualOrientationOpen = false
    this.isEmploymentStatusOpen = false
    this.editInfoButtonColor = {
      ...Color4.Black(),
      a: 0.35
    }
    if (this.typedBirth === '' || isValidDate(this.typedBirth)) {
      this.savedIntro = this.typedIntro
      this.savedHobbie = this.typedHobbie
      this.savedBirth = this.typedBirth
      this.savedRealName = this.typedRealName
      this.savedProfession = this.typedProfession
      this.savedCountry = this.selectedCountry
      this.savedLanguage = this.selectedLanguage
      this.savedPronouns = this.selectedPronouns
      this.savedGender = this.selectedGender
      this.savedRelationshipStatus = this.selectedRelationshipStatus
      this.savedSexualOrientation = this.selectedSexualOrientation
      this.savedEmploymentStatus = this.selectedEmploymentStatus
    }
  }

  infoCancel(): void {
    this.isInfoEditing = false
    this.isGenderOpen = false
    this.isCountryOpen = false
    this.isLanguageOpen = false
    this.isPronounsOpen = false
    this.isGenderOpen = false
    this.isRelationshipStatusOpen = false
    this.isSexualOrientationOpen = false
    this.isEmploymentStatusOpen = false
    this.selectedCountry = this.savedCountry
    this.selectedLanguage = this.savedLanguage
    this.selectedPronouns = this.savedPronouns
    this.selectedGender = this.savedGender
    this.selectedRelationshipStatus = this.savedRelationshipStatus
    this.selectedSexualOrientation = this.savedSexualOrientation
    this.selectedEmploymentStatus = this.savedEmploymentStatus
    this.typedHobbie = this.savedHobbie
    this.typedBirth = this.savedBirth
    this.typedRealName = this.savedRealName
    this.typedProfession = this.savedProfession
    this.typedIntro = this.savedIntro

    this.editInfoButtonColor = {
      ...Color4.Black(),
      a: 0.35
    }
  }

  async logout(): Promise<void> {
    console.log('logout now')
    BevyApi.logout()
    this.uiController.loadingAndLogin.startLoading()
    this.uiController.loadingAndLogin.setStatus('sign-in-or-guest')
    this.hideProfile()
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
          <UiEntity
            uiTransform={{
              display: this.isCardOpen ? 'flex' : 'none',
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
              uiTransform={{
                width: '90%',
                height: this.fontSize * 3,

                padding: this.fontSize * 0.3,
                margin: this.fontSize * 0.3
              }}
              value={'MY PROFILE'}
              fontSize={this.fontSize}
              backgroundColor={{ ...ALMOST_WHITE, a: 0.1 }}
            />
            <UiEntity
              uiTransform={{ margin: '5%', width: '100%', height: 1 }}
              uiBackground={{ color: { ...Color4.White(), a: 0.1 } }}
            />
            <TextIconButton
              onMouseDown={() => {
                void this.logout()
              }}
              uiTransform={{
                width: '90%',
                height: this.fontSize * 2,
                justifyContent: 'flex-start'
              }}
              value={'SIGN OUT'}
              fontSize={this.fontSize * 0.8}
              icon={{
                atlasName: 'icons',
                spriteName: 'LogoutIcon'
              }}
            />
            <TextIconButton
              onMouseDown={() => {}}
              uiTransform={{
                width: '90%',
                height: this.fontSize * 2,
                justifyContent: 'flex-start'
              }}
              value={'EXIT'}
              fontSize={this.fontSize * 0.8}
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

          {/* PROFILE */}

          <UiEntity
            uiTransform={{
              display: this.isProfileOpen ? 'flex' : 'none',
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
                    width: this.fontSize * 0.75,
                    height: this.fontSize * 0.75
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
                    fontSize: this.fontSize * 1.5,
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
                      fontSize: this.fontSize * 1.5,
                      color: { ...ALMOST_WHITE, a: 0.5 },
                      textAlign: 'middle-left'
                    }}
                  />
                )}

                {/* VERIFIED ICON */}
                {this.verified && (
                  <UiEntity
                    uiTransform={{
                      width: this.fontSize * 1.5,
                      height: this.fontSize * 1.5
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
                    width: this.fontSize * 1.5,
                    height: this.fontSize * 1.5
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
                    fontSize: this.fontSize * 1.5,
                    color: { ...ALMOST_WHITE, a: 0.2 },
                    textAlign: 'middle-left'
                  }}
                />
                {/* copy ICON */}

                <UiEntity
                  uiTransform={{
                    width: this.fontSize * 1.5,
                    height: this.fontSize * 1.5
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
                    uiTransform={{
                      padding: this.fontSize * 0.3,
                      margin: this.fontSize * 0.3
                    }}
                  />
                  {/* <TextButton
                      onMouseDown={() => {
                        this.updatePage('badges')
                      }}
                      value={'Badges'}
                      fontSize={this.fontSize}
                      fontColor={this.badgesText}
                      backgroundColor={this.badgesBackground}
                    /> */}
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
                        height: 'auto',
                        padding: this.fontSize,
                        minHeight: canvasInfo.height * 0.9 * 0.85 * 0.1,
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
                        {!this.isInfoEditing && (
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
                            onMouseDown={() => {
                              this.isInfoEditing = true
                            }}
                            uiTransform={{
                              width: 2 * this.fontSize,
                              height: 2 * this.fontSize
                            }}
                            backgroundColor={this.editInfoButtonColor}
                            icon={{ atlasName: 'icons', spriteName: 'Edit' }}
                          />
                        )}
                      </UiEntity>
                      <Label
                        value={
                          'Use this space to describe yourself in a few words.'
                        }
                        fontSize={this.fontSize * 0.8}
                        textAlign="middle-left"
                        uiTransform={{
                          width: '100%',
                          flexWrap: 'wrap',
                          display: this.isInfoEditing ? 'flex' : 'none'
                        }}
                      />
                      <InputField
                        uiTransform={{
                          minWidth: canvasInfo.width * 0.53,
                          maxWidth: canvasInfo.width * 0.53,
                          margin: {
                            right: this.fontSize,
                            bottom: this.fontSize
                          }
                        }}
                        onValueUpdate={(arg) => {
                          this.typedIntro = arg
                        }}
                        title={''}
                        placeholder={'Write about you'}
                        icon={{
                          atlasName: '',
                          spriteName: ''
                        }}
                        fontSize={this.fontSize}
                        value={this.typedIntro}
                        savedValue={this.savedIntro}
                        isEditing={this.isInfoEditing}
                      />
                      <Label
                        value={
                          'You can extend your profile information using this fields. Those which are not completed will not be displayed.'
                        }
                        fontSize={this.fontSize * 0.8}
                        textAlign="middle-left"
                        uiTransform={{
                          width: '100%',
                          flexWrap: 'wrap',
                          display: this.isInfoEditing ? 'flex' : 'none'
                        }}
                      />
                      <UiEntity
                        uiTransform={{
                          width: '100%',
                          height: 'auto',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          margin: { top: this.fontSize },
                          flexWrap: 'wrap'
                        }}
                        // uiBackground={{ color: Color4.Green() }}
                      >
                        <DropdownField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          isOpen={this.isGenderOpen}
                          title="GENDER"
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'GenderIcn'
                          }}
                          onMouseDown={() => {
                            this.isGenderOpen = !this.isGenderOpen
                          }}
                          onOptionMouseDown={(index) => {
                            this.selectedGender = index
                            this.isGenderOpen = false
                          }}
                          fontSize={this.fontSize}
                          savedOption={this.savedGender}
                          selectedOption={this.selectedGender}
                          options={GENDERS}
                          isEditing={this.isInfoEditing}
                        />
                        <DropdownField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          isOpen={this.isCountryOpen}
                          title="COUNTRY"
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'CountryIcn'
                          }}
                          onMouseDown={() => {
                            this.isCountryOpen = !this.isCountryOpen
                          }}
                          onOptionMouseDown={(index) => {
                            this.selectedCountry = index
                            this.isCountryOpen = false
                          }}
                          fontSize={this.fontSize}
                          savedOption={this.savedCountry}
                          selectedOption={this.selectedCountry}
                          options={COUNTRIES}
                          isEditing={this.isInfoEditing}
                        />
                        <InputField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          onValueUpdate={(arg) => {
                            this.typedBirth = arg
                          }}
                          title={'BIRTH DATE'}
                          placeholder={'DD/MM/AAAA.'}
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'BirthdayIcn'
                          }}
                          fontSize={this.fontSize}
                          value={this.typedBirth}
                          savedValue={this.savedBirth}
                          isEditing={this.isInfoEditing}
                        />

                        <DropdownField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          isOpen={this.isPronounsOpen}
                          title="PRONOUNS"
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'PronounsIcn'
                          }}
                          onMouseDown={() => {
                            this.isPronounsOpen = !this.isPronounsOpen
                          }}
                          onOptionMouseDown={(index) => {
                            this.selectedPronouns = index
                            this.isPronounsOpen = false
                          }}
                          fontSize={this.fontSize}
                          savedOption={this.savedPronouns}
                          selectedOption={this.selectedPronouns}
                          options={PRONOUNS}
                          isEditing={this.isInfoEditing}
                        />
                        <DropdownField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          isOpen={this.isRelationshipStatusOpen}
                          title="RELATIONSHIP STATUS"
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'RelationshipIcn'
                          }}
                          onMouseDown={() => {
                            this.isRelationshipStatusOpen =
                              !this.isRelationshipStatusOpen
                          }}
                          onOptionMouseDown={(index) => {
                            this.selectedRelationshipStatus = index
                            this.isRelationshipStatusOpen = false
                          }}
                          fontSize={this.fontSize}
                          savedOption={this.savedRelationshipStatus}
                          selectedOption={this.selectedRelationshipStatus}
                          options={RELATIONSHIP_STATUS}
                          isEditing={this.isInfoEditing}
                        />
                        <DropdownField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          isOpen={this.isSexualOrientationOpen}
                          title="SEXUAL ORIENTATION"
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'SexOrientationIcn'
                          }}
                          onMouseDown={() => {
                            this.isSexualOrientationOpen =
                              !this.isSexualOrientationOpen
                          }}
                          onOptionMouseDown={(index) => {
                            this.selectedSexualOrientation = index
                            this.isSexualOrientationOpen = false
                          }}
                          fontSize={this.fontSize}
                          savedOption={this.savedSexualOrientation}
                          selectedOption={this.selectedSexualOrientation}
                          options={SEXUAL_ORIENTATIONS}
                          isEditing={this.isInfoEditing}
                        />
                        <DropdownField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          isOpen={this.isLanguageOpen}
                          title="LANGUAGE"
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'LanguageIcn'
                          }}
                          onMouseDown={() => {
                            this.isLanguageOpen = !this.isLanguageOpen
                          }}
                          onOptionMouseDown={(index) => {
                            this.selectedLanguage = index
                            this.isLanguageOpen = false
                          }}
                          fontSize={this.fontSize}
                          savedOption={this.savedLanguage}
                          selectedOption={this.selectedLanguage}
                          options={LANGUAGES}
                          isEditing={this.isInfoEditing}
                        />

                        <InputField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          onValueUpdate={(arg) => {
                            this.typedProfession = arg
                          }}
                          title={'PROFESSION'}
                          placeholder={'Write here'}
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'ProfessionIcn'
                          }}
                          fontSize={this.fontSize}
                          value={this.typedProfession}
                          savedValue={this.savedProfession}
                          isEditing={this.isInfoEditing}
                        />
                        <DropdownField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          isOpen={this.isEmploymentStatusOpen}
                          title="EMPLOYMENT STATUS"
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'EmploymentStatus'
                          }}
                          onMouseDown={() => {
                            this.isEmploymentStatusOpen =
                              !this.isEmploymentStatusOpen
                          }}
                          onOptionMouseDown={(index) => {
                            this.selectedEmploymentStatus = index
                            this.isEmploymentStatusOpen = false
                          }}
                          fontSize={this.fontSize}
                          savedOption={this.savedEmploymentStatus}
                          selectedOption={this.selectedEmploymentStatus}
                          options={EMPLOYMENT_STATUS}
                          isEditing={this.isInfoEditing}
                        />
                        <InputField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          onValueUpdate={(arg) => {
                            this.typedHobbie = arg
                          }}
                          title={'HOBBIES'}
                          placeholder={'Write here'}
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'HobbiesIcn'
                          }}
                          fontSize={this.fontSize}
                          value={this.typedHobbie}
                          savedValue={this.savedHobbie}
                          isEditing={this.isInfoEditing}
                        />
                        <InputField
                          uiTransform={{
                            minWidth: canvasInfo.width * 0.125,
                            maxWidth: canvasInfo.width * 0.125,

                            margin: {
                              right: this.fontSize,
                              bottom: this.fontSize
                            }
                          }}
                          onValueUpdate={(arg) => {
                            this.typedRealName = arg
                          }}
                          title={'REAL NAME'}
                          placeholder={'Write here'}
                          icon={{
                            atlasName: 'profile',
                            spriteName: 'RealNameIcn'
                          }}
                          fontSize={this.fontSize}
                          value={this.typedRealName}
                          savedValue={this.savedRealName}
                          isEditing={this.isInfoEditing}
                        />
                      </UiEntity>

                      <UiEntity
                        uiTransform={{
                          display: this.isInfoEditing ? 'flex' : 'none',
                          width: '100%',
                          height: 4 * this.fontSize,
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          margin: { top: this.fontSize }
                        }}
                      >
                        <UiEntity
                          uiTransform={{
                            positionType: 'absolute',
                            position: { left: 0, top: 0 },
                            width: '100%',
                            height: 1
                          }}
                          uiBackground={{
                            color: { ...ALMOST_WHITE, a: 0.2 }
                          }}
                        />
                        <TextButton
                          onMouseEnter={() => {
                            this.cancelInfoButtonColor = {
                              ...Color4.Black(),
                              a: 0.7
                            }
                          }}
                          onMouseLeave={() => {
                            this.cancelInfoButtonColor = {
                              ...Color4.Black(),
                              a: 0.35
                            }
                          }}
                          onMouseDown={() => {
                            this.infoCancel()
                          }}
                          uiTransform={{
                            width: 5 * this.fontSize,
                            height: 2 * this.fontSize,

                            padding: this.fontSize * 0.3,
                            margin: this.fontSize * 0.3
                          }}
                          backgroundColor={this.cancelInfoButtonColor}
                          value={'CANCEL'}
                          fontSize={this.fontSize}
                        />
                        <TextButton
                          onMouseEnter={() => {
                            this.saveInfoButtonColor = {
                              ...RUBY,
                              g: 0.5,
                              b: 0.5
                            }
                          }}
                          onMouseLeave={() => {
                            this.saveInfoButtonColor = RUBY
                          }}
                          onMouseDown={() => {
                            this.infoSave()
                          }}
                          uiTransform={{
                            width: 5 * this.fontSize,
                            height: 2 * this.fontSize,

                            padding: this.fontSize * 0.3,
                            margin: this.fontSize * 0.3
                          }}
                          backgroundColor={this.saveInfoButtonColor}
                          value={'SAVE'}
                          fontSize={this.fontSize}
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
                        {!this.isLinkEditing && (
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
                              this.linksToShow = [...this.savedLinks]
                            }}
                            uiTransform={{
                              width: 2 * this.fontSize,
                              height: 2 * this.fontSize
                            }}
                            backgroundColor={this.editLinksButtonColor}
                            icon={{ atlasName: 'icons', spriteName: 'Edit' }}
                          />
                        )}
                      </UiEntity>
                      {/* LINKS CONTENT */}
                      <UiEntity uiTransform={{ height: 'auto', width: '100%' }}>
                        {this.savedLinks.length === 0 &&
                          !this.isLinkEditing && (
                            <Label
                              value={'No links'}
                              fontSize={this.fontSize}
                              textAlign="middle-left"
                            />
                          )}
                        {this.isLinkEditing && (
                          <Label
                            value={
                              'Add a maximum of 5 links to promote your personal website or social networks'
                            }
                            fontSize={this.fontSize * 0.8}
                            textAlign="middle-left"
                          />
                        )}
                      </UiEntity>
                      <UiEntity
                        uiTransform={{
                          width: '100%',
                          height: 'auto',
                          // height: 250,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          flexWrap: 'wrap'
                        }}
                      >
                        {this.linksToShow.length > 0 && (
                          <UiEntity
                            uiTransform={{
                              width: '100%',
                              // minHeight: 5 * this.fontSize,
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              flexWrap: 'wrap'
                            }}
                          >
                            <UiEntity
                              uiTransform={{
                                width: 'auto',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap'
                              }}
                            >
                              {this.linksToShow.map((link, index) => (
                                <ChipButton
                                  onMouseDown={() => {}}
                                  onMouseEnter={() => {
                                    this.linkChipsBackgrounds[index] =
                                      LINK_CHIP_HOVERED
                                  }}
                                  onMouseLeave={() => {
                                    this.linkChipsBackgrounds[index] =
                                      ALPHA_BLACK_NORMAL
                                  }}
                                  value={link.name}
                                  fontColor={{
                                    ...Color4.create(0, 124 / 255, 176 / 255, 1)
                                  }}
                                  iconColor={{
                                    ...Color4.create(0, 124 / 255, 176 / 255, 1)
                                  }}
                                  backgroundColor={
                                    this.linkChipsBackgrounds[index]
                                  }
                                  fontSize={this.fontSize}
                                  uiTransform={{
                                    height: this.fontSize * 1.5,
                                    padding: { left: this.fontSize / 2 }
                                  }}
                                  icon={{
                                    atlasName: 'icons',
                                    spriteName: 'Link'
                                  }}
                                  deleteChip={() => {
                                    if (index > -1) {
                                      this.linksToShow.splice(index, 1)
                                      console.log(
                                        this.savedLinks,
                                        this.linksToShow
                                      )
                                    }
                                  }}
                                  isRemovable={this.isLinkEditing}
                                />
                              ))}
                            </UiEntity>
                            {this.isLinkEditing &&
                              this.linksToShow.length < 5 && (
                                <TextButton
                                  uiTransform={{
                                    height: this.fontSize * 1.5,
                                    width: 5 * this.fontSize,
                                    padding: this.fontSize * 0.3,
                                    margin: this.fontSize * 0.3
                                  }}
                                  backgroundColor={this.addLinkBackground}
                                  value={'+ ADD'}
                                  fontSize={this.fontSize}
                                  onMouseDown={() => {
                                    this.addLinkOpen = true
                                  }}
                                  onMouseEnter={() => {
                                    this.addLinkBackground = {
                                      ...Color4.Black(),
                                      a: 0.7
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    this.addLinkBackground = {
                                      ...Color4.Black(),
                                      a: 0.35
                                    }
                                  }}
                                />
                              )}
                          </UiEntity>
                        )}
                      </UiEntity>

                      <UiEntity
                        uiTransform={{
                          display: this.isLinkEditing ? 'flex' : 'none',
                          width: '100%',
                          height: 4 * this.fontSize,
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          margin: { top: this.fontSize }
                        }}
                      >
                        <UiEntity
                          uiTransform={{
                            positionType: 'absolute',
                            position: { left: 0, top: 0 },
                            width: '100%',
                            height: 1
                          }}
                          uiBackground={{
                            color: { ...ALMOST_WHITE, a: 0.2 }
                          }}
                        />
                        <TextButton
                          onMouseEnter={() => {
                            this.cancelLinksButtonColor = {
                              ...Color4.Black(),
                              a: 0.7
                            }
                          }}
                          onMouseLeave={() => {
                            this.cancelLinksButtonColor = {
                              ...Color4.Black(),
                              a: 0.35
                            }
                          }}
                          onMouseDown={() => {
                            this.linksToShow = [...this.savedLinks]
                            this.isLinkEditing = false
                            this.editLinksButtonColor = {
                              ...Color4.Black(),
                              a: 0.35
                            }
                          }}
                          uiTransform={{
                            width: 5 * this.fontSize,
                            height: 2 * this.fontSize,
                            padding: this.fontSize * 0.3,
                            margin: this.fontSize * 0.3
                          }}
                          backgroundColor={this.cancelLinksButtonColor}
                          value={'CANCEL'}
                          fontSize={this.fontSize}
                        />
                        <TextButton
                          onMouseEnter={() => {
                            this.saveLinksButtonColor = {
                              ...RUBY,
                              g: 0.5,
                              b: 0.5
                            }
                          }}
                          onMouseLeave={() => {
                            this.saveLinksButtonColor = RUBY
                          }}
                          onMouseDown={() => {
                            this.savedLinks = [...this.linksToShow]
                            this.isLinkEditing = false
                            this.editLinksButtonColor = {
                              ...Color4.Black(),
                              a: 0.35
                            }
                          }}
                          uiTransform={{
                            width: 5 * this.fontSize,
                            height: 2 * this.fontSize,
                            padding: this.fontSize * 0.3,
                            margin: this.fontSize * 0.3
                          }}
                          backgroundColor={this.saveLinksButtonColor}
                          value={'SAVE'}
                          fontSize={this.fontSize}
                        />
                      </UiEntity>
                    </UiEntity>

                    {/* EQUIPPED ITEMS */}
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
                        height: 'auto',
                        padding: this.fontSize,
                        minHeight: canvasInfo.height * 0.9 * 0.85 * 0.1,
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
                      <Label
                        value={'EQUIPPED ITEMS'}
                        fontSize={this.fontSize}
                      />
                    </UiEntity>
                  </UiEntity>
                )}
              </UiEntity>
            </UiEntity>
          </UiEntity>

          {/* ADD LINK */}
          {this.addLink.mainUi()}
        </UiEntity>
      </Canvas>
    )
  }
}
