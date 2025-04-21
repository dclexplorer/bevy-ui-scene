import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { Color4 } from '@dcl/sdk/math'
import {
  BORDER_RADIUS_F,
  getBackgroundFromAtlas
} from '../../../utils/ui-utils'

const SLOTS: any[] = new Array(10).fill(null)

export const OutfitsCatalog = (): ReactElement => {
  const canvaScaleRatio = getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 2145,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}
    >
      {SLOTS.map((SLOT: any, index: number) => {
        return (
          <UiEntity
            uiTransform={{
              width: canvaScaleRatio * 320,
              height: canvaScaleRatio * 560,
              flexShrink: 0,
              margin: { left: '2%', bottom: '4%', right: '2%' },
              borderRadius: BORDER_RADIUS_F
            }}
            uiBackground={{
              ...getBackgroundFromAtlas({
                atlasName: 'backpack',
                spriteName: 'outfit-slot-background'
              })
            }}
          ></UiEntity>
        )
      })}
    </UiEntity>
  )
}
