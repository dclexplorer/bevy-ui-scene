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
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
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

let cameraEntity: Entity = engine.RootEntity
const MINIMAP_RADIO = 20
export function MiniMapContent(): ReactElement {
  const mapSize = getViewportHeight() * 0.25
  const [parcelsAroundIds, setParcelsAroundIds] = useState<string>('')
  const [parcelsAround, setParcelsAround] = useState<Place[]>([])

  useEffect(() => {
    try {
      if (cameraEntity === engine.RootEntity) return
      const playerGlobalTransform = Transform.get(engine.PlayerEntity)
      const mutableCameraPosition = Transform.getMutable(cameraEntity).position
      mutableCameraPosition.x = playerGlobalTransform.position.x
      mutableCameraPosition.z = playerGlobalTransform.position.z
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    loadCompleteMapPlaces().catch(console.error)
  }, [])

  useEffect(() => {
    console.log('setVisiblePlaces >>>>>>>>>>>>')
    setVisiblePlaces(parcelsAround)
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
        flexGrow: 1
      }}
      uiBackground={{
        textureMode: 'stretch',
        videoTexture: {
          videoPlayerEntity: getMinimapCamera()
        }
      }}
    >
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
const placeEntities: Entity[] = []

function setVisiblePlaces(places: Place[]) {
  placeEntities.forEach((placeEntity) => engine.removeEntity(placeEntity))
  // TODO REVIEW: if it makes worth to translate places to 2D symbols, setVisiblePlaces
  places.forEach((place) => {
    const placeEntity = engine.addEntity()
    placeEntities.push(placeEntity)

    const centralParcel = getCentralParcel(place.positions ?? [])
    const [x, y] = (centralParcel ?? '10,10').split(',').map((s) => Number(s))

    Transform.create(placeEntity, {
      position: fromParcelCoordsToPosition({ x, y }),
      rotation: Quaternion.fromEulerDegrees(90, 0, 0)
    })

    const symbolEntity = engine.addEntity()

    Transform.create(symbolEntity, {
      parent: placeEntity,
      scale: Vector3.create(24, 24, 24)
    })

    MeshRenderer.setPlane(symbolEntity)

    Material.setPbrMaterial(symbolEntity, {
      emissiveTexture: Material.Texture.Common({
        src: `assets/images/map/POI.png`
      }),
      emissiveColor: COLOR.BLACK,
      texture: Material.Texture.Common({
        src: `assets/images/map/POI.png`
      })
    })

    const labelEntity = engine.addEntity()
    TextShape.create(labelEntity, {
      text: `<b>${place.title}</b>`,
      fontSize: 250,
      textColor: COLOR.BLACK,
      width: 16 * 4,
      textWrapping: true
    })

    Transform.create(labelEntity, {
      parent: placeEntity,
      position: Vector3.create(0, -24, 0)
    })
  })
}
const PlaceAssets = {}

function getMinimapCamera(): Entity {
  if (cameraEntity === engine.RootEntity) {
    cameraEntity = engine.addEntity()
    Transform.create(cameraEntity, {
      position: Vector3.create(0, 201, 0),
      rotation: Quaternion.fromEulerDegrees(90, 0, 0)
    })

    CameraLayer.create(cameraEntity, {
      layer: 0,
      directionalLight: false,
      showAvatars: false,
      showSkybox: false,
      showFog: false,
      ambientBrightnessOverride: 5
    })
    TextureCamera.create(cameraEntity, {
      width: 200,
      height: 200,
      layer: 0,
      clearColor: Color4.create(0.4, 0.4, 1.0, 0),
      mode: {
        $case: 'orthographic',
        orthographic: { verticalRange: 300 }
      },
      volume: 1
    })
  }

  return cameraEntity
}

function getCentralParcel(parcelStrings: string[]): string | null {
  if (parcelStrings.length === 0) return null

  // Convertir "x,y" a objetos { x, y }
  const parcels = parcelStrings.map((str) => {
    const [x, y] = str.split(',').map(Number)
    return { x, y }
  })

  // Calcular centroide
  const avgX = parcels.reduce((sum, p) => sum + p.x, 0) / parcels.length
  const avgY = parcels.reduce((sum, p) => sum + p.y, 0) / parcels.length

  // Encontrar la parcela más cercana al centroide
  const centralParcel = parcels.reduce((closest, p) => {
    const dist = Math.hypot(p.x - avgX, p.y - avgY)
    const closestDist = Math.hypot(closest.x - avgX, closest.y - avgY)
    return dist < closestDist ? p : closest
  })

  return `${centralParcel.x},${centralParcel.y}`
}
