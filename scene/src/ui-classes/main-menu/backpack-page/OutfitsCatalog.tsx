import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import {
  BORDER_RADIUS_F,
  getBackgroundFromAtlas
} from '../../../utils/ui-utils'
import { store } from '../../../state/store'
import { type OutfitDefinition } from '../../../utils/outfit-definitions'

import { Color4 } from '@dcl/sdk/math'
import { getSlotAvatar } from '../../../components/backpack/OutfitAvatar'

const SLOTS: any[] = new Array(10).fill(null)
const state: { hoveredIndex: number } = {
  hoveredIndex: -1
}
export const OutfitsCatalog = (): ReactElement => {
  const canvaScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack
  const outfitsMetadata = backpackState.outfitsMetadata
  const viewSlots: Array<OutfitDefinition | null> = [...SLOTS]
  outfitsMetadata.outfits.forEach((outfitMetadata) => {
    viewSlots[outfitMetadata.slot] = outfitMetadata.outfit
  })

  return (
    <UiEntity
      uiTransform={{
        width: getCanvasScaleRatio() * 2145,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}
    >
      {viewSlots.map((viewSlot, index: number) => {
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
            onMouseEnter={() => {
              state.hoveredIndex = index
            }}
          >
            {isEmptySlot(viewSlot) ? (
              <UiEntity
                uiTransform={{
                  positionType: 'absolute',
                  width: '80%',
                  height: '80%',
                  alignSelf: 'center',
                  position: { left: '10%' }
                }}
                uiBackground={{
                  ...getBackgroundFromAtlas({
                    atlasName: 'backpack',
                    spriteName: 'outfit-slot-silhouette'
                  }),
                  color: Color4.create(0, 0, 0, 1)
                }}
              />
            ) : (
              <UiEntity
                uiTransform={{
                  positionType: 'absolute',
                  width: '100%',
                  height: '100%',
                  alignSelf: 'center',
                  position: { left: '0%' },
                  zIndex: 9
                }}
                uiBackground={{
                  videoTexture: {
                    videoPlayerEntity: getSlotAvatar(index)?.cameraEntity
                  }
                }}
              />
            )}
          </UiEntity>
        )
      })}
    </UiEntity>
  )
}

function isEmptySlot(viewSlot: OutfitDefinition | null): boolean {
  if (viewSlot === null) return true
  return !viewSlot?.bodyShape
}
