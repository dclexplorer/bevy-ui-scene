import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import Icon from '../icon/Icon'
import { getViewportHeight, getViewportWidth } from '../../service/canvas-ratio'
import { FilterDefinition, MAP_FILTER_DEFINITIONS } from './map-definitions'
import { Color4 } from '@dcl/sdk/math'
import { COLOR } from '../color-palette'
import { getUiController } from '../../controllers/ui.controller'
import { store } from '../../state/store'
import { noop } from '../../utils/function-utils'
import { updateHudStateAction } from '../../state/hud/actions'
import { Label } from '@dcl/sdk/react-ecs'

export function MapFilterBar(): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
        width:
          getViewportWidth() -
          (getUiController().sceneCard.panelWidth ?? getViewportWidth() / 4), // TODO need to well define
        flexWrap: 'wrap'
      }}
    >
      {MAP_FILTER_DEFINITIONS.map((filterDefinition) => (
        <MapFilterBarButton
          active={store
            .getState()
            .hud.mapFilterCategories.includes(filterDefinition.id)}
          key={filterDefinition.id}
          filterDefinition={filterDefinition}
          onClick={() => {
            store.dispatch(
              updateHudStateAction({
                mapFilterCategories: [filterDefinition.id]
              })
            )
          }}
        />
      ))}
    </UiEntity>
  )
}

export function MapFilterBarButton({
  filterDefinition,
  fontSize = getViewportHeight() * 0.018,
  active = false,
  key,
  onClick = noop
}: {
  filterDefinition: FilterDefinition
  fontSize?: number
  active?: boolean
  key?: string
  onClick?: () => void
}) {
  const { spriteName, label, id } = filterDefinition
  return (
    <UiEntity
      uiTransform={{
        borderRadius: fontSize * 10,
        borderColor: COLOR.ACTIVE_BACKGROUND_COLOR,
        borderWidth: active ? fontSize * 0.1 : 0,
        flexGrow: 0,
        flexShrink: 0,
        margin: '0.2%'
      }}
      uiBackground={{
        color: active ? COLOR.ACTIVE_BACKGROUND_COLOR : COLOR.WHITE
      }}
      onMouseDown={onClick}
    >
      {spriteName && (
        <Icon
          uiTransform={{
            alignSelf: 'center',
            flexShrink: 0,
            position: { left: '8%' }
          }}
          iconSize={fontSize * 1.5}
          icon={{ spriteName, atlasName: 'map2' }}
        />
      )}
      <UiEntity
        uiText={{
          textWrap: 'nowrap',
          value: `<b> ${label.toUpperCase()}</b>`,
          fontSize,
          color: active ? COLOR.TEXT_COLOR_WHITE : COLOR.TEXT_COLOR
        }}
      />
    </UiEntity>
  )
}
