import { memoize } from '../../../utils/function-utils'
import {
  fromParcelCoordsToPosition,
  fromStringToCoords,
  Place
} from '../../../service/map-places'
import { PlaceRepresentation, PLAYER_PLACE_ID } from './big-map-view'
import { getCentralParcel } from '../../../components/map/mini-map-info-entities'
import { store } from '../../../state/store'
import { Atlas, AtlasIcon } from '../../../utils/definitions'
import { mapSymbolPerPlaceCategory } from '../../../components/map/map-definitions'

export const decoratePlaceRepresentation = memoize(_decoratePlaceRepresentation)

const getRepresentationSprite = memoize(_getRepresentationSprite)

export function _decoratePlaceRepresentation(
  place: Place | null | undefined
): PlaceRepresentation | null {
  if (place === null || place === undefined) return null
  const centralParcelCoords = fromParcelCoordsToPosition(
    fromStringToCoords(
      getCentralParcel([...place.positions, place.base_position]) as string
    ),
    { height: 0 }
  )

  return {
    ...place,
    centralParcelCoords,
    sprite: getRepresentationSprite(place),
    isActive: place.id === store.getState().hud.placeListActiveItem?.id
  }
}

function _getRepresentationSprite(placeRepresentation: Place): AtlasIcon {
  let spriteName = ''
  let atlasName: Atlas = 'map2'
  if (
    store.getState().hud.placeListActiveItem &&
    placeRepresentation.id === store.getState().hud.placeListActiveItem?.id
  ) {
    spriteName = `GenericPinSelected`
  } else if (placeRepresentation.id === store.getState().hud.homePlace?.id) {
    spriteName = `HomePin`
    // atlasName = 'icons'
  } else if (placeRepresentation.categories.includes('poi')) {
    spriteName = 'PinPOI'
  } else if (placeRepresentation.id === PLAYER_PLACE_ID) {
    spriteName = 'CenterPlayerIcn'
  } else if (
    placeRepresentation.categories.length === 1 &&
    mapSymbolPerPlaceCategory[placeRepresentation.categories[0]]
  ) {
    spriteName = mapSymbolPerPlaceCategory[placeRepresentation.categories[0]]
  } else {
    spriteName = 'GenericPin'
  }

  return { spriteName, atlasName }
}

export function getZIndexForPlaceSymbol(
  placeRepresentation: PlaceRepresentation
) {
  if (placeRepresentation.id === PLAYER_PLACE_ID) return 999
  if (placeRepresentation.sprite.spriteName === 'PinPOI') return 2
  return 1
}

export function isHomePlace(place: PlaceRepresentation | Place): boolean {
  return place.id === store.getState().hud.homePlace?.id
}
