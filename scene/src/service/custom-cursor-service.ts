import { engine, PrimaryPointerInfo } from '@dcl/sdk/ecs'
import { type ColorAtlasIcon } from '../utils/definitions'

type CustomMouseCursorState = {
  showCustomCursor: boolean
  x: number
  y: number
  initialized: boolean
  sprite: ColorAtlasIcon
}
const mouseState: CustomMouseCursorState = {
  initialized: false,
  showCustomCursor: false,
  x: 0,
  y: 0,
  sprite: {
    atlasName: 'icons',
    spriteName: 'RotateIcn'
  }
}

export function getMouseCustomCursorState(): CustomMouseCursorState {
  if (!mouseState.initialized) {
    engine.addSystem(MouseCursorSystem)
    mouseState.initialized = true
  }
  return mouseState
}

export function showMouseCursor(atlasIcon?: ColorAtlasIcon): void {
  if (!mouseState.showCustomCursor) {
    const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
    console.log('pointerInfo', pointerInfo)
    mouseState.showCustomCursor = true
  }
  if (atlasIcon) {
    mouseState.sprite = atlasIcon
  }
}
export function hideMouseCursor(): void {
  mouseState.showCustomCursor = false
  mouseState.x = 0
  mouseState.y = 0
}

function MouseCursorSystem(): void {
  if (mouseState.showCustomCursor) {
    const pointerInfo = PrimaryPointerInfo.get(engine.RootEntity)
    mouseState.x = pointerInfo.screenCoordinates?.x ?? 0
    mouseState.y = pointerInfo.screenCoordinates?.y ?? 0
  }
}
