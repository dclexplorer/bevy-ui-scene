import {
  CameraLayers,
  engine,
  type Entity,
  Material,
  MeshRenderer,
  TextShape,
  Transform
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { COLOR } from '../color-palette'
import {
  fromParcelCoordsToPosition,
  type Place
} from '../../service/map-places'

const placeEntities: Entity[] = []
const infoEntity: Entity = engine.addEntity()

CameraLayers.create(infoEntity, {
  layers: [10]
})

export function renderVisiblePlaces(places: Place[]): void {
  placeEntities.forEach((placeEntity) => {
    engine.removeEntity(placeEntity)
  })
  // TODO REVIEW: if it makes worth to translate places to 2D symbols, setVisiblePlaces

  places.forEach((place) => {
    const placeEntity = engine.addEntity()
    placeEntities.push(placeEntity)

    const centralParcel = getCentralParcel(place.positions ?? [])
    const [x, y] = (centralParcel ?? '10,10').split(',').map((s) => Number(s))

    Transform.create(placeEntity, {
      position: fromParcelCoordsToPosition({ x, y }),
      rotation: Quaternion.fromEulerDegrees(90, 0, 0),
      parent: infoEntity
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
      }),
      alphaTest: 1
    })

    const labelEntity = engine.addEntity()
    TextShape.create(labelEntity, {
      text: `<b>${place.title}</b>`,
      fontSize: 250,
      textColor: COLOR.WHITE,
      outlineWidth: 20,
      width: 16 * 4,
      textWrapping: true
    })

    Transform.create(labelEntity, {
      parent: placeEntity,
      position: Vector3.create(0, -24, 0)
    })
  })
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
