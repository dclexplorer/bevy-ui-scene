import type { UiTransformProps } from '@dcl/sdk/react-ecs'
import ReactEcs, { ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  getContentHeight,
  getContentScaleRatio,
  getContentWidth
} from '../../service/canvas-ratio'
import {
  AvatarShape,
  CameraLayer,
  CameraLayers,
  engine,
  PrimaryPointerInfo,
  TextureCamera,
  Transform
} from '@dcl/sdk/ecs'
import {
  AVATAR_CAMERA_POSITION,
  getAvatarCamera,
  getAvatarPreviewQuaternion,
  setAvatarPreviewRotation
} from './AvatarPreview'
import { Color4, Quaternion, Vector2 } from '@dcl/sdk/math'
import { PBAvatarShape } from '@dcl/ecs/dist/components/generated/pb/decentraland/sdk/components/avatar_shape.gen'
import { Entity } from '@dcl/ecs'
import useEffect = ReactEcs.useEffect
import useState = ReactEcs.useState
import Icon from '../icon/Icon'
import type { AtlasIcon } from '../../utils/definitions'
import {
  hideMouseCursor,
  showMouseCursor
} from '../../service/custom-cursor-service'
import { memoize } from '../../utils/function-utils'
import { COLOR } from '../color-palette'

const CAMERA_SIZE = { WIDTH: 1600, HEIGHT: 1800 }
const state = {
  alivePreviews: 0
}
const ROTATE_ICON: AtlasIcon = {
  atlasName: 'icons',
  spriteName: 'RotateIcn'
}
const ROTATION_FACTOR = -0.5
const AVATAR_PREVIEW_ELEMENT_ID = 'AP'
const getScrollVector = memoize(_getScrollVector)

export function AvatarPreviewElement2({
  uiTransform,
  avatarShapeDefinition,
  userId = '',
  allowRotation = false,
  allowZoom = false
}: {
  uiTransform?: UiTransformProps
  avatarShapeDefinition: PBAvatarShape
  userId: string
  allowRotation?: boolean
  allowZoom?: boolean
}): ReactElement | null {
  const [avatarCamera, setAvatarCamera] = useState<Entity | null>(null)
  const [avatarEntity, setAvatarEntity] = useState<Entity | null>(null)
  const [elementId] = useState<string>(
    `${AVATAR_PREVIEW_ELEMENT_ID}-${userId}-${getAliveAvatarPreviews()}`
  )
  const [listeningZoom, setListeningZoom] = useState(false)
  const [zoomFactor] = useState(0.5)
  useEffect(() => {
    console.log('goo')
    const { avatarEntity, cameraEntity } = createAvatarPreview({
      id: userId,
      avatarShapeDefinition
    })
    setAvatarCamera(cameraEntity)
    setAvatarEntity(avatarEntity)
    state.alivePreviews++
    return () => {
      state.alivePreviews--
      console.log('disposing avatar preview')
      engine.removeEntity(avatarEntity)
      engine.removeEntity(cameraEntity)
      // TODO dispose and destroy avatar camera preview entities and components
    }
  }, [])

  useEffect(() => {
    console.log('avatar definition has changed')
  }, [avatarShapeDefinition])

  return (
    <UiEntity
      uiTransform={{
        borderRadius: 0,
        borderColor: COLOR.RED,
        borderWidth: 1,
        height: getContentHeight(),
        width: (540 / 1920) * getContentWidth() * 0.85,
        ...uiTransform
      }}
    >
      {avatarCamera && (
        <UiEntity
          uiTransform={{
            borderRadius: 0,
            borderColor: COLOR.GREEN,
            borderWidth: 1,
            positionType: 'absolute',
            position: {
              left: '-75%'
            },
            width: '250%',
            height: '140%'
          }}
          uiBackground={{
            videoTexture: { videoPlayerEntity: avatarCamera },
            textureMode: 'stretch'
          }}
        >
          <UiEntity
            key="avatar-preview-zoom"
            uiTransform={{
              borderRadius: 0,
              borderColor: COLOR.YELLOW,
              borderWidth: 1,
              height: '100%',
              width: '100%',
              elementId,
              overflow: 'scroll',
              scrollPosition:
                listeningZoom && allowZoom
                  ? undefined
                  : getScrollVector(zoomFactor),
              scrollVisible: 'hidden'
            }}
            onMouseDown={() => {
              showMouseCursor(ROTATE_ICON)
            }}
            onMouseDragLocked={() => {
              showMouseCursor(ROTATE_ICON)
              const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
              const deltaX: number = pointerInfo?.screenDelta?.x ?? 0
              const qY = Quaternion.fromAngleAxis(deltaX * ROTATION_FACTOR, {
                x: 0,
                y: 1,
                z: 0
              })
              const avatarRotation = Transform.get(avatarEntity!).rotation
              const initialQuaternionCopy = Quaternion.create(
                avatarRotation.x,
                avatarRotation.y,
                avatarRotation.z,
                avatarRotation.w
              )
              Transform.getMutable(avatarEntity!).rotation =
                Quaternion.multiply(initialQuaternionCopy, qY)
            }}
            onMouseEnter={() => setListeningZoom(true)}
            onMouseLeave={() => setListeningZoom(false)}
            onMouseUp={() => {
              hideMouseCursor()
            }}
          >
            <UiEntity
              uiTransform={{
                height: 6000 * getContentScaleRatio(),
                width: '100%'
              }}
            ></UiEntity>
          </UiEntity>
        </UiEntity>
      )}
      <AvatarPreviewInstructions
        allowRotation={allowRotation}
        allowZoom={allowZoom}
      />
    </UiEntity>
  )
}

function createAvatarPreview({
  id = '',
  avatarShapeDefinition
}: {
  id: string
  avatarShapeDefinition: PBAvatarShape
}) {
  console.log('createAvatarPreview2', id)
  const avatarEntity: Entity = engine.addEntity()
  const cameraEntity: Entity = engine.addEntity()
  const layer = getAliveAvatarPreviews() + 1
  AvatarShape.create(avatarEntity, {
    bodyShape: avatarShapeDefinition.bodyShape,
    emotes: [],
    expressionTriggerId: undefined,
    expressionTriggerTimestamp: undefined,
    eyeColor: avatarShapeDefinition.eyeColor,
    hairColor: avatarShapeDefinition.hairColor,
    id,
    name: undefined,
    skinColor: avatarShapeDefinition.skinColor,
    talking: false,
    wearables: avatarShapeDefinition.wearables ?? []
  })

  CameraLayers.create(avatarEntity, {
    layers: [layer]
  })
  CameraLayer.create(cameraEntity, {
    layer,
    directionalLight: false,
    showAvatars: false,
    showSkybox: false,
    showFog: false,
    ambientBrightnessOverride: 5
  })

  TextureCamera.create(cameraEntity, {
    width: CAMERA_SIZE.WIDTH,
    height: CAMERA_SIZE.HEIGHT,
    layer,
    clearColor: Color4.create(0.4, 0.4, 1.0, 0),
    mode: {
      $case: 'orthographic',
      orthographic: { verticalRange: 6 }
    },
    volume: 1
  })

  Transform.create(avatarEntity, {
    position: { x: 8, y: 0, z: 8 },
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    scale: { x: 2, y: 2, z: 2 }
  })

  Transform.create(cameraEntity, {
    position: AVATAR_CAMERA_POSITION.BODY,
    rotation: Quaternion.fromEulerDegrees(4, 0, 0)
  })
  return { avatarEntity, cameraEntity }
}

export function getAliveAvatarPreviews() {
  return state.alivePreviews + 1
}

function AvatarPreviewInstructions({
  allowRotation,
  allowZoom
}: {
  allowRotation: boolean
  allowZoom: boolean
}): ReactElement {
  const canvasScaleRatio = getContentScaleRatio()

  return (
    <UiEntity
      uiTransform={{
        position: { top: '100%', left: '5%' },
        flexDirection: 'column'
      }}
    >
      {allowRotation && (
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end'
          }}
        >
          <Icon
            icon={{ atlasName: 'icons', spriteName: 'LeftClick' }}
            iconSize={canvasScaleRatio * 26}
            uiTransform={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              position: { top: canvasScaleRatio * 13 }
            }}
          />
          <UiEntity
            uiText={{
              value: 'Drag avatar to rotate',
              fontSize: canvasScaleRatio * 26
            }}
            uiTransform={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              position: { top: 0 }
            }}
          />
        </UiEntity>
      )}
      {allowZoom && (
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <Icon
            icon={{ atlasName: 'icons', spriteName: 'Scroll' }}
            iconSize={canvasScaleRatio * 26}
            uiTransform={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              position: { top: canvasScaleRatio * 13 }
            }}
          />
          <UiEntity
            uiText={{
              value: 'Scroll to zoom in/out',
              fontSize: canvasScaleRatio * 26
            }}
            uiTransform={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              position: { top: 0 }
            }}
          />
        </UiEntity>
      )}
    </UiEntity>
  )
}
function _getScrollVector(positionY: number): Vector2 {
  return Vector2.create(0, positionY)
}
