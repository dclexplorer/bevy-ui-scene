import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { noop } from '../../../utils/function-utils'
import { Color4 } from '@dcl/ecs-math'
import {
  getCanvasScaleRatio,
  getViewportHeight
} from '../../../service/canvas-ratio'
import {
  MENU_BACKGROUND_TEXTURE,
  ROUNDED_TEXTURE_BACKGROUND
} from '../../../utils/constants'
import { MainContent, ResponsiveContent } from '../backpack-page/BackpackPage'
import {
  LeftSection,
  NavBar,
  NavBarTitle,
  NavButtonBar
} from '../backpack-page/BackpackNavBar'
import { NavButton } from '../../../components/nav-button/NavButton'
import { COLOR } from '../../../components/color-palette'
import { Column, Row } from '../../../components/layout'
import useState = ReactEcs.useState
import { Callback, Label, UiTransformProps } from '@dcl/sdk/react-ecs'
import type { UIController } from '../../../controllers/ui.controller'
import useEffect = ReactEcs.useEffect
import { Setting } from '../../../utils/definitions'
import { BevyApi } from '../../../bevy-api'
import { ExplorerSetting } from '../../../bevy-api/interface'
import { executeTask } from '@dcl/sdk/ecs'
import { DropdownComponent } from '../../../components/dropdown-component'
import { BasicSlider } from 'src/components/slider/BasicSlider'
import { setSettingValue } from '../../../state/settings/actions'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import { getMainMenuHeight } from '../MainMenu'
import { UncontrolledBasicSlider } from '../../../components/slider/UncontrolledBasicSlider'
type SettingCategory =
  | 'General'
  | 'Audio'
  | 'Graphics'
  | 'Gameplay'
  | 'Performance'
  | 'Permissions'
const settingsCategoryTitle: Record<SettingCategory, string> = {
  General: 'General',
  Audio: 'Audio',
  Graphics: 'Graphics',
  Gameplay: 'Gameplay',
  Performance: 'Performance',
  Permissions: 'Permissions'
}

function getSettingsCategoryTitle(category: SettingCategory): string {
  return settingsCategoryTitle[category]
}
export default class SettingsPage2 {
  constructor(uiController: UIController) {}

  mainUi(): ReactElement {
    return (
      <MainContent>
        <SettingsContent />
      </MainContent>
    )
  }

  updateButtons() {}
}
function SettingsContent(): ReactElement {
  const [currentCategory, setCurrentCategory] =
    useState<SettingCategory>(`Gameplay`)
  const [settings, setSettings] = useState<ExplorerSetting[]>([])
  useEffect(() => {
    executeTask(async () => {
      const settings = await BevyApi.getSettings()
      // Round stepSize to maximum 2 decimal places
      const processedSettings = settings.map((setting) => ({
        ...setting,
        stepSize:
          setting.stepSize !== undefined
            ? Math.round(setting.stepSize * 100) / 100
            : setting.stepSize
      }))
      setSettings(processedSettings)
    })
  }, [])

  return (
    <Column uiTransform={{ width: '100%', alignItems: 'center' }}>
      <SettingsNavBar
        currentCategory={currentCategory}
        onChange={(newCat: SettingCategory) => {
          console.log('mnewCAt', newCat)
          setCurrentCategory(newCat)
        }}
      />
      ,
      <ResponsiveContent>
        <Column
          uiTransform={{
            width: '100%',
            margin: { top: '1%' },
            padding: '1%',
            pointerFilter: 'block'
          }}
          uiBackground={{ color: COLOR.DARK_OPACITY_7 }}
        >
          <SettingsCategoryTitle
            title={getSettingsCategoryTitle(currentCategory)}
          />
          <UiEntity
            uiTransform={{
              width: '100%',
              flexWrap: 'wrap',
              overflow: 'scroll',
              height: getViewportHeight() - getMainMenuHeight() * 5
            }}
          >
            {settings
              .filter((s) => s.category === currentCategory)
              .map((setting, index) => (
                <SettingField
                  uiTransform={{
                    zIndex: settings.length - index
                  }}
                  setting={setting}
                  onChange={(value) => {
                    setting.value = value
                    setSettings([...settings])
                    // TODO debounce update
                    BevyApi.setSetting(setting.name, value).catch(console.error)
                  }}
                />
              ))}
          </UiEntity>
        </Column>
      </ResponsiveContent>
    </Column>
  )
}

function SettingField({
  setting,
  uiTransform,
  onChange = noop
}: {
  setting: ExplorerSetting
  uiTransform?: UiTransformProps
  onChange?: (value: number) => void
}) {
  const [refValue, setRefValue] = useState<string>(setting.value.toString())
  // TODO SLIDERS SHOULD HAVE ARROWS IN LEFT AND RIGHT ?
  return (
    <Column
      uiTransform={{
        width: '48%',
        flexShrink: 0,
        margin: { left: '1%', top: '2%' },
        borderColor: COLOR.GREEN,
        borderRadius: 0,
        borderWidth: 1,
        ...uiTransform
      }}
    >
      <Row>
        <UiEntity
          uiTransform={{ width: '100%', alignItems: 'flex-start' }}
          uiText={{
            value: `${setting.name} (${setting.value}) ( ${setting.minValue} - ${setting.maxValue} ) :: defaault:${setting.default} :; stepSize:${setting.stepSize}`, // TODO value must be in other element aligned to right
            textAlign: 'top-left',
            fontSize: getCanvasScaleRatio() * 32
          }}
        />
        {!(setting.namedVariants?.length > 0) && (
          <UiEntity
            uiTransform={{ width: '100%', alignItems: 'flex-end' }}
            uiText={{
              value: `${refValue}`, // TODO value must be in other element aligned to right
              textAlign: 'top-right',
              fontSize: getCanvasScaleRatio() * 32
            }}
          />
        )}
      </Row>

      {setting.namedVariants?.length > 0 ? (
        <DropdownComponent
          options={setting.namedVariants.map(({ name, description }) => ({
            label: name,
            value: name
          }))}
          value={1}
          onChange={() => {}}
        />
      ) : (
        <UncontrolledBasicSlider
          showStepButtons={true}
          min={setting.minValue}
          max={setting.maxValue}
          defaultValue={setting.value}
          stepSize={setting.stepSize}
          uiTransform={{
            alignSelf: 'center',
            width: '100%',
            height: getCanvasScaleRatio() * 100
          }}
          onChange={(value) => {
            // onChange(value)
            setRefValue(value.toString())
          }}
          onRelease={(value) => {
            console.log('onRelease', value)
            onChange(value)
          }}
          uiBackground={{
            color: COLOR.BLACK_TRANSPARENT
          }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: '10%',
              positionType: 'absolute',
              justifyContent: 'center',
              alignSelf: 'center'
            }}
            uiBackground={{
              color: COLOR.WHITE_OPACITY_2
            }}
          />
        </UncontrolledBasicSlider>
      )}
    </Column>
  )
}
export function SettingsCategoryTitle({
  title
}: {
  title: string
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{ width: '100%' }}
      uiText={{
        value: title,
        fontSize: getCanvasScaleRatio() * 42,
        textAlign: 'top-left'
      }}
    />
  )
}

export function SettingsNavBar({
  currentCategory,
  onChange = noop
}: {
  currentCategory: SettingCategory
  onChange?: (category: SettingCategory) => void
}): ReactElement {
  return (
    <NavBar>
      <LeftSection>
        <NavBarTitle
          text={'<b>Settings</b>'}
          canvasScaleRatio={getCanvasScaleRatio()}
        />
        <NavButtonBar>
          <NavButton
            icon={{ spriteName: 'ControlsIcn', atlasName: 'icons' }}
            active={currentCategory === `Gameplay`}
            text={settingsCategoryTitle.Gameplay}
            onClick={() => {
              onChange(`Gameplay`)
            }}
          />
          <NavButton
            icon={{ spriteName: 'Graphics', atlasName: 'icons' }}
            uiTransform={{ margin: { left: 12 } }}
            active={currentCategory === `Graphics`}
            text={settingsCategoryTitle.Graphics}
            onClick={() => {
              console.log('GRAPHICS')
              onChange(`Graphics`)
            }}
          />
          <NavButton
            icon={{ spriteName: 'SpeakerOn', atlasName: 'context' }}
            active={currentCategory === `Audio`}
            text={settingsCategoryTitle.Audio}
            onClick={() => {
              onChange(`Audio`)
            }}
          />
          <NavButton
            icon={{ spriteName: 'Filter', atlasName: 'icons' }}
            active={currentCategory === `Performance`}
            text={settingsCategoryTitle.Performance}
            onClick={() => {
              onChange(`Performance`)
            }}
          />
          <NavButton
            icon={{ spriteName: 'Lock', atlasName: 'icons' }}
            active={currentCategory === `Permissions`}
            text={settingsCategoryTitle.Permissions}
            onClick={() => {
              onChange(`Permissions`)
            }}
          />
        </NavButtonBar>
      </LeftSection>
    </NavBar>
  )
}
