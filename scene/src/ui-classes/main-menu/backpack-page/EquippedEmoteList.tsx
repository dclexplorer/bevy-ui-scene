import type {
  EquippedEmote,
  URNWithoutTokenId
} from '../../../utils/definitions'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { store } from '../../../state/store'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../../utils/constants'
import { COLOR } from '../../../components/color-palette'
import { selectEmoteSlotAction } from '../../../state/backpack/actions'
import { playEmote } from '../../../components/backpack/AvatarPreview'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import { getEmoteName, getEmoteThumbnail } from '../../../service/emotes'
import { catalystMetadataMap } from '../../../utils/catalyst-metadata-map'

export function EquippedEmoteList({
  equippedEmotes
}: {
  equippedEmotes: EquippedEmote[]
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const visualOrderList = [
    ...equippedEmotes.slice(1, equippedEmotes.length),
    equippedEmotes[0]
  ]

  return (
    <UiEntity uiTransform={{ flexDirection: 'column' }}>
      {visualOrderList.map(
        (
          equippedEmoteURN: EquippedEmote,
          index: number,
          arr: EquippedEmote[]
        ) => {
          const backpackState = store.getState().backpack
          return (
            <UiEntity
              uiTransform={{
                height: canvasScaleRatio * 120,
                width: canvasScaleRatio * 500,
                margin: canvasScaleRatio * 10,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                position: { left: '5%' }
              }}
              uiBackground={{
                ...ROUNDED_TEXTURE_BACKGROUND,
                color:
                  backpackState.selectedEmoteSlot ===
                  fromVisualIndexToRealIndex(index)
                    ? COLOR.ACTIVE_BACKGROUND_COLOR
                    : COLOR.SMALL_TAG_BACKGROUND
              }}
              onMouseDown={() => {
                store.dispatch(
                  selectEmoteSlotAction(fromVisualIndexToRealIndex(index))
                )
                const newBackpackState = store.getState().backpack
                const selectedEmoteURN =
                  newBackpackState.equippedEmotes[
                    newBackpackState.selectedEmoteSlot
                  ]

                playEmote(selectedEmoteURN)
              }}
            >
              <UiEntity
                uiTransform={{
                  height: canvasScaleRatio * 100,
                  width: canvasScaleRatio * 100,
                  flexShrink: 0,
                  flexGrow: 0,
                  margin: { left: '2%' }
                }}
                uiBackground={getBackgroundFromAtlas({
                  atlasName: 'backpack',
                  spriteName: `emote-circle-${fromVisualIndexToRealIndex(
                    index
                  )}`
                })}
              />
              <UiEntity
                uiTransform={{
                  flexWrap: 'wrap',
                  width: '50%'
                }}
                uiText={{
                  textAlign: 'top-left',
                  value: getEmoteName(equippedEmoteURN),
                  fontSize: canvasScaleRatio * 30
                }}
              />
              <UiEntity
                uiTransform={{
                  height: canvasScaleRatio * 100,
                  width: canvasScaleRatio * 100,
                  positionType: 'absolute',
                  position: { right: canvasScaleRatio * 20 }
                }}
                uiBackground={
                  equippedEmoteURN
                    ? getBackgroundFromAtlas({
                        atlasName: 'backpack',
                        spriteName: `rarity-background-${
                          catalystMetadataMap[
                            equippedEmoteURN as URNWithoutTokenId
                          ]?.rarity ?? 'base'
                        }`
                      })
                    : getBackgroundFromAtlas({
                        atlasName: 'backpack',
                        spriteName: 'empty-wearable-field'
                      })
                }
              >
                <UiEntity
                  uiTransform={{ height: '100%', width: '100%' }}
                  uiBackground={getEmoteThumbnail(equippedEmoteURN)}
                />
              </UiEntity>
            </UiEntity>
          )
        }
      )}
    </UiEntity>
  )
}
function fromVisualIndexToRealIndex(index: number): number {
  return (index + 1) % 10
}
