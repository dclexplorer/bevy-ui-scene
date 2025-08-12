import ReactEcs, { UiEntity } from '@dcl/react-ecs'
import useEffect = ReactEcs.useEffect
import {
  CameraLayer,
  engine,
  Entity,
  TextureCamera,
  Transform
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { getCanvasScaleRatio } from '../../service/canvas-ratio'
import { rotateUVs } from '../../utils/ui-utils'
let cameraEntity: Entity = engine.RootEntity

export function MiniMapContent() {
  const width = getCanvasScaleRatio() * 1000
  const height = getCanvasScaleRatio() * 1000
  const ARROW_SIZE = getCanvasScaleRatio() * 50

  useEffect(() => {
    const playerGlobalTransform = Transform.get(engine.PlayerEntity)
    const mutableCameraPosition = Transform.getMutable(cameraEntity).position
    mutableCameraPosition.x = playerGlobalTransform.position.x
    mutableCameraPosition.z = playerGlobalTransform.position.z
  })

  return (
    <UiEntity
      uiTransform={{
        width,
        height,
        positionType: 'absolute',
        position: 0
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
          width: ARROW_SIZE,
          height: ARROW_SIZE,
          positionType: 'absolute',
          position: {
            top: height / 2 - ARROW_SIZE / 2,
            left: width / 2 - ARROW_SIZE / 2
          }
        }}
        uiBackground={{
          textureMode: 'stretch',
          uvs: rotateUVs(
            Quaternion.toEulerAngles(
              Transform.get(engine.CameraEntity).rotation
            ).y + 90
          ),
          texture: {
            src: 'assets/images/MapArrow.png'
          }
        }}
      />
    </UiEntity>
  )
}

function getMinimapCamera() {
  if (cameraEntity === engine.RootEntity) {
    cameraEntity = engine.addEntity()
    Transform.create(cameraEntity, {
      position: Vector3.create(0, 1000, 0),
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
        orthographic: { verticalRange: 500 }
      },
      volume: 1
    })
  }

  return cameraEntity
}
