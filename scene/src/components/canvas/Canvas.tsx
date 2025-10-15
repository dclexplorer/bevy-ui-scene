import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { store } from '../../state/store'
import { updateViewportSize } from '../../state/viewport/actions'
import { CustomMouseCursorElement } from '../custom-cursor-component'
import { getUnsafeAreaWidth } from '../../ui-classes/main-hud/MainHud'
import { BevyApi } from '../../bevy-api'
import { ReactElement } from '@dcl/react-ecs'
import { COLOR } from '../color-palette'
import { Color4 } from '@dcl/sdk/math'

function Canvas(props: {
  uiTransform?: UiTransformProps
  children?: ReactEcs.JSX.Element[]
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null
  const viewportState = store.getState().viewport
  if (
    viewportState.width !== canvasInfo.width ||
    viewportState.height !== canvasInfo.height
  ) {
    store.dispatch(
      updateViewportSize({
        width: canvasInfo.width,
        height: canvasInfo.height
      })
    )

    const interactableArea = {
      top: 0,
      left: getUnsafeAreaWidth(canvasInfo),
      right: 0,
      bottom: 0
    }
    console.log('interactableArea', JSON.stringify(interactableArea))
    BevyApi.setInteractableArea(interactableArea)
  }

  return (
    <UiEntity
      uiTransform={{
        width: viewportState.width,
        height: viewportState.height,
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        ...props.uiTransform
      }}
    >
      {props.children}
      <CustomMouseCursorElement />
    </UiEntity>
  )
}

export default Canvas

const COLOR_AREA = Color4.create(0, 1, 1, 0.1)

export function InteractableArea({
  active = false
}: {
  active?: boolean
}): ReactElement | null {
  if (!active) return null
  const canvas = UiCanvasInformation.get(engine.RootEntity)
  if (!canvas?.interactableArea) return null
  const viewportState = store.getState().viewport
  const { interactableArea } = canvas

  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        position: {
          left: interactableArea.left,
          top: interactableArea.top
        },
        width: canvas.width - (interactableArea.right + interactableArea.left),
        height:
          canvas.height - (interactableArea.top + interactableArea.bottom),
        zIndex: 999999,
        borderWidth: 10,
        borderRadius: 0,
        borderColor: COLOR.WHITE_OPACITY_5
      }}
      uiBackground={{
        color: COLOR_AREA
      }}
    >
      <UiEntity
        uiTransform={{ alignSelf: 'center' }}
        uiText={{
          value: `${JSON.stringify(interactableArea)}`
        }}
      />
    </UiEntity>
  )
}
