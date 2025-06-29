import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { store } from '../../state/store'
import { updateViewportSize } from '../../state/viewport/actions'
import { CustomMouseCursorElement } from '../custom-cursor-component'

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
    const sideMenuWidth = Math.max(canvasInfo.width * 0.04, 45)
    const chatWidth = canvasInfo.width * 0.25
    const hudWidth = sideMenuWidth + chatWidth

    store.dispatch(
      updateViewportSize({
        width: canvasInfo.width,
        height: canvasInfo.height,
        interactableArea: {
          top: 0,
          left: hudWidth,
          right: 0,
          bottom: 0
        }
      })
    )
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
