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
import { HoverUiEntity, isHovered } from 'src/utils/hoverable'

export function EquippedEmoteList({
  equippedEmotes
}: {
  equippedEmotes: EquippedEmote[]
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity uiTransform={{ flexDirection: 'column' }}>
      {equippedEmotes.map((equippedEmoteURN: EquippedEmote, index: number) => {
        const backpackState = store.getState().backpack
        const key = `emote slot ${index}`
        return (
          <HoverUiEntity
            hoverKey={key}
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
              position: { left: '2%' }
            }}
            uiBackground={{
              ...ROUNDED_TEXTURE_BACKGROUND,
              color:
                backpackState.selectedEmoteSlot === index
                  ? COLOR.ACTIVE_BACKGROUND_COLOR
                  : COLOR.DARK_OPACITY_2
            }}
            onMouseDown={() => {
              store.dispatch(selectEmoteSlotAction(index))
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
                spriteName: `emote-circle-${fromVisualIndexToRealIndex(index)}`
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
            {isHovered(key) &&
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
              {isHovered(key) && backpackState.equippedEmotes[index] && (
                <UnequipEmoteCross slot={index} index={index} />
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
          </HoverUiEntity>
        )
      })}
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
  const key = `emote slot ${index}`
  return (
    <HoverUiEntity
      hoverKey={key}
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
      onMouseDown={() => {
        store.dispatch(updateEquippedEmoteAction({ slot, equippedEmote: '' }))
      }}
    >
      <Icon
        iconSize={canvasScaleRatio * 26}
        uiTransform={{ alignSelf: 'center', flexShrink: 0 }}
        icon={{ atlasName: 'icons', spriteName: 'CloseIcon' }}
      />
    </HoverUiEntity>
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
