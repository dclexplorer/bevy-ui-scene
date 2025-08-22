import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import { COLOR } from '../../../components/color-palette'
import useEffect = ReactEcs.useEffect
import {
  fromParcelCoordsToPosition,
  fromStringToCoords,
  getLoadedMapPlaces,
  isMapPlacesLoaded,
  Place
} from '../../../service/map-places'
import {
  engine,
  executeTask,
  PrimaryPointerInfo,
  Transform,
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
  worldToScreenPx
} from '../../../service/perspective-to-screen'
import { Label } from '@dcl/sdk/react-ecs'
import { getBigMapCameraEntity } from '../../../service/map-camera'
import { MapFilterBar } from '../../../components/map/map-filter-bar'

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
const state = { dragging: false }
function BigMapContent(): ReactElement {
  const [placesRepresentations, setPlacesRepresentations] = useState<
    (Place & { centralParcelCoords: Vector3 })[]
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
          await sleep(1)
          state.dragging = false
        })
        state.dragging = false
      }}
      onMouseUp={() => {
        //TODO workaround when onMouseDragEnd is not triggered but should be
        state.dragging = false
      }}
    >
      <MapFilterBar />
      {placesRepresentations.map((placeRepresentation) => {
        // TODO optimize, only calculate when camera position or rotation changes, and with throttle
        const position = worldToScreenPx(
          placeRepresentation.centralParcelCoords,
          Transform.get(engine.CameraEntity).position,
          Transform.get(engine.CameraEntity).rotation,
          (45 * 1.25 * Math.PI) / 180,
          getViewportWidth(),
          getViewportHeight(),
          {
            fovIsHorizontal: false,
            forwardIsNegZ: false
          }
        )
        if (state.dragging) return null

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
              icon={{ spriteName: 'POIIcn', atlasName: 'map' }}
              uiTransform={{
                positionType: 'absolute',
                width: getCanvasScaleRatio() * 50,
                height: getCanvasScaleRatio() * 50
              }}
            />
          </UiEntity>
        )
      })}
    </UiEntity>
  )
}
