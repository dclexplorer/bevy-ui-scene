import {
  CameraLayers,
  engine,
  type Entity,
  Material,
  MeshRenderer,
  TextAlignMode,
  TextShape,
  Transform
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { COLOR } from '../color-palette'
import {
  fromParcelCoordsToPosition,
  type Place
} from '../../service/map-places'
import { wrapText } from './mini-map-label-text'

const placeEntities: Entity[] = []
const infoEntity: Entity = engine.addEntity()

CameraLayers.create(infoEntity, {
  layers: [10]
})

export function applyRotation(dg: number): void {
  placeEntities.forEach((entity): void => {
    const placeEntityTransform = Transform.getMutableOrNull(entity)
    if (placeEntityTransform) {
      Object.assign(
        placeEntityTransform.rotation,
        Quaternion.fromEulerDegrees(90, dg, 0)
      )
    }
  })
}

export function renderVisiblePlaces(places: Place[]): void {
  placeEntities.forEach((placeEntity) => {
    engine.removeEntityWithChildren(placeEntity)
  })
  placeEntities.splice(0, placeEntities.length)

  places.forEach((place) => {
    const placeEntity = engine.addEntity()
    placeEntities.push(placeEntity)

    const centralParcel = getCentralParcel(place.positions ?? [])
    const [x, y] = (centralParcel ?? '10,10').split(',').map((s) => Number(s))
    const wrappedText = wrapText(place.title)
    const linesMaxChars = wrappedText
      .split('\n')
      .reduce(
        (acc, currentValue: string) => Math.max(acc, currentValue.length),
        0
      )

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
      text: `<b>${wrappedText}</b>`,
      fontSize: 250,
      textColor: COLOR.WHITE,
      textAlign: TextAlignMode.TAM_TOP_CENTER
    })

    Transform.create(labelEntity, {
      parent: placeEntity,
      position: Vector3.create(0, -12, 0)
    })

    const shadowBoxEntity = engine.addEntity()

    MeshRenderer.setPlane(shadowBoxEntity)
    const textHeight = wrappedText.split('\n').length * 24
    Transform.create(shadowBoxEntity, {
      parent: labelEntity,
      position: Vector3.create(0, -textHeight / 2, 0),
      scale: Vector3.create(linesMaxChars * 10 + 4, textHeight, 10)
    })
    Material.setBasicMaterial(shadowBoxEntity, {
      diffuseColor: COLOR.DARK_OPACITY_2,
      castShadows: false
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
