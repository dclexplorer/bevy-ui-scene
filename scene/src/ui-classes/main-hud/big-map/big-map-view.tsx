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
  DeepReadonlyObject,
  engine,
  executeTask,
  PBTextureCamera,
  TextureCamera
} from '@dcl/sdk/ecs'
import { sleep, waitFor } from '../../../utils/dcl-utils'
import useState = ReactEcs.useState
import { Vector3 } from '@dcl/sdk/math'
import { getCentralParcel } from '../../../components/map/mini-map-info-entities'
import Icon from '../../../components/icon/Icon'
import {
  getCanvasScaleRatio,
  getContentWidth,
  getViewportHeight,
  getViewportWidth
} from '../../../service/canvas-ratio'
import { perspectiveToScreenPosition } from '../../../service/perspective-to-screen'
import { store } from '../../../state/store'
import { PerspectiveMode } from '../../../components/backpack/AvatarPreview'
import { getBigMapCameraEntity } from '../../../service/map-camera'
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
        (place) => ({
          ...place,
          centralParcelCoords: fromParcelCoordsToPosition(
            fromStringToCoords(
              getCentralParcel([
                ...place.positions,
                place.base_position
              ]) as string
            )
          )
        })
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
        const position = perspectiveToScreenPosition(
          getBigMapCameraEntity(),
          placeRepresentation.centralParcelCoords,
          getViewportWidth(),
          getViewportHeight(),
          1
        )

        return (
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              position: { top: position.y, left: position.x }
            }}
          >
            <Label
              value={placeRepresentation.title}
              fontSize={getCanvasScaleRatio() * 50}
            />
            <Icon
              icon={{ spriteName: 'POIIcn', atlasName: 'map' }}
              uiTransform={{
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
