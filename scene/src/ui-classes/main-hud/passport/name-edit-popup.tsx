import ReactEcs, { Button, type ReactElement, UiEntity } from '@dcl/react-ecs'
import { store } from '../../../state/store'
import { COLOR } from '../../../components/color-palette'
import {
  closeLastPopupAction,
  pushPopupAction,
  updateHudStateAction
} from '../../../state/hud/actions'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'
import { cloneDeep, noop } from '../../../utils/function-utils'
import { type Popup } from '../../../components/popup-stack'
import { type Tab, TabComponent } from '../../../components/tab-component'
import { fetchAllUserNames } from '../../../utils/passport-promise-utils'
import { executeTask } from '@dcl/sdk/ecs'
import { sleep, waitFor } from '../../../utils/dcl-utils'
import { DropdownComponent } from '../../../components/dropdown-component'
import { openExternalUrl } from '~system/RestrictedActions'
import { Input } from '@dcl/sdk/react-ecs'
import { BevyApi } from '../../../bevy-api'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'
import useEffect = ReactEcs.useEffect
import { type SetAvatarData } from '../../../bevy-api/interface'

const { useState } = ReactEcs

const NAME_EDIT_TABS = [
  { text: 'UNIQUE NAME' },
  { text: 'NON-UNIQUE USERNAME' }
]

const BUTTON_TEXT_COLOR = { ...COLOR.WHITE }

const EditNameContent = (): ReactElement => {
  const profileData = store.getState().hud.profileData
  const [selectableNames, setSelectableNames] = useState<
    { value: string; label: string }[]
  >([{ value: '', label: '' }])
  const [selectedName, setSelectedName] = useState<string>(
    profileData.name ?? ''
  )
  const [customName, setCustomName] = useState<string>(profileData.name ?? '')

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [tabs, setTabs] = useState<Tab[]>(NAME_EDIT_TABS)

  useEffect((): void => {
    executeTask(async () => {
      setLoading(true)
      await waitFor(() => !!store.getState().hud.profileData.userId)
      const profileData = store.getState().hud.profileData
      const nameDefinitions = await fetchAllUserNames({
        userId: profileData.userId
      })
      const names = nameDefinitions.map((n) => n.name).concat('')
      const activeTab = nameDefinitions.length ? 0 : 1
      const tabs = nameDefinitions.length
        ? cloneDeep(NAME_EDIT_TABS).map((tabDefinition, index) => {
            return { ...tabDefinition, active: index === activeTab }
          })
        : []

      setActiveTab(activeTab)
      setTabs(tabs)
      setSelectableNames(names.map((n) => ({ value: n, label: n })))
      setSelectedName(!names.includes(profileData.name) ? '' : profileData.name)
      setLoading(false)
      setCustomName(profileData.hasClaimedName ? '' : profileData.name)

      console.log('activeTab', activeTab)
    })
  }, [])
  const onSave = (selectedName: string): void => {
    const hasClaimedName = !!selectableNames.find(
      (s) => s.value === selectedName
    )
    executeTask(async () => {
      setLoading(true)
      let failed = false
      const avatarPayload: SetAvatarData = {
        base: {
          ...store.getState().backpack.outfitSetup.base,
          name: selectedName
        },
        hasClaimedName
      }

      await BevyApi.setAvatar(avatarPayload).catch((error) => {
        console.error('onSave error', error)

        store.dispatch(
          pushPopupAction({
            type: HUD_POPUP_TYPE.ERROR,
            data: error
          })
        )
        failed = true
      })
      setLoading(false)
      if (!failed) {
        store.dispatch(closeLastPopupAction())
        store.dispatch(
          updateHudStateAction({
            profileData: {
              ...store.getState().hud.profileData,
              name: selectedName,
              hasClaimedName
            }
          })
        )
      }
    })
  }
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0
      }}
    >
      <UiEntity
        uiText={{
          value: '<b>Edit Username</b>',
          fontSize: getCanvasScaleRatio() * 50
        }}
      />
      <UiEntity
        uiTransform={{
          width: '100%',
          padding: '2%',
          flexDirection: 'column',
          alignItems: 'flex-start',
          zIndex: 1
        }}
      >
        {tabs.length && (
          <TabComponent
            tabs={tabs}
            fontSize={getCanvasScaleRatio() * 32}
            uiTransform={{ width: '100%', margin: { bottom: '2%' } }}
            onClickTab={(activeTab: number) => {
              const tabs = cloneDeep(NAME_EDIT_TABS).map(
                (tabDefinition, index) => {
                  return { ...tabDefinition, active: index === activeTab }
                }
              )

              setActiveTab(activeTab)
              setTabs(tabs)
            }}
          />
        )}

        {!loading && activeTab === 0 && selectableNames.length > 1 && (
          <UniqueNameForm
            selectableNames={selectableNames}
            selectedName={selectedName}
            onChange={(value: string) => {
              setSelectedName(value)
            }}
            disabled={loading}
            onSave={onSave}
          />
        )}
        {!loading && activeTab === 1 && (
          <NameForm
            value={customName}
            onChange={(value: string) => {
              setCustomName(value)
            }}
            disabled={loading}
            onSave={onSave}
          />
        )}
      </UiEntity>

      <UiEntity
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: 'assets/images/claim_name_banner.png'
          }
        }}
        uiTransform={{
          width: '100%',
          height: '50%',
          positionType: 'absolute',
          position: { bottom: 0 },
          opacity: loading ? 0.5 : 1
        }}
        onMouseDown={() => {
          executeTask(async () => {
            setLoading(true)
            openExternalUrl({
              url: 'https://decentraland.org/marketplace/names/claim'
            }).catch(console.error)
            await sleep(1000)
            setLoading(false)
          })
        }}
      />
    </UiEntity>
  )
}

export const NameForm = ({
  disabled = false,
  onChange = noop,
  onSave = noop,
  value = ''
}: {
  disabled?: boolean
  onChange?: (value: string) => void
  onSave?: (value: string) => void
  value?: string
}): ReactElement => {
  const [textValue, setTextValue] = useState(value)
  return (
    <UiEntity uiTransform={{ flexDirection: 'column', width: '100%' }}>
      <Input
        uiTransform={{
          width: '94%',
          flexShrink: 0,
          flexGrow: 0,
          height: getCanvasScaleRatio() * 88,
          margin: { top: getCanvasScaleRatio() * 14 },
          borderColor: COLOR.BLACK_TRANSPARENT,
          borderRadius: getCanvasScaleRatio() * 30,
          borderWidth: 0,
          padding: getCanvasScaleRatio() * 20
        }}
        fontSize={getCanvasScaleRatio() * 40}
        uiBackground={{
          color: COLOR.WHITE
        }}
        value={textValue}
        onChange={(value) => {
          setTextValue(value)
          onChange(value)
        }}
        disabled={disabled}
        placeholder={'Write a name...'}
      />

      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: { top: '5%' },
          width: '100%'
        }}
      >
        <Button
          uiTransform={{
            borderRadius: getCanvasScaleRatio() * 20,
            borderColor: COLOR.WHITE_OPACITY_1,
            borderWidth: 0,
            width: '40%',
            margin: { right: '5%' },
            opacity: disabled ? 0.5 : 1
          }}
          fontSize={getCanvasScaleRatio() * 40}
          uiBackground={{
            color: COLOR.WHITE_OPACITY_1
          }}
          disabled={disabled}
          color={BUTTON_TEXT_COLOR}
          value={'CANCEL'}
          onMouseDown={() => {
            store.dispatch(closeLastPopupAction())
          }}
        />
        <Button
          variant={'primary'}
          uiTransform={{
            width: '40%',
            borderRadius: getCanvasScaleRatio() * 20,
            borderColor: COLOR.BLACK_TRANSPARENT,
            borderWidth: 0
          }}
          fontSize={getCanvasScaleRatio() * 40}
          value={'SAVE'}
          disabled={disabled || !textValue?.length || isInvalidName(textValue)}
          onMouseDown={() => {
            onSave(textValue)
          }}
        />
      </UiEntity>
    </UiEntity>
  )

  function isInvalidName(name: string): boolean {
    if (name.indexOf(' ') > 1) return true
    return false
  }
}

export const UniqueNameForm = ({
  selectableNames,
  selectedName,
  disabled = false,
  onChange = noop,
  onSave = noop
}: {
  selectableNames: { value: any; label: string }[]
  selectedName: string
  disabled?: boolean
  onChange?: (value: string) => void
  onSave?: (selectedName: string) => void
}): ReactElement => {
  return (
    <UiEntity
      uiTransform={{ flexDirection: 'column', width: '100%', zIndex: 1 }}
    >
      <DropdownComponent
        dropdownId={'unique-name-selector'}
        uiTransform={{
          width: '97%',
          zIndex: 999999,
          margin: { top: getCanvasScaleRatio() * -20 },
          borderColor: COLOR.BLACK_TRANSPARENT,
          borderRadius: getCanvasScaleRatio() * 30,
          borderWidth: 0
        }}
        fontSize={getCanvasScaleRatio() * 40}
        scroll={true}
        options={selectableNames}
        value={selectedName}
        onChange={onChange}
        disabled={disabled}
      />
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: { top: '5%' },
          width: '100%'
        }}
      >
        <Button
          uiTransform={{
            borderRadius: getCanvasScaleRatio() * 20,
            borderColor: COLOR.WHITE_OPACITY_1,
            borderWidth: 0,
            width: '40%',
            margin: { right: '5%' },
            height: getCanvasScaleRatio() * 100,
            opacity: disabled ? 0.5 : 1
          }}
          fontSize={getCanvasScaleRatio() * 40}
          uiBackground={{
            color: COLOR.WHITE_OPACITY_1
          }}
          disabled={disabled}
          color={BUTTON_TEXT_COLOR}
          value={'CANCEL'}
          onMouseDown={() => {
            store.dispatch(closeLastPopupAction())
          }}
        />
        <Button
          variant={'primary'}
          uiTransform={{
            width: '40%',
            borderRadius: getCanvasScaleRatio() * 20,
            borderColor: COLOR.BLACK_TRANSPARENT,
            borderWidth: 0,
            height: getCanvasScaleRatio() * 100,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center'
          }}
          fontSize={getCanvasScaleRatio() * 40}
          value={'SAVE'}
          disabled={
            disabled || selectedName === store.getState().hud.profileData.name
          }
          onMouseDown={() => {
            onSave(selectedName)
          }}
        />
      </UiEntity>
    </UiEntity>
  )
}

export const NameEditPopup: Popup = () => {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        zIndex: 999,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_7
      }}
      onMouseDown={() => {
        closeDialog()
      }}
    >
      <UiEntity
        uiTransform={{
          width: getCanvasScaleRatio() * 1200,
          height: getCanvasScaleRatio() * 1049,
          borderRadius: BORDER_RADIUS_F,
          borderWidth: 0,
          borderColor: COLOR.WHITE,
          alignItems: 'flex-start',
          flexDirection: 'column',
          padding: 0
        }}
        onMouseDown={noop}
        uiBackground={{
          color: COLOR.URL_POPUP_BACKGROUND
        }}
      >
        <EditNameContent />
      </UiEntity>
    </UiEntity>
  )

  function closeDialog(): void {
    store.dispatch(closeLastPopupAction())
  }
}
