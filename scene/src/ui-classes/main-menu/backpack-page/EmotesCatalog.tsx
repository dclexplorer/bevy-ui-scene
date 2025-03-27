import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { type offchainEmoteURN } from '../../../utils/definitions'
import { getEmoteName } from '../../../service/emotes'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import { ROUNDED_TEXTURE_BACKGROUND } from '../../../utils/constants'
import { COLOR } from '../../../components/color-palette'
import { ItemsCatalog } from './ItemCatalog'
import { NavButton } from '../../../components/nav-button/NavButton'
import { changeCategory } from '../../../service/wearable-category-service'
import { store } from '../../../state/store'
import Icon from '../../../components/icon/Icon'

type offchainEmoteURNOrNull = offchainEmoteURN | null

const state = {
  selectedEmoteSlot: 0
}

export function EmotesCatalog(): ReactElement {
  const backpackState = store.getState().backpack

  return (
    <UiEntity>
      <EquippedEmoteList
        equippedEmotes={backpackState.equippedEmotes}
        onSelectSlot={(slot): void => {}}
      />
      <ItemsCatalog>
        <EmoteNavBar />
      </ItemsCatalog>
    </UiEntity>
  )
}

function EmoteNavBar(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack

  return (
    <UiEntity uiTransform={{ flexDirection: 'row', width: '100%' }}>
      <NavButton
        active={!backpackState.equippedEmotes[state.selectedEmoteSlot]}
        icon={{
          spriteName: `emote-circle-${state.selectedEmoteSlot}`,
          atlasName: 'backpack'
        }}
        text={'ALL'}
        uiTransform={{ padding: 40 * canvasScaleRatio }}
        onClick={() => {
          if (backpackState.activeWearableCategory === null) return null
          changeCategory(null)
        }}
      />
      <Icon
        iconSize={40 * canvasScaleRatio}
        uiTransform={{
          alignSelf: 'center',
          margin: {
            left: 16 * canvasScaleRatio,
            right: 16 * canvasScaleRatio
          },
          display: backpackState.equippedEmotes[state.selectedEmoteSlot]
            ? 'flex'
            : 'none'
        }}
        icon={{
          spriteName: 'RightArrow',
          atlasName: 'icons'
        }}
      />
      <NavButton
        active={true}
        showDeleteButton={true}
        onDelete={() => {
          changeCategory(null)
        }}
        icon={{
          spriteName: backpackState.equippedEmotes[state.selectedEmoteSlot],
          atlasName: 'emotes'
        }}
        text={getEmoteName(
          backpackState.equippedEmotes[state.selectedEmoteSlot]
        ).toUpperCase()}
        uiTransform={{
          padding: 20 * canvasScaleRatio,
          height: 80 * canvasScaleRatio
        }}
      />
    </UiEntity>
  )
}

function EquippedEmoteList({
  equippedEmotes
}: {
  equippedEmotes: offchainEmoteURNOrNull[]
  onSelectSlot: (index: number) => void
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity uiTransform={{ flexDirection: 'column' }}>
      {equippedEmotes.map((equippedEmoteURN, index) => {
        return (
          <UiEntity
            uiTransform={{
              height: canvasScaleRatio * 120,
              width: canvasScaleRatio * 440,
              margin: canvasScaleRatio * 10,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
            uiBackground={{
              ...ROUNDED_TEXTURE_BACKGROUND,
              color:
                state.selectedEmoteSlot === index
                  ? COLOR.ACTIVE_BACKGROUND_COLOR
                  : COLOR.SMALL_TAG_BACKGROUND
            }}
            onMouseDown={() => {
              state.selectedEmoteSlot = index
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
                spriteName: `emote-circle-${index}`
              })}
            />
            {equippedEmoteURN && (
              <UiEntity
                uiText={{
                  value: getEmoteName(equippedEmoteURN),
                  fontSize: canvasScaleRatio * 30
                }}
              />
            )}
            <UiEntity
              uiTransform={{
                height: canvasScaleRatio * 100,
                width: canvasScaleRatio * 100,
                positionType: 'absolute',
                position: { right: canvasScaleRatio * 20 }
              }}
              uiBackground={getBackgroundFromAtlas({
                atlasName: 'backpack',
                spriteName: `rarity-background-base`
              })}
            >
              <UiEntity
                uiTransform={{ height: '100%', width: '100%' }}
                uiBackground={getBackgroundFromAtlas({
                  atlasName: 'emotes',
                  spriteName: equippedEmoteURN as string
                })}
              />
            </UiEntity>
          </UiEntity>
        )
      })}
    </UiEntity>
  )
}
