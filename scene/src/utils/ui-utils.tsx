import { InputAction, type Coords } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'

export function getUvs(sprite: Sprite | undefined): number[] {
  if (sprite !== undefined) {
    const A: Coords = {
      x: sprite.x / sprite.atlasSize.x,
      y: 1 - (sprite.y + sprite.h) / sprite.atlasSize.y
    }
    const B: Coords = {
      x: sprite.x / sprite.atlasSize.x,
      y: 1 - sprite.y / sprite.atlasSize.y
    }
    const C: Coords = {
      x: (sprite.x + sprite.w) / sprite.atlasSize.x,
      y: 1 - sprite.y / sprite.atlasSize.y
    }
    const D: Coords = {
      x: (sprite.x + sprite.w) / sprite.atlasSize.x,
      y: 1 - (sprite.y + sprite.h) / sprite.atlasSize.y
    }

    const finalUvs: number[] = [A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y]
    return finalUvs
  }
  return []
}

export function Tab(props: {
  condition: boolean
  trueSprite: Sprite
  falseSprite: Sprite
  callback: (value: boolean) => void
  callbackValue: boolean
}): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'relative',
        width: '50%',
        height: '100%'
      }}
      uiBackground={{
        textureMode: 'stretch',
        uvs: getUvs(props.condition ? props.trueSprite : props.falseSprite),
        texture: {
          src: props.trueSprite.atlasSrc
        }
      }}
      onMouseDown={() => {
        props.callback(props.callbackValue)
      }}
    />
  )
}

export type Sprite = {
  atlasSrc: string
  atlasSize: { x: number; y: number }
  x: number
  y: number
  w: number
  h: number
}

export type SlotsInputs =
  | InputAction.IA_PRIMARY
  | InputAction.IA_SECONDARY
  | InputAction.IA_ACTION_3
  | InputAction.IA_ACTION_4
  | InputAction.IA_ACTION_5
  | InputAction.IA_ACTION_6

export const InputKeys: Record<SlotsInputs, string> = {
  [InputAction.IA_PRIMARY]: 'E',
  [InputAction.IA_SECONDARY]: 'F',
  [InputAction.IA_ACTION_3]: '1',
  [InputAction.IA_ACTION_4]: '2',
  [InputAction.IA_ACTION_5]: '3',
  [InputAction.IA_ACTION_6]: '4'
}

export const INPUT_KEYS_ARRAY: SlotsInputs[] = [
  InputAction.IA_ACTION_3,
  InputAction.IA_PRIMARY,
  InputAction.IA_SECONDARY,
  InputAction.IA_ACTION_4,
  InputAction.IA_ACTION_5,
  InputAction.IA_ACTION_6
]
