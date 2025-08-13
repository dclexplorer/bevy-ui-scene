import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import useEffect = ReactEcs.useEffect
import {
  CameraLayer,
  engine,
  type Entity,
  TextureCamera,
  Transform
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import {
  getCanvasScaleRatio,
  getViewportHeight
} from '../../service/canvas-ratio'
import { rotateUVs } from '../../utils/ui-utils'
let cameraEntity: Entity = engine.RootEntity

export function MiniMapContent(): ReactElement {
  const mapSize = getViewportHeight() * 0.25

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
    </UiEntity>
  )
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
            .y + 90
        ),
        texture: {
          src: 'assets/images/MapArrow.png'
        }
      }}
    />
  )
}
function getMinimapCamera(): Entity {
  if (cameraEntity === engine.RootEntity) {
    cameraEntity = engine.addEntity()
    Transform.create(cameraEntity, {
      position: Vector3.create(0, 201, 0),
      rotation: Quaternion.fromEulerDegrees(90, 0, 90)
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
