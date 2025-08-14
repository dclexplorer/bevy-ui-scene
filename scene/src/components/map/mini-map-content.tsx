import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import useEffect = ReactEcs.useEffect
import {
  Billboard,
  BillboardMode,
  CameraLayer,
  CameraLayers,
  engine,
  type Entity,
  Material,
  MeshRenderer,
  TextShape,
  Texture,
  TextureCamera,
  Transform
} from '@dcl/sdk/ecs'
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import {
  getCanvasScaleRatio,
  getViewportHeight
} from '../../service/canvas-ratio'
import { rotateUVs } from '../../utils/ui-utils'
import { getHudFontSize } from '../../ui-classes/main-hud/scene-info/SceneInfo'
import { COLOR } from '../color-palette'
import {
  fromParcelCoordsToPosition,
  fromStringToCoords,
  getLoadedMapPlaces,
  getPlacesAroundParcel,
  getPlacesBetween,
  loadCompleteMapPlaces,
  Place
} from '../../service/map-places'
import { getPlayerParcel } from '../../service/player-scenes'
import useState = ReactEcs.useState
import Icon from '../icon/Icon'
import { Label } from '@dcl/sdk/react-ecs'
import { getMapInfoCamera, getMinimapCamera } from './mini-map-camera'
import { renderVisiblePlaces } from './mini-map-info-entities'
const MINIMAP_RADIO = 20

export function MiniMapContent(): ReactElement {
  const mapSize = getViewportHeight() * 0.25
  const [parcelsAroundIds, setParcelsAroundIds] = useState<string>('')
  const [parcelsAround, setParcelsAround] = useState<Place[]>([])

  useEffect(() => {
    try {
      if (getMinimapCamera() === engine.RootEntity) return
      const playerGlobalTransform = Transform.get(engine.PlayerEntity)
      const mutableCameraPosition = Transform.getMutable(
        getMinimapCamera()
      ).position
      const mutableInfoCameraPosition = Transform.getMutable(
        getMapInfoCamera()
      ).position
      mutableCameraPosition.x = mutableInfoCameraPosition.x =
        playerGlobalTransform.position.x
      mutableCameraPosition.z = mutableInfoCameraPosition.z =
        playerGlobalTransform.position.z
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    loadCompleteMapPlaces().catch(console.error)
  }, [])

  useEffect(() => {
    renderVisiblePlaces(parcelsAround)
  }, [parcelsAroundIds])

  useEffect(() => {
    const playerParcel = getPlayerParcel()
    const places = getPlacesBetween(
      {
        x: playerParcel.x - MINIMAP_RADIO,
        y: playerParcel.y - MINIMAP_RADIO
      },
      {
        x: playerParcel.x + MINIMAP_RADIO,
        y: playerParcel.y + MINIMAP_RADIO
      }
    )
    const placesAroundPlayerParcel = getPlacesAroundParcel(playerParcel, 10)
    setParcelsAroundIds(
      placesAroundPlayerParcel.map((p) => p.base_position).join(',')
    )
    setParcelsAround(placesAroundPlayerParcel)
  }, [getPlayerParcel(), getLoadedMapPlaces()])

  return (
    <UiEntity
      uiTransform={{
        width: mapSize,
        height: mapSize,
        flexShrink: 0,
        flexGrow: 0
      }}
      uiBackground={{
        textureMode: 'stretch',
        videoTexture: {
          videoPlayerEntity: getMinimapCamera()
        }
      }}
    >
      <UiEntity
        uiTransform={{
          width: mapSize,
          height: mapSize,
          flexShrink: 0,
          flexGrow: 0,
          positionType: 'absolute',
          position: { top: 0, left: 0 }
        }}
        uiBackground={{
          textureMode: 'stretch',
          videoTexture: {
            videoPlayerEntity: getMapInfoCamera()
          }
        }}
      />
      <PlayerArrow mapSize={mapSize} />
      {CardinalLabels()}
    </UiEntity>
  )
}

function CardinalLabels(): ReactElement[] {
  const fontSize = getHudFontSize(getViewportHeight()).BIG
  return [
    <UiEntity
      uiText={{
        value: 'N',
        fontSize,
        textAlign: 'middle-center',
        outlineColor: COLOR.TEXT_COLOR,
        outlineWidth: fontSize / 10
      }}
      uiTransform={{
        positionType: 'absolute',
        position: { top: '-4%', left: '44%' }
      }}
    />,
    <UiEntity
      uiText={{
        value: 'E',
        fontSize,
        textAlign: 'middle-center',
        outlineColor: COLOR.TEXT_COLOR,
        outlineWidth: fontSize / 10
      }}
      uiTransform={{
        positionType: 'absolute',
        position: { top: '40%', left: '86%' }
      }}
    />,
    <UiEntity
      uiText={{
        value: 'S',
        fontSize,
        textAlign: 'middle-center',
        outlineColor: COLOR.TEXT_COLOR,
        outlineWidth: fontSize / 10
      }}
      uiTransform={{
        positionType: 'absolute',
        position: { bottom: '-3%', left: '44%' }
      }}
    />,
    <UiEntity
      uiText={{
        value: 'W',
        fontSize,
        textAlign: 'middle-center',
        outlineColor: COLOR.TEXT_COLOR,
        outlineWidth: fontSize / 10
      }}
      uiTransform={{
        positionType: 'absolute',
        position: { top: '40%', left: 0 }
      }}
    />
  ]
}
function PlayerArrow({ mapSize = 1000 }: { mapSize: number }): ReactElement {
  const ARROW_SIZE = getCanvasScaleRatio() * 50

  return (
    <UiEntity
      uiTransform={{
        width: ARROW_SIZE,
        height: ARROW_SIZE,
        positionType: 'absolute',
        position: {
          top: mapSize / 2 - ARROW_SIZE / 2,
          left: mapSize / 2 - ARROW_SIZE / 2
        }
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: rotateUVs(
          Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation)
            .y
        ),
        texture: {
          src: 'assets/images/MapArrow.png'
        }
      }}
    />
  )
}
