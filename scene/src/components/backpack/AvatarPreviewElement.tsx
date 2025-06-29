import { Color4, Quaternion, Vector2 } from '@dcl/sdk/math'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  getCanvasScaleRatio,
  getContentHeight,
  getContentWidth
} from '../../service/canvas-ratio'
import {
  getAvatarCamera,
  getAvatarPreviewEntity,
  getAvatarPreviewQuaternion,
  setAvatarPreviewRotation,
  setAvatarPreviewZoomFactor
} from './AvatarPreview'
import {
  engine,
  GltfContainerLoadingState,
  LoadingState,
  PrimaryPointerInfo,
  UiScrollResult,
  UiTransform
} from '@dcl/sdk/ecs'
import Icon from '../icon/Icon'
import {
  hideMouseCursor,
  showMouseCursor
} from '../../service/custom-cursor-service'
import { type AtlasIcon } from '../../utils/definitions'

const ROTATION_FACTOR = -0.5
const state = {
  listenZoom: false,
  zoomFactor: 0.5
}
const AVATAR_PREVIEW_ELEMENT_ID = 'AP'

engine.addSystem(AvatarPreviewZoomSystem)
const ROTATE_ICON: AtlasIcon = {
  atlasName: 'icons',
  spriteName: 'RotateIcn'
}

export function setAvatarPreviewZoom(): void {
  for (const [, scroll, transform] of engine.getEntitiesWith(
    UiScrollResult,
    UiTransform
  )) {
    if (transform.elementId !== AVATAR_PREVIEW_ELEMENT_ID) continue
    if (scroll.value === undefined) continue
    state.zoomFactor = scroll.value.y
    setAvatarPreviewZoomFactor(state.zoomFactor)
  }
}

export function AvatarPreviewElement(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const loadingState = GltfContainerLoadingState.getOrNull(
    getAvatarPreviewEntity()
  )
  return (
    <UiEntity
      uiTransform={{
        height: getContentHeight(),
        width: (540 / 1920) * getContentWidth() * 0.85
      }}
    >
      {getAvatarCamera() === engine.RootEntity ? null : (
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: {
              left: '-75%'
            },
            width: '250%',
            height: '140%'
          }}
          uiBackground={{
            videoTexture: { videoPlayerEntity: getAvatarCamera() },
            color:
              loadingState?.currentState === LoadingState.LOADING
                ? Color4.create(1, 1, 1, 0.5)
                : Color4.create(1, 1, 1, 1)
          }}
        >
          <UiEntity
            key="avatar-preview-zoom"
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
              const avatarRotation = getAvatarPreviewQuaternion()
              const initialQuaternionCopy = Quaternion.create(
                avatarRotation.x,
                avatarRotation.y,
                avatarRotation.z,
                avatarRotation.w
              )
              setAvatarPreviewRotation(
                Quaternion.multiply(initialQuaternionCopy, qY)
              )
            }}
            uiTransform={{
              height: '100%',
              width: '100%',
              elementId: AVATAR_PREVIEW_ELEMENT_ID,
              overflow: 'scroll',
              scrollPosition: state.listenZoom
                ? undefined
                : Vector2.create(0, state.zoomFactor),
              scrollVisible: 'hidden'
            }}
            onMouseEnter={() => (state.listenZoom = true)}
            onMouseLeave={() => (state.listenZoom = false)}
            onMouseUp={() => {
              hideMouseCursor()
            }}
          >
            <UiEntity
              uiTransform={{
                height: 6000 * canvasScaleRatio,
                width: '100%'
              }}
            ></UiEntity>
          </UiEntity>
        </UiEntity>
      )}
      <AvatarPreviewInstructions />
    </UiEntity>
  )
}

function AvatarPreviewInstructions(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity
      uiTransform={{
        position: { top: '95%', left: '5%' },
        flexDirection: 'column'
      }}
    >
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
    </UiEntity>
  )
}

function AvatarPreviewZoomSystem(): void {
  if (state.listenZoom) {
    setAvatarPreviewZoom()
  }
}
