import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import Icon from '../icon/Icon'
import { getViewportHeight, getViewportWidth } from '../../service/canvas-ratio'
import { FilterDefinition, MAP_FILTER_DEFINITIONS } from './map-definitions'
import { Color4 } from '@dcl/sdk/math'
import { COLOR } from '../color-palette'
import { getUiController } from '../../controllers/ui.controller'

export function MapFilterBar(): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
        width: getViewportWidth() - getUiController().sceneCard.panelWidth, // TODO need to well define
        flexWrap: 'wrap'
      }}
    >
      {MAP_FILTER_DEFINITIONS.map((filterDefinition) => (
        <MapFilterBarButton
          key={filterDefinition.id}
          filterDefinition={filterDefinition}
        />
      ))}
    </UiEntity>
  )
}

export function MapFilterBarButton({
  filterDefinition,
  fontSize = getViewportHeight() * 0.018,
  key
}: {
  filterDefinition: FilterDefinition
  fontSize?: number
  key?: string
}) {
  const { spriteName, label, id } = filterDefinition
  return (
    <UiEntity
      uiTransform={{
        borderRadius: fontSize * 10,
        borderColor: COLOR.BLACK_TRANSPARENT,
        borderWidth: 0,
        flexGrow: 0,
        flexShrink: 0,
        margin: '0.2%'
      }}
      uiBackground={{
        color: Color4.White()
      }}
    >
      <Icon
        uiTransform={{
          alignSelf: 'center',
          flexShrink: 0,
          position: { left: '8%' }
        }}
        icon={{ spriteName, atlasName: 'map2' }}
      />
      <UiEntity
        uiText={{
          textWrap: 'nowrap',
          value: `<b> ${label.toUpperCase()}</b>`,
          fontSize,
          color: COLOR.TEXT_COLOR
        }}
      />
    </UiEntity>
  )
}
