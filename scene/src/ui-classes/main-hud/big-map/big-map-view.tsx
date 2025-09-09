import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import useEffect = ReactEcs.useEffect
import {
  fromParcelCoordsToPosition,
  fromStringToCoords,
  getLoadedMapPlaces,
  getPlacesAroundParcel,
  Place
} from '../../../service/map-places'
import {
  EasingFunction,
  engine,
  executeTask,
  PrimaryPointerInfo,
  Transform,
  Tween
} from '@dcl/sdk/ecs'
import { sleep, waitFor } from '../../../utils/dcl-utils'
import useState = ReactEcs.useState
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { getCentralParcel } from '../../../components/map/mini-map-info-entities'
import Icon from '../../../components/icon/Icon'
import {
  getCanvasScaleRatio,
  getRightPanelWidth,
  getViewportHeight,
  getViewportWidth
} from '../../../service/canvas-ratio'
import {
  screenToGround,
  worldToScreenPx
} from '../../../service/perspective-to-screen'
import {
  activateDragMapSystem,
  deactivateDragMapSystem,
  displaceCamera,
  getBigMapCameraEntity
} from '../../../service/map-camera'
import { MapFilterBar } from '../../../components/map/map-filter-bar'
import {
  getPlayerParcel,
  getVector3Parcel
} from '../../../service/player-scenes'
import { getUiController } from '../../../controllers/ui.controller'
import { store } from '../../../state/store'
import { SceneCatalogPanel } from '../../../components/map/scene-catalog-panel'
import { dedupeById, memoize } from '../../../utils/function-utils'
import { Label } from '@dcl/sdk/react-ecs'
import { updateHudStateAction } from '../../../state/hud/actions'
import { Atlas, AtlasIcon } from '../../../utils/definitions'
import { mapSymbolPerPlaceCategory } from '../../../components/map/map-definitions'
import { MapBottomLeftBar } from '../../../components/map/map-bottom-left-bar'
import { getHudFontSize } from '../scene-info/SceneInfo'
import { BevyApi } from '../../../bevy-api'
import { fetchPlaceFromCoords } from '../../../utils/promise-utils'

export const FOV = (45 * 1.25 * Math.PI) / 180

const PLAYER_PLACE_ID = 'player'
const getRepresentationSprite = memoize(_getRepresentationSprite)
export const BigMap = (): ReactElement => {
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%'
      }}
    >
      <BigMapContent />
    </UiEntity>
  )
}
const state = {
  dragging: false,
  lastClickTime: 0
}
const PLAYER_PLACE_LABEL = 'ME'
export type PlaceRepresentation = Place & {
  centralParcelCoords: Vector3
  sprite: AtlasIcon
  isActive: boolean
}
export type OrderType =
  | 'most_active'
  | 'like_score'
  | 'updated_at'
  | 'created_at'
  | null
export const decoratePlaceRepresentation = memoize(_decoratePlaceRepresentation)

function BigMapContent(): ReactElement {
  const [orderType, setOrderType] = useState<OrderType>(null)
  const [placesRepresentations, setPlacesRepresentations] = useState<
    PlaceRepresentation[]
  >([])
  const initialPlayerParcel = getPlayerParcel()
  const [playerRespresentation, setPlayerRespresentation] =
    useState<PlaceRepresentation>(
      decoratePlaceRepresentation({
        id: PLAYER_PLACE_ID,
        title: PLAYER_PLACE_LABEL,
        positions: [],
        categories: [PLAYER_PLACE_ID],
        base_position: `${initialPlayerParcel.x},${initialPlayerParcel.y}`
      }) as PlaceRepresentation
    )
  const [allRepresentations, setAllRepresentations] = useState<
    PlaceRepresentation[]
  >([])
  // TODO maybe we should optimize to those that are out of screen, and show nothing while the camera is moving, especially with "all" filters
  // TODO review if it makes sense all the useEffect and their listenings

  useEffect(() => {
    store.dispatch(updateHudStateAction({ placeListActiveItem: null }))
    const u1 = getUiController().sceneCard.onHide(() => {
      store.dispatch(updateHudStateAction({ placeListActiveItem: null }))
    })
    const u2 = getUiController().sceneCard.onShow(() => {
      store.dispatch(
        updateHudStateAction({
          placeListActiveItem: getUiController().sceneCard.place
        })
      )
    })
    executeTask(async () => {
      await sleep(2000)
      store.dispatch(
        updateHudStateAction({
          movingMap: false
        })
      )

      try {
        const home = await BevyApi.getHomeScene()
        const homePlace = await fetchPlaceFromCoords(
          Vector3.create(home.parcel.x, 0, home.parcel.y)
        )
        console.log('homePlace', homePlace)
        if (homePlace)
          store.dispatch(
            updateHudStateAction({
              homePlace
            })
          )
      } catch (error) {}
    })

    return () => {
      u1()
      u2()
    }
  }, [])

  useEffect(() => {
    const initBigMapFn = async () => {
      console.log('initBigMapFn')

      const _representations: PlaceRepresentation[] =
        store.getState().hud.mapFilterCategories[0] === 'favorites'
          ? []
          : (Object.values(getLoadedMapPlaces())
              .map(decoratePlaceRepresentation)
              .filter(
                (p) =>
                  p?.categories.some(
                    (c: string) =>
                      store.getState().hud.mapFilterCategories.includes(c) ||
                      store.getState().hud.mapFilterCategories[0] === 'all'
                  )
              ) as PlaceRepresentation[])

      setPlacesRepresentations(_representations)
      setAllRepresentations(
        dedupeById(
          [
            playerRespresentation,
            decoratePlaceRepresentation(store.getState().hud.homePlace),
            ..._representations,
            decoratePlaceRepresentation(
              store.getState().hud.placeListActiveItem
            )
          ].filter((p) => p) as PlaceRepresentation[]
        )
      )
    }
    console.log(
      'updating place representations big map based on []',
      Object.values(getLoadedMapPlaces()).length
    )
    initBigMapFn().catch(console.error)
  }, [
    getLoadedMapPlaces(),
    store.getState().hud.mapFilterCategories,
    store.getState().hud.homePlace
  ])
  useEffect(() => {
    if (store.getState().hud.mapFilterCategories[0] === 'favorites') {
      setAllRepresentations(
        dedupeById(
          [
            playerRespresentation,
            decoratePlaceRepresentation(store.getState().hud.homePlace),
            ...store
              .getState()
              .hud.sceneList.data.map(decoratePlaceRepresentation),
            decoratePlaceRepresentation(
              store.getState().hud.placeListActiveItem
            )
          ].filter((p) => p) as PlaceRepresentation[]
        )
      )
    }
  }, [store.getState().hud.sceneList])
  useEffect(() => {
    const playerParcel = getPlayerParcel()
    let _playerRepresentation: PlaceRepresentation =
      decoratePlaceRepresentation({
        id: PLAYER_PLACE_ID,
        title: PLAYER_PLACE_LABEL,
        positions: [],
        categories: [PLAYER_PLACE_ID],
        base_position: `${playerParcel.x},${playerParcel.y}`,
        centralParcelCoords: fromParcelCoordsToPosition(playerParcel, {
          height: 0
        })
      }) as PlaceRepresentation

    setPlayerRespresentation(_playerRepresentation)
    setAllRepresentations(
      dedupeById(
        [
          _playerRepresentation,
          decoratePlaceRepresentation(store.getState().hud.homePlace),
          ...placesRepresentations.map(decoratePlaceRepresentation),
          decoratePlaceRepresentation(store.getState().hud.placeListActiveItem)
        ].filter((p) => p) as PlaceRepresentation[]
      )
    )
  }, [
    getPlayerParcel(),
    placesRepresentations,
    store.getState().hud.placeListActiveItem
  ])

  // TODO don't show genesis city points when in other realm/world/server
  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_2
      }}
      onMouseDrag={(event) => {
        if (!state.dragging && !store.getState().hud.movingMap) {
          state.dragging = true
          activateDragMapSystem()
        }
      }}
      onMouseDragEnd={() => {
        executeTask(async () => {
          if (!state.dragging) return
          // TODO REVIEW: why onMouseDrag/onMouseDragLocked is called continuously, then I cannot set dragging to false
          await sleep(500)
          state.dragging = false
        })
        deactivateDragMapSystem()
        state.dragging = false
      }}
      onMouseUp={() => {
        state.dragging = false
      }}
      onMouseDown={() => {
        if (state.dragging || store.getState().hud.movingMap) return
        if (Date.now() - state.lastClickTime < 300) {
          state.lastClickTime = 0
          const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
          if (!pointerInfo?.screenCoordinates) return

          const mapCameraTransform = Transform.get(getBigMapCameraEntity())

          const targetPosition: Vector3 = screenToGround(
            pointerInfo.screenCoordinates.x, // TODO REVIEW + getRightPanelWidth() / 2, to move camera more centered
            pointerInfo.screenCoordinates.y,
            getViewportWidth(),
            getViewportHeight(),
            mapCameraTransform.position,
            mapCameraTransform.rotation,
            FOV
          ) as Vector3

          displaceCamera(targetPosition)

          const parcelVector3 = getVector3Parcel(targetPosition)
          getUiController().sceneCard.showByCoords(
            Vector3.create(parcelVector3.x, 0, parcelVector3.y)
          )
        }
        state.lastClickTime = Date.now()
      }}
    >
      <UiEntity uiTransform={{ positionType: 'absolute', position: 0 }}>
        {!store.getState().hud.movingMap &&
          !state.dragging &&
          allRepresentations.map((placeRepresentation) => {
            try {
              // TODO optimize, only calculate when camera position or rotation changes, and with throttle
              const position = worldToScreenPx(
                placeRepresentation.centralParcelCoords,
                Transform.getOrNull(getBigMapCameraEntity())?.position ??
                  Vector3.Zero(),
                Transform.getOrNull(getBigMapCameraEntity())?.rotation ??
                  Quaternion.Zero(),
                FOV,
                getViewportWidth(),
                getViewportHeight(),
                {
                  fovIsHorizontal: false,
                  forwardIsNegZ: false
                }
              )

              const sizeMultiplier = placeRepresentation.isActive
                ? 2
                : placeRepresentation.sprite.spriteName === 'PinPOI'
                ? 1.5
                : 1

              return (
                <UiEntity
                  uiTransform={{
                    positionType: 'absolute',
                    position: {
                      left: position.left,
                      top: position.top
                    },
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    zIndex: getZIndexForPlaceSymbol(placeRepresentation)
                  }}
                  key={placeRepresentation.id}
                >
                  <Icon
                    icon={placeRepresentation.sprite}
                    iconColor={
                      placeRepresentation.id === PLAYER_PLACE_ID
                        ? COLOR.RED
                        : isHomePlace(placeRepresentation)
                        ? COLOR.WHITE
                        : undefined
                    }
                    uiTransform={{
                      positionType: 'absolute',
                      alignSelf: 'center',
                      position: {
                        top: -(getCanvasScaleRatio() * 50 * sizeMultiplier) / 2,
                        left: -(getCanvasScaleRatio() * 50 * sizeMultiplier) / 2
                      },
                      width: getCanvasScaleRatio() * 50 * sizeMultiplier,
                      height: getCanvasScaleRatio() * 50 * sizeMultiplier * 1.1
                    }}
                    onMouseDown={() => {
                      const coords = fromStringToCoords(
                        placeRepresentation.base_position
                      )
                      getUiController().sceneCard.showByCoords(
                        Vector3.create(coords.x, 0, coords.y)
                      )
                    }}
                  />
                  {(placeRepresentation.id === PLAYER_PLACE_ID ||
                    isHomePlace(placeRepresentation)) && (
                    <UiEntity
                      uiTransform={{
                        position: {
                          top:
                            (getCanvasScaleRatio() * 50 * sizeMultiplier) / 2,
                          left: isHomePlace(placeRepresentation)
                            ? -getCanvasScaleRatio() * 50
                            : -getCanvasScaleRatio() * 100
                        },

                        alignSelf: 'center'
                      }}
                      uiText={{
                        value: isHomePlace(placeRepresentation)
                          ? 'Home'
                          : 'You are here',
                        textAlign: 'top-center'
                      }}
                      uiBackground={{
                        color: COLOR.DARK_OPACITY_5
                      }}
                    />
                  )}

                  {/* <UiEntity
                uiTransform={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  alignContent: 'center'
                }}
                uiText={{
                  value: placeRepresentation.title,
                  fontSize: getCanvasScaleRatio() * 50,
                  textAlign: 'top-center'
                }}
              />*/}
                </UiEntity>
              )
            } catch (error) {
              console.error('ERROR IN MAP', error)
              return null
            }
          })}
      </UiEntity>

      <MapFilterBar />
      <MapStatusBar />
      <MapBottomLeftBar />
    </UiEntity>
  )
}

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
    spriteName = `HomeSolid`
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

function MapStatusBar(): ReactElement {
  const [coordsStr, setCoordsStr] = useState<string>('-,-')
  useEffect(() => {
    try {
      const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
      const mapCameraTransform = Transform.get(getBigMapCameraEntity())
      const targetPosition: Vector3 = screenToGround(
        pointerInfo!.screenCoordinates!.x, // TODO REVIEW + getRightPanelWidth() / 2, to move camera more centered
        pointerInfo!.screenCoordinates!.y,
        getViewportWidth(),
        getViewportHeight(),
        mapCameraTransform.position,
        mapCameraTransform.rotation,
        FOV
      ) as Vector3

      const { x, y } = getVector3Parcel(targetPosition)
      const place = getPlacesAroundParcel({ x, y }, 0)
      const parcelName = place[0]?.title ?? ''
      setCoordsStr(`${x},${y} ${parcelName}`)
    } catch (error) {}
  })

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: { bottom: 0 }
      }}
      uiText={{
        value: coordsStr,
        color: COLOR.WHITE,
        fontSize: getViewportHeight() * 0.02
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_5
      }}
    />
  )
}

function getZIndexForPlaceSymbol(placeRepresentation: PlaceRepresentation) {
  if (placeRepresentation.id === PLAYER_PLACE_ID) return 999
  if (placeRepresentation.sprite.spriteName === 'PinPOI') return 2
  return 1
}

function isHomePlace(place: PlaceRepresentation | Place): boolean {
  return place.id === store.getState().hud.homePlace?.id
}
