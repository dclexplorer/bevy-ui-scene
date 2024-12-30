import { Color4 } from '@dcl/ecs-math'
import {
  UiCanvasInformation,
  UiScrollResult,
  UiTransform,
  engine
} from '@dcl/sdk/ecs'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import Slider from '../../components/slider'
import StyledDropdown from '../../components/styledDropdown'
import TextIconButton from '../../components/textIconButton'
import { type UIController } from '../../controllers/ui.controller'
import {
  discardNewValues,
  saveSettingsToExplorer,
  setSettingValue
} from '../../state/settings/actions'
import { store } from '../../state/store'
import { ALMOST_BLACK, ALMOST_WHITE, ORANGE } from '../../utils/constants'
import { type Icon } from '../../utils/definitions'
import {
  sliderPercentageToValue,
  sliderValueToPercentage
} from '../../utils/ui-utils'

type SettingCategory =
  | 'general'
  | 'audio'
  | 'graphics'
  | 'gameplay'
  | 'performance'

export class SettingsPage {
  private readonly uiController: UIController

  private readonly toggleIcon: Icon = {
    atlasName: 'toggles',
    spriteName: 'SwitchOn'
  }

  private readonly toggleStatus: boolean = false

  // private dataArray: settingData[] = []
  // private settingsToSave: settingData[] = []
  private dropdownOpenedSettingName: string = ''
  private dropdownIndexEntered: number = -1
  private backgroundIcon: string = 'assets/images/menu/GeneralImg.png'
  // private generalTextColor: Color4 = ALMOST_WHITE
  private graphicsTextColor: Color4 = ALMOST_BLACK
  private audioTextColor: Color4 = ALMOST_BLACK
  private gameplayTextColor: Color4 = ALMOST_BLACK
  private performanceTextColor: Color4 = ALMOST_BLACK
  private restoreTextColor: Color4 = Color4.Red()
  // private generalBackgroundColor: Color4 = ORANGE
  private graphicsBackgroundColor: Color4 = ALMOST_WHITE
  private audioBackgroundColor: Color4 = ALMOST_WHITE
  private gameplayBackgroundColor: Color4 = ALMOST_WHITE
  private performanceBackgroundColor: Color4 = ALMOST_WHITE
  private restoreBackgroundColor: Color4 = ALMOST_WHITE
  private buttonClicked: SettingCategory = 'performance'

  // private settingsInfoTitle: string = ''
  private settingsInfoDescription: string = ''

  // just for debug purpose
  // private entityStates: Map<Entity, { value: number; elementId: string }> =
  // new Map()

  constructor(uiController: UIController) {
    this.uiController = uiController
    engine.addSystem(this.controllerSystem.bind(this))
  }

  setButtonClicked(button: SettingCategory): void {
    if (Object.keys(store.getState().settings.newValues).length > 0) {
      this.uiController.actionPopUp.show()
      this.uiController.actionPopUp.tittle = 'You have unsaved settings:'
      this.uiController.actionPopUp.message =
        'Do you want to save them?\n' +
        Object.keys(store.getState().settings.newValues)
          .map(
            (key) => `\t- ${key}: ${store.getState().settings.newValues[key]}`
          )
          .join('\n')
      this.uiController.actionPopUp.action = () => {
        store.dispatch(saveSettingsToExplorer())
      }
      this.uiController.actionPopUp.actionText = 'SAVE'
      this.uiController.actionPopUp.cancel = () => {
        this.discardChanges(button)
      }
      this.uiController.actionPopUp.cancelText = 'DISCARD'
    } else {
      // this.dataArray = []
      this.buttonClicked = button
      this.updateButtons()
    }
  }

  // generalEnter(): void {
  //   this.generalBackgroundColor = ORANGE
  //   this.generalTextColor = ALMOST_WHITE
  // }

  audioEnter(): void {
    this.audioBackgroundColor = ORANGE
    this.audioTextColor = ALMOST_WHITE
  }

  graphicsEnter(): void {
    this.graphicsBackgroundColor = ORANGE
    this.graphicsTextColor = ALMOST_WHITE
  }

  gameplayEnter(): void {
    this.gameplayBackgroundColor = ORANGE
    this.gameplayTextColor = ALMOST_WHITE
  }

  performanceEnter(): void {
    this.performanceBackgroundColor = ORANGE
    this.performanceTextColor = ALMOST_WHITE
  }

  restoreEnter(): void {
    this.restoreBackgroundColor = Color4.Red()
    this.restoreTextColor = ALMOST_WHITE
  }

  updateButtons(): void {
    // this.generalBackgroundColor = ALMOST_WHITE
    this.graphicsBackgroundColor = ALMOST_WHITE
    this.audioBackgroundColor = ALMOST_WHITE
    this.gameplayBackgroundColor = ALMOST_WHITE
    this.performanceBackgroundColor = ALMOST_WHITE
    // this.generalTextColor = ALMOST_BLACK
    this.graphicsTextColor = ALMOST_BLACK
    this.audioTextColor = ALMOST_BLACK
    this.gameplayTextColor = ALMOST_BLACK
    this.performanceTextColor = ALMOST_BLACK
    this.restoreTextColor = Color4.Red()
    this.restoreBackgroundColor = ALMOST_WHITE

    switch (this.buttonClicked) {
      // case 'general':
      //   this.generalEnter()
      //   this.backgroundIcon = 'assets/images/menu/GeneralImg.png'
      //   break
      case 'audio':
        this.audioEnter()
        this.backgroundIcon = 'assets/images/menu/SoundImg.png'
        break
      case 'graphics':
        this.graphicsEnter()
        this.backgroundIcon = 'assets/images/menu/GraphicsImg.png'
        break
      case 'gameplay':
        this.gameplayEnter()
        this.backgroundIcon = 'assets/images/menu/GeneralImg.png'
        break
      case 'performance':
        this.performanceEnter()
        this.backgroundIcon = 'assets/images/menu/GeneralImg.png'
        break
    }

    this.toggleIcon.spriteName = this.toggleStatus ? 'SwitchOn' : 'SwitchOff'
  }

  selectOption(index: number, title: string): void {
    store.dispatch(setSettingValue({ name: title, value: index }))
  }

  controllerSystem(): void {
    // just for debug purpose
    // const currentEntities = new Set<Entity>()

    // for (const [entity, uiTransform] of engine.getEntitiesWith(UiTransform)) {
    //   const currentElementId = uiTransform.elementId ?? ''
    //   if (currentElementId.length === 0) continue

    //   currentEntities.add(entity)
    //   // Handle new entities
    //   if (!this.entityStates.has(entity)) {
    //     console.log(
    //       `New entity detected: ${entity} (elementId: ${currentElementId})`
    //     )
    //     this.entityStates.set(entity, {
    //       value: uiTransform.rightOf,
    //       elementId: currentElementId
    //     })
    //     continue
    //   }

    //   const previousState = this.entityStates.get(entity)!
    //   const currentValue = uiTransform.rightOf ?? 0

    //   // Check for elementId changes
    //   if (previousState.elementId !== currentElementId) {
    //     console.log(
    //       `Entity ${entity} elementId changed from "${previousState.elementId}" to "${currentElementId}"`
    //     )
    //     previousState.elementId = currentElementId
    //   }

    //   // Check for value changes
    //   if (previousState.value !== currentValue) {
    //     console.log(
    //       `Entity ${entity} (${currentElementId}) value changed from ${previousState.value} to ${currentValue}`
    //     )
    //     previousState.value = currentValue
    //   }
    // }

    // // Check for removed entities
    // for (const [entity, state] of this.entityStates) {
    //   if (!currentEntities.has(entity)) {
    //     console.log(`Entity ${entity} (${state.elementId}) was removed`)
    //     this.entityStates.delete(entity)
    //   }
    // }

    const settings = Object.values(store.getState().settings.explorerSettings)
    for (const [, pos, uiTransform] of engine.getEntitiesWith(
      UiScrollResult,
      UiTransform
    )) {
      if (pos.value === undefined) continue
      const setting = settings.find(
        (setting) => uiTransform.elementId === `setting-${setting.name}`
      )
      if (setting === undefined) continue

      const scrollValue = sliderPercentageToValue(
        pos.value.x,
        setting.minValue,
        setting.maxValue
      )
      const currentValue =
        store.getState().settings.newValues[setting.name] ?? setting.value
      if (currentValue !== scrollValue) {
        store.dispatch(
          setSettingValue({ name: setting.name, value: scrollValue })
        )
        console.log(
          `Setting ${setting.name} updated to ${scrollValue}`,
          pos.value.x,
          setting.minValue,
          setting.maxValue,
          ' from ',
          currentValue
        )
      }
    }
  }

  discardChanges(button: SettingCategory): void {
    store.dispatch(discardNewValues())
    this.setButtonClicked(button)
  }

  mainUi(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
    if (canvasInfo === null) return null
    if (Object.keys(store.getState().settings.explorerSettings).length === 0)
      return null

    const sliderWidth: number = canvasInfo.width * 0.3
    const sliderHeight: number = canvasInfo.height * 0.1
    const fontSize: number = canvasInfo.height * 0.02

    return (
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          // positionType: 'absolute',
          // position:{top: 0, left: 0, right: 0, bottom: 0},
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/menu/Background.png' }
        }}
      >
        {/* Icon Background */}
        <UiEntity
          uiTransform={{
            width: canvasInfo.height * 0.65,
            height: canvasInfo.height * 0.65,
            positionType: 'absolute',
            position: { left: '0', bottom: '0' }
          }}
          uiBackground={{
            color: { ...Color4.White(), a: 0.3 },
            textureMode: 'stretch',
            texture: { src: this.backgroundIcon }
          }}
        />

        {/* NavBar */}
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '10%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: { left: '10%' }
          }}
          uiBackground={{
            color: { ...Color4.Black(), a: 0.7 }
          }}
        >
          <UiEntity
            uiTransform={{
              width: 'auto',
              height: 'auto',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <UiEntity
              uiTransform={{
                width: 'auto',
                height: 16
              }}
              uiText={{
                value: 'Settings',
                textAlign: 'middle-left',
                fontSize: 30
              }}
            />

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.performanceTextColor}
              icon={{ atlasName: 'icons', spriteName: 'Filter' }}
              value={'Performance'}
              fontSize={fontSize}
              fontColor={this.performanceTextColor}
              onMouseEnter={() => {
                this.performanceEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('performance')
              }}
              backgroundColor={this.performanceBackgroundColor}
            />

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.graphicsTextColor}
              icon={{ atlasName: 'icons', spriteName: 'Graphics' }}
              value={'Graphics'}
              fontSize={fontSize}
              fontColor={this.graphicsTextColor}
              onMouseEnter={() => {
                this.graphicsEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('graphics')
              }}
              backgroundColor={this.graphicsBackgroundColor}
            />

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.audioTextColor}
              icon={{ atlasName: 'context', spriteName: 'SpeakerOn' }}
              value={'Audio'}
              fontSize={fontSize}
              fontColor={this.audioTextColor}
              onMouseEnter={() => {
                this.audioEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('audio')
              }}
              backgroundColor={this.audioBackgroundColor}
            />

            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.gameplayTextColor}
              icon={{ atlasName: 'icons', spriteName: 'ControlsIcn' }}
              value={'Gameplay'}
              fontSize={fontSize}
              fontColor={this.gameplayTextColor}
              onMouseEnter={() => {
                this.gameplayEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                this.setButtonClicked('gameplay')
              }}
              backgroundColor={this.gameplayBackgroundColor}
            />
          </UiEntity>

          <UiEntity
            uiTransform={{
              width: 'auto',
              height: 'auto'
            }}
          >
            <TextIconButton
              uiTransform={{
                margin: { left: 10, right: 10 },
                padding: { left: 10, right: 10 },
                width: 'auto'
              }}
              iconColor={this.restoreTextColor}
              icon={{ atlasName: 'icons', spriteName: 'RotateIcn' }}
              value={'RESET TO DEFAULT'}
              fontSize={fontSize}
              fontColor={this.restoreTextColor}
              onMouseEnter={() => {
                this.restoreEnter()
              }}
              onMouseLeave={() => {
                this.updateButtons()
              }}
              onMouseDown={() => {
                // this.uiController.settings
                //   .filter(
                //     (setting) =>
                //       setting.category.toLowerCase() === this.buttonClicked
                //   )
                //   .forEach((setting) => {
                //     console.log(
                //       'setting: ',
                //       setting.name,
                //       'value: ',
                //       setting.value
                //     )
                //   })
              }}
              backgroundColor={this.restoreBackgroundColor}
            />
          </UiEntity>
        </UiEntity>

        {/* Content */}
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            margin: canvasInfo.height * 0.05,
            flexGrow: 1
          }}
          uiBackground={{
            textureMode: 'nine-slices',
            texture: {
              src: 'assets/images/backgrounds/rounded.png'
            },
            textureSlices: {
              top: 0.25,
              bottom: 0.25,
              left: 0.25,
              right: 0.25
            },
            color: { ...Color4.Black(), a: 0.7 }
          }}
        >
          <UiEntity
            uiTransform={{
              width: '45%',
              height: canvasInfo.height * 0.7,
              flexDirection: 'column',
              alignItems: 'flex-start',
              overflow: 'scroll',
              scrollVisible: 'vertical'
            }}
            uiBackground={
              {
                // color: { ...Color4.Blue(), a: 0.1 }
              }
            }
          >
            {Object.values(store.getState().settings.explorerSettings)
              .filter(
                (setting) =>
                  setting.category.toLowerCase() === this.buttonClicked
              )
              .map((setting, index) => {
                const namedVariants = setting.namedVariants ?? []
                if (namedVariants.length > 0) {
                  return (
                    <UiEntity
                      uiTransform={{
                        // display:
                        //   setting.category.toLowerCase() === this.buttonClicked
                        //     ? 'flex'
                        //     : 'none',
                        width: sliderWidth,
                        height: sliderHeight,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        elementId: `setting-${setting.name}-${index}-parent`
                      }}
                      onMouseEnter={() => {
                        this.settingsInfoDescription = setting.namedVariants[store.getState().settings.newValues[setting.name] ??
                        setting.value].description
                      }}
                      onMouseLeave={() => {
                        this.dropdownIndexEntered = -1
                      }}
                    >
                      <StyledDropdown
                        uiTransform={{ width: '100%' }}
                        options={setting.namedVariants.map(
                          (variant) => variant.name
                        )}
                        entered={this.dropdownIndexEntered}
                        fontSize={fontSize}
                        isOpen={this.dropdownOpenedSettingName === setting.name}
                        onMouseDown={() => {
                          if (this.dropdownOpenedSettingName === setting.name) {
                            this.dropdownOpenedSettingName = ''
                          } else {
                            this.dropdownOpenedSettingName = setting.name
                          }
                        }}
                        onOptionMouseDown={(selectedIndex, title) => {
                          this.selectOption(selectedIndex, title)
                          this.dropdownOpenedSettingName = ''
                        }}
                        onOptionMouseEnter={(selectedIndex) => {
                          this.dropdownIndexEntered = selectedIndex
                          this.settingsInfoDescription = setting.namedVariants[this.dropdownIndexEntered].description
                        }}
                        onOptionMouseLeave={() => {this.dropdownIndexEntered = -1}}
                        title={setting.name}
                        value={
                          store.getState().settings.newValues[setting.name] ??
                          setting.value
                        }
                      />
                    </UiEntity>
                  )
                } else {
                  return (
                    <Slider
                      title={setting.name}
                      fontSize={fontSize}
                      value={`${
                        store.getState().settings.newValues[setting.name] ??
                        setting.value
                      }`}
                      uiTransform={{
                        width: sliderWidth,
                        height: sliderHeight,
                        elementId: `setting-${setting.name}-${index}-parent`
                        // display:
                        //   setting.category.toLowerCase() === this.buttonClicked
                        //     ? 'flex'
                        //     : 'none'
                      }}
                      sliderSize={sliderWidth * 2}
                      id={`setting-${setting.name}`}
                      position={sliderValueToPercentage(
                        setting.value,
                        setting.minValue,
                        setting.maxValue
                      )}
                      onMouseEnter={() => {
                        this.settingsInfoDescription = setting.description
                      }}
                    />
                  )
                }
              })}
            {/* <UiEntity
              uiTransform={{
                width: '100%',
                height: 400,
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
              uiBackground={{ color: ALMOST_WHITE }}
            /> */}
          </UiEntity>

          <UiEntity
            uiTransform={{
              width: '40%',
              height: canvasInfo.height * 0.7,
              flexDirection: 'column',
              alignItems: 'flex-start',
              margin: { left: '5%' }
              // overflow: 'scroll',
              // scrollVisible: 'hidden',
            }}
            uiBackground={
              {
                // color: { ...Color4.Red(), a: 0.1 }
              }
            }
          >
            <UiEntity
              uiTransform={{
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
              // uiBackground={{ color: Color4.Black() }}
            >
              <Label value={'Settings Info:'} fontSize={fontSize * 1.5} />
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: 1,
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
                uiBackground={{ color: ALMOST_WHITE }}
              />
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: '50%',
                  // height: 300,
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <Label
                  uiTransform={{ width: '100%', height: 'auto' }}
                  value={this.settingsInfoDescription}
                  fontSize={fontSize}
                  textWrap="wrap"
                  textAlign="top-left"
                />
                
              </UiEntity>
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
