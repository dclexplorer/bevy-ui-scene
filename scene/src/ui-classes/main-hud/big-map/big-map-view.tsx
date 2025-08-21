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
import { engine, executeTask, Transform } from '@dcl/sdk/ecs'
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
import { worldToScreenPx } from '../../../service/perspective-to-screen'
import { Label } from '@dcl/sdk/react-ecs'

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

          if (place.title.toLowerCase().includes('golf')) {
            console.log(
              'golfcraft coords',
              centralParcelCoords,
              Math.floor(centralParcelCoords.x / 16),
              Math.floor(centralParcelCoords.z / 16)
            )
          }
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

  return (
    <UiEntity
      uiTransform={{
        width: '100%',
        height: '100%'
      }}
      uiBackground={{
        color: COLOR.DARK_OPACITY_2
      }}
    >
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
