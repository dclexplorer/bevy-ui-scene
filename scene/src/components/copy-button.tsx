import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getBackgroundFromAtlas } from '../utils/ui-utils'
import { COLOR } from './color-palette'
import { executeTask } from '@dcl/sdk/ecs'
import { copyToClipboard } from '~system/RestrictedActions'
import { sleep } from '../utils/dcl-utils'
import { type UiTransformProps } from '@dcl/sdk/react-ecs'
const state: { copyingElementId: string | null } = {
  copyingElementId: null
}

export function CopyButton({
  fontSize,
  text,
  elementId,
  uiTransform
}: {
  fontSize: number
  text: string
  elementId: string
  uiTransform?: UiTransformProps
}): ReactElement {
  return (
    <UiEntity
      uiTransform={{
        width: fontSize,
        height: fontSize,
        margin: { left: '5%' },
        flexShrink: 0,
        flexGrow: 0,
        ...uiTransform
      }}
      uiBackground={{
        ...getBackgroundFromAtlas({
          atlasName: 'icons',
          spriteName: 'CopyIcon'
        }),
        color:
          state.copyingElementId === elementId
            ? COLOR.WHITE
            : COLOR.WHITE_OPACITY_2
      }}
      onMouseDown={() => {
        executeTask(async () => {
          state.copyingElementId = elementId
          copyToClipboard({ text }).catch(console.error)
          await sleep(200)
          state.copyingElementId = null
        })
      }}
    />
  )
}
