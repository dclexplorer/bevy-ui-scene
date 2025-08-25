import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import useEffect = ReactEcs.useEffect
import {
  fromParcelCoordsToPosition,
  fromStringToCoords,
  getLoadedMapPlaces,
  getPlacesAroundParcel,
  isMapPlacesLoaded,
  Place
} from '../../../service/map-places'
import {
  EasingFunction,
  engine,
  executeTask,
  Move,
  PrimaryPointerInfo,
  Transform,
  Tween,
  VirtualCamera
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
  panCameraXZ,
  screenToGround,
  worldToScreenPx
} from '../../../service/perspective-to-screen'
import { Label } from '@dcl/sdk/react-ecs'
import { getBigMapCameraEntity, ISO_OFFSET } from '../../../service/map-camera'
import { MapFilterBar } from '../../../components/map/map-filter-bar'
import { getPlayerParcel } from '../../../service/player-scenes'
import { getPlayer } from '@dcl/sdk/players'
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
const state = { dragging: false, moving: false, lastClickTime: 0 }
export type PlaceRepresentation = Place & { centralParcelCoords: Vector3 }
function BigMapContent(): ReactElement {
  const [placesRepresentations, setPlacesRepresentations] = useState<
    PlaceRepresentation[]
  >([])
  const initialPlayerParcel = getPlayerParcel()
  const [playerRespresentation, setPlayerRespresentation] =
    useState<PlaceRepresentation>({
      id: PLAYER_PLACE_ID,
      title: '',
      positions: [],
      base_position: `${initialPlayerParcel.x},${initialPlayerParcel.y}`,
      centralParcelCoords: fromParcelCoordsToPosition(initialPlayerParcel)
    })
  const [allRepresentations, setAllRepresentations] = useState<
    PlaceRepresentation[]
  >([])

  useEffect(() => {
    const initBigMapFn = async () => {
      await waitFor(() => isMapPlacesLoaded())
      await sleep(2000)
      const _representations = Object.values(getLoadedMapPlaces()).map(
        (place) => {
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
        }
      )
      setAllRepresentations([playerRespresentation, ..._representations])
      setPlacesRepresentations(_representations)
    }

    executeTask(initBigMapFn)
  }, [])

  useEffect(() => {
    // TODO REVIEW consider using a system instead of useEffect and compare
    if (state.dragging) {
      const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
      if (!pointerInfo?.screenDelta?.x && !pointerInfo?.screenDelta?.y) return
      const mapCameraTransform = Transform.getMutable(getBigMapCameraEntity())

      mapCameraTransform.position = panCameraXZ(
        mapCameraTransform.position,
        mapCameraTransform.rotation,
        -(pointerInfo!.screenDelta!.x ?? 0),
        -(pointerInfo!.screenDelta!.y ?? 0),
        2
      )
    }
  })
  useEffect(() => {
    const foundPlayer = placesRepresentations.find(
      (p: PlaceRepresentation) => p.id === PLAYER_PLACE_ID
    )
    const playerParcel = getPlayerParcel()
    let _playerRepresentation: PlaceRepresentation = foundPlayer ?? {
      id: PLAYER_PLACE_ID,
      title: '',
      positions: [],
      base_position: `${playerParcel.x},${playerParcel.y}`,
      centralParcelCoords: fromParcelCoordsToPosition(playerParcel)
    }
    if (foundPlayer) {
      foundPlayer.centralParcelCoords = fromParcelCoordsToPosition(playerParcel)
    } else {
      placesRepresentations.unshift(_playerRepresentation)
    }
    setPlayerRespresentation(_playerRepresentation)
    setAllRepresentations([_playerRepresentation, ...placesRepresentations])
  }, [getPlayerParcel()])

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_5
      }}
      onMouseDrag={(event) => {
        state.dragging = true
      }}
      onMouseDragEnd={() => {
        executeTask(async () => {
          // TODO REVIEW: why onMouseDrag/onMouseDragLocked is called continuously, then I cannot set dragging to false
          await sleep(0)
          state.dragging = false
        })
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
        }
        state.lastClickTime = Date.now()
      }}
    >
      {allRepresentations.map((placeRepresentation) => {
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
        if (state.dragging || state.moving) return null

        return (
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: {
                left: position.left,
                top: position.top
              }
            }}
          >
            <Label
              value={placeRepresentation.title}
              fontSize={getCanvasScaleRatio() * 50}
            />
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
                width: getCanvasScaleRatio() * 50,
                height: getCanvasScaleRatio() * 50
              }}
            />
          </UiEntity>
        )
      })}
      <MapFilterBar />
    </UiEntity>
  )
}
