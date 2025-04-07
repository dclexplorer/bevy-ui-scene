import type {
  EquippedEmote,
  URNWithoutTokenId
} from '../../../utils/definitions'
import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { store } from '../../../state/store'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../../utils/constants'
import { COLOR } from '../../../components/color-palette'
import {
  selectEmoteSlotAction,
  updateEquippedEmoteAction
} from '../../../state/backpack/actions'
import { playEmote } from '../../../components/backpack/AvatarPreview'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import { getEmoteName, getEmoteThumbnail } from '../../../service/emotes'
import { catalystMetadataMap } from '../../../utils/catalyst-metadata-map'
import Icon from '../../../components/icon/Icon'
import type { UiTransformProps } from '@dcl/sdk/react-ecs'
const state: { hoveredIndex: number | null } = { hoveredIndex: null }
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
          const isHovered = (): boolean => state.hoveredIndex === index
          const backpackState = store.getState().backpack
          return (
            <UiEntity
              uiTransform={{
                height: canvasScaleRatio * 120,
                width: canvasScaleRatio * 498,
                margin: {
                  left: canvasScaleRatio * 10,
                  right: canvasScaleRatio * 10,
                  bottom: canvasScaleRatio * 5,
                  top: canvasScaleRatio * 5
                },
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
              onMouseEnter={() => {
                state.hoveredIndex = index
              }}
              onMouseLeave={() => {
                if (
                  !(state.hoveredIndex !== null && state.hoveredIndex !== index)
                ) {
                  state.hoveredIndex = null
                }
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
              {isHovered() &&
                fromVisualIndexToRealIndex(index) !==
                  backpackState.selectedEmoteSlot && <EmoteHoveredSquare />}
              <UiEntity
                uiTransform={{
                  height: canvasScaleRatio * (equippedEmoteURN ? 105 : 100),
                  width: canvasScaleRatio * 100,
                  flexShrink: 0,
                  positionType: 'absolute',
                  position: {
                    right: canvasScaleRatio * 20,
                    top: canvasScaleRatio * 10
                  }
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
                {isHovered() &&
                  backpackState.equippedEmotes[
                    fromVisualIndexToRealIndex(index)
                  ] && (
                    <UnequipEmoteCross
                      slot={fromVisualIndexToRealIndex(index)}
                      index={index}
                    />
                  )}
                <UiEntity
                  uiTransform={{
                    height: canvasScaleRatio * 100,
                    width: canvasScaleRatio * 100,
                    flexShrink: 0
                  }}
                  uiBackground={{
                    ...getEmoteThumbnail(equippedEmoteURN)
                    // color: Color4.create(1, 0, 0, 0.4)
                  }}
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

function UnequipEmoteCross({
  slot,
  index
}: {
  slot: number
  index: number
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  return (
    <UiEntity
      uiTransform={{
        width: canvasScaleRatio * 36,
        height: canvasScaleRatio * 36,
        flexShrink: 0,
        positionType: 'absolute',
        position: { right: 0, top: '1%' },
        padding: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        pointerFilter: 'none',
        zIndex: 1
      }}
      uiBackground={{
        ...ROUNDED_TEXTURE_BACKGROUND,
        color: COLOR.TEXT_COLOR
      }}
      onMouseEnter={() => {
        state.hoveredIndex = index
      }}
      onMouseDown={() => {
        store.dispatch(updateEquippedEmoteAction({ slot, equippedEmote: '' }))
      }}
    >
      <Icon
        iconSize={canvasScaleRatio * 26}
        uiTransform={{ alignSelf: 'center', flexShrink: 0 }}
        icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
      />
    </UiEntity>
  )
}

function EmoteHoveredSquare(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const transform: UiTransformProps = {
    width: 108 * canvasScaleRatio,
    height: 108 * canvasScaleRatio,
    positionType: 'absolute',
    position: {
      right: 16 * canvasScaleRatio,
      top: 6 * canvasScaleRatio
    },
    zIndex: 1
  }
  return (
    <UiEntity
      uiTransform={transform}
      uiBackground={getBackgroundFromAtlas({
        atlasName: 'backpack',
        spriteName: 'category-button-hover'
      })}
    />
  )
}
