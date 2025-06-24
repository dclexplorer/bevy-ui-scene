import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { store } from '../../../state/store'
import { COLOR } from '../../../components/color-palette'
import {
  closeLastPopupAction,
  updateHudStateAction
} from '../../../state/hud/actions'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { BORDER_RADIUS_F } from '../../../utils/ui-utils'
import { cloneDeep, noop } from '../../../utils/function-utils'
import { HUD_POPUP_TYPE } from '../../../state/hud/state'
import { type Popup } from '../../../components/popup-stack'
import { TabComponent } from '../../../components/tab-component'
import {
  fetchAllUserNames,
  NameDefinition
} from '../../../utils/passport-promise-utils'
import useEffect = ReactEcs.useEffect
import { executeTask } from '@dcl/sdk/ecs'
import { waitFor } from '../../../utils/dcl-utils'
import { DropdownComponent } from '../../../components/dropdown-component'

const { useState } = ReactEcs

const state = {
  rememberDomain: false
}
const NAME_EDIT_TABS = [
  { text: 'UNIQUE NAME', active: true },
  { text: 'NON-UNIQUE USERNAME' }
]

const EditNameContent = () => {
  const [names, setNames] = useState<string[]>([''])
  const [selectedName, setSelectedName] = useState<string | null>(
    store.getState().hud.profileData.name
  )

  useEffect((): void => {
    executeTask(async () => {
      await waitFor(() => !!store.getState().hud.profileData.userId)

      const nameDefinitions = await fetchAllUserNames({
        userId: store.getState().hud.profileData.userId
      })
      const names = nameDefinitions.map((n) => n.name).concat('') as string[]

      setNames(names)
      setSelectedName(store.getState().hud.profileData.name)
    })
  }, [])

  return (
    <UiEntity uiTransform={{ flexDirection: 'column', width: '100%' }}>
      <UiEntity
        uiText={{
          value: '<b>Edit Username</b>',
          fontSize: getCanvasScaleRatio() * 50
        }}
      />
      <TabComponent
        tabs={NAME_EDIT_TABS}
        fontSize={getCanvasScaleRatio() * 32}
        uiTransform={{ width: '100%', margin: { bottom: '2%' } }}
      />
      <DropdownComponent
        dropdownId={'unique-name-selector'}
        uiTransform={{
          width: '97%',
          zIndex: 999999,
          margin: { top: getCanvasScaleRatio() * -20 },
          height: getCanvasScaleRatio() * 60,
          borderColor: COLOR.BLACK_TRANSPARENT,
          borderRadius: getCanvasScaleRatio() * 16,
          borderWidth: 0
        }}
        scroll={true}
        options={names}
        value={selectedName}
        onChange={(name) => setSelectedName(name)}
        disabled={false}
      />
    </UiEntity>
  )
}

export const NameEditPopup: Popup = ({ shownPopup }) => {
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
          padding: '1%'
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
