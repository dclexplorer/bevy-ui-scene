import {
  CameraLayer,
  engine,
  type Entity,
  TextureCamera,
  Transform
} from '@dcl/sdk/ecs'
import { Color3, Quaternion, Vector3 } from '@dcl/sdk/math'
import { COLOR } from '../color-palette'
import { getMapSize } from './mini-map-size'

let cameraEntity: Entity = engine.RootEntity
let infoCameraEntity: Entity = engine.RootEntity

export function getMapInfoCamera(): Entity {
  if (infoCameraEntity === engine.RootEntity) {
    infoCameraEntity = engine.addEntity()
    Transform.create(infoCameraEntity, {
      position: Vector3.create(0, 201, 0),
      rotation: Quaternion.fromEulerDegrees(90, 0, 0)
    })

    CameraLayer.create(infoCameraEntity, {
      layer: 10,
      directionalLight: false,
      showAvatars: false,
      showSkybox: false,
      showFog: false,
      ambientBrightnessOverride: 5,
      ambientColorOverride: Color3.White()
    })

    TextureCamera.create(infoCameraEntity, {
      width: 400,
      height: 400,
      layer: 10,
      clearColor: COLOR.BLACK_TRANSPARENT,
      mode: {
        $case: 'orthographic',
        orthographic: { verticalRange: 300 }
      },
      volume: 1
    })
  }

  return infoCameraEntity
}

export const disposeMiniMapCameraEntities = (): void => {
  engine.removeEntityWithChildren(infoCameraEntity)
  engine.removeEntityWithChildren(cameraEntity)
  infoCameraEntity = cameraEntity = engine.RootEntity
}

export const CAMERA_X_ANGLE = 89.9
export function getMinimapCamera(): Entity {
  if (cameraEntity === engine.RootEntity) {
    cameraEntity = engine.addEntity()
    Transform.create(cameraEntity, {
      position: Vector3.create(0, 201, 0),
      rotation: Quaternion.fromEulerDegrees(CAMERA_X_ANGLE, 0, 0)
    })

    CameraLayer.create(cameraEntity, {
      layer: 0,
      directionalLight: false,
      showAvatars: false,
      showSkybox: false,
      showFog: false,
      ambientBrightnessOverride: 5,
      ambientColorOverride: Color3.White()
    })
    const mapSize = getMapSize()
    TextureCamera.create(cameraEntity, {
      width: mapSize,
      height: mapSize,
      layer: 0,
      mode: {
        $case: 'orthographic',
        orthographic: { verticalRange: 300 }
      },
      volume: 1
    })
  }

  return cameraEntity
}
