import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import useEffect = ReactEcs.useEffect
import {
  fromParcelCoordsToPosition,
  fromStringToCoords,
  getLoadedMapPlaces,
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
import { Vector3 } from '@dcl/sdk/math'
import { getCentralParcel } from '../../../components/map/mini-map-info-entities'
import Icon from '../../../components/icon/Icon'
import {
  getCanvasScaleRatio,
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
  getBigMapCameraEntity,
  ISO_OFFSET
} from '../../../service/map-camera'
import { MapFilterBar } from '../../../components/map/map-filter-bar'
import {
  getPlayerParcel,
  getVector3Parcel
} from '../../../service/player-scenes'
import { getUiController } from '../../../controllers/ui.controller'
import { store } from '../../../state/store'
import { SceneCatalogPanel } from '../../../components/map/scene-catalog-panel'

const FOV = (45 * 1.25 * Math.PI) / 180
const PLAYER_PLACE_ID = 'player'
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
  moving: false,
  lastClickTime: 0
}
const PLAYER_PLACE_LABEL = 'ME'
export type PlaceRepresentation = Place & { centralParcelCoords: Vector3 }

function BigMapContent(): ReactElement {
  const [placesRepresentations, setPlacesRepresentations] = useState<
    PlaceRepresentation[]
  >([])
  const initialPlayerParcel = getPlayerParcel()
  const [playerRespresentation, setPlayerRespresentation] =
    useState<PlaceRepresentation>({
      id: PLAYER_PLACE_ID,
      title: PLAYER_PLACE_LABEL,
      positions: [],
      categories: [PLAYER_PLACE_ID],
      base_position: `${initialPlayerParcel.x},${initialPlayerParcel.y}`,
      centralParcelCoords: fromParcelCoordsToPosition(initialPlayerParcel, {
        height: 0
      })
    })
  const [allRepresentations, setAllRepresentations] = useState<
    PlaceRepresentation[]
  >([])

  useEffect(() => {
    const initBigMapFn = async () => {
      const _representations = Object.values(getLoadedMapPlaces())
        .map((place) => {
          const centralParcelCoords = fromParcelCoordsToPosition(
            fromStringToCoords(
              getCentralParcel([
                ...place.positions,
                place.base_position
              ]) as string
            ),
            { height: 0 }
          )

          return {
            ...place,
            centralParcelCoords
          }
        })
        .filter((p: PlaceRepresentation) =>
          p.categories.some((c: string) =>
            store.getState().hud.mapFilterCategories.includes(c)
          )
        )
      setAllRepresentations([playerRespresentation, ..._representations])
      setPlacesRepresentations(_representations)
    }
    console.log(
      'updating place representations big map based on []',
      Object.values(getLoadedMapPlaces()).length
    )
    initBigMapFn().catch(console.error)
  }, [getLoadedMapPlaces(), store.getState().hud.mapFilterCategories])

  useEffect(() => {
    console.log('updating UI big map based on player parcel')
    const foundPlayer = placesRepresentations.find(
      (p: PlaceRepresentation) => p.id === PLAYER_PLACE_ID
    )
    const playerParcel = getPlayerParcel()
    let _playerRepresentation: PlaceRepresentation = foundPlayer ?? {
      id: PLAYER_PLACE_ID,
      title: PLAYER_PLACE_LABEL,
      positions: [],
      categories: [PLAYER_PLACE_ID],
      base_position: `${playerParcel.x},${playerParcel.y}`,
      centralParcelCoords: fromParcelCoordsToPosition(playerParcel, {
        height: 0
      })
    }
    if (foundPlayer) {
      foundPlayer.centralParcelCoords = fromParcelCoordsToPosition(
        playerParcel,
        { height: 0 }
      )
    } else {
      placesRepresentations.unshift(_playerRepresentation)
    }
    setPlayerRespresentation(_playerRepresentation)
    setAllRepresentations([_playerRepresentation, ...placesRepresentations])
  }, [getPlayerParcel()])

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
        state.dragging = true
        activateDragMapSystem()
      }}
      onMouseDragEnd={() => {
        executeTask(async () => {
          // TODO REVIEW: why onMouseDrag/onMouseDragLocked is called continuously, then I cannot set dragging to false
          await sleep(0)
          state.dragging = false
        })
        deactivateDragMapSystem()

        state.dragging = false
      }}
      onMouseUp={() => {}}
      onMouseDown={() => {
        if (Date.now() - state.lastClickTime < 300) {
          state.dragging = false
          const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
          if (!pointerInfo?.screenCoordinates) return

          const mapCameraTransform = Transform.get(getBigMapCameraEntity())

          const targetPosition: Vector3 = screenToGround(
            pointerInfo.screenCoordinates.x,
            pointerInfo.screenCoordinates.y,
            getViewportWidth(),
            getViewportHeight(),
            mapCameraTransform.position,
            mapCameraTransform.rotation,
            FOV
          ) as Vector3

          Tween.createOrReplace(getBigMapCameraEntity(), {
            mode: Tween.Mode.Move({
              start: Vector3.clone(mapCameraTransform.position),
              end: Vector3.add(targetPosition, Vector3.create(...ISO_OFFSET))
            }),
            duration: 500,
            easingFunction: EasingFunction.EF_EASECUBIC
          })

          executeTask(async () => {
            state.moving = true
            await sleep(500)
            state.moving = false
          })
          const parcelVector3 = getVector3Parcel(targetPosition)

          getUiController().sceneCard.showByCoords(
            Vector3.create(parcelVector3.x, 0, parcelVector3.y)
          )
        }
        state.lastClickTime = Date.now()
      }}
    >
      {!(state.dragging || state.moving) &&
        allRepresentations.map((placeRepresentation) => {
          // TODO optimize, only calculate when camera position or rotation changes, and with throttle
          const position = worldToScreenPx(
            placeRepresentation.centralParcelCoords,
            Transform.get(engine.CameraEntity).position,
            Transform.get(engine.CameraEntity).rotation,
            FOV,
            getViewportWidth(),
            getViewportHeight(),
            {
              fovIsHorizontal: false,
              forwardIsNegZ: false
            }
          )
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
                justifyContent: 'center'
              }}
              key={placeRepresentation.id}
            >
              <Icon
                icon={{
                  spriteName:
                    placeRepresentation.id === PLAYER_PLACE_ID
                      ? 'PlayersIcn'
                      : 'POI',
                  atlasName: 'map2'
                }}
                uiTransform={{
                  positionType: 'absolute',
                  alignSelf: 'center',
                  position: {
                    top: -(getCanvasScaleRatio() * 50) / 4,
                    left: -(getCanvasScaleRatio() * 50) / 4
                  },
                  width: getCanvasScaleRatio() * 50,
                  height: getCanvasScaleRatio() * 50
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
        })}
      <MapFilterBar />
    </UiEntity>
  )
}
