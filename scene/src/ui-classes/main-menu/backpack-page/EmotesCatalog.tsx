import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  type EquippedEmote,
  type URNWithoutTokenId
} from '../../../utils/definitions'
import { getEmoteName, getEmoteThumbnail } from '../../../service/emotes'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { getBackgroundFromAtlas } from '../../../utils/ui-utils'
import {
  ITEMS_CATALOG_PAGE_SIZE,
  ROUNDED_TEXTURE_BACKGROUND,
  ZERO_ADDRESS
} from '../../../utils/constants'
import { COLOR } from '../../../components/color-palette'
import { ItemsCatalog } from './ItemCatalog'
import { NavButton } from '../../../components/nav-button/NavButton'
import { changeCategory } from '../../../service/wearable-category-service'
import { store } from '../../../state/store'
import Icon from '../../../components/icon/Icon'
import type { ItemElement } from '../../../utils/item-definitions'
import { CatalogGrid } from '../../../components/backpack/CatalogGrid'
import { catalystMetadataMap } from '../../../utils/wearables-promise-utils'
import { getPlayer } from '@dcl/sdk/src/players'
import { fetchEmotesPage } from '../../../utils/emotes-promise-utils'
import {
  selectEmoteSlotAction,
  updateEquippedEmotesAction,
  updateSelectedWearableURN
} from '../../../state/backpack/actions'
import { urnWithTokenIdMemo } from '../../../utils/urn-utils'

export function EmotesCatalog(): ReactElement {
  const backpackState = store.getState().backpack
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity>
      <EquippedEmoteList equippedEmotes={backpackState.equippedEmotes} />
      <ItemsCatalog
        fetchItemsPage={async () => {
          const backpackState = store.getState().backpack
          return await fetchEmotesPage({
            pageNum: backpackState.currentPage,
            pageSize: ITEMS_CATALOG_PAGE_SIZE,
            address: getPlayer()?.userId ?? ZERO_ADDRESS,
            cacheKey: store.getState().backpack.cacheKey
          })
        }}
      >
        <EmoteNavBar />
        <CatalogGrid
          uiTransform={{
            margin: { top: 20 * canvasScaleRatio }
          }}
          loading={backpackState.loadingPage}
          items={backpackState.shownEmotes}
          equippedItems={[
            backpackState.equippedEmotes[
              backpackState.selectedEmoteSlot
            ] as EquippedEmote
          ]}
          onChangeSelection={(selectedURN): void => {
            store.dispatch(
              updateSelectedWearableURN(selectedURN as URNWithoutTokenId)
            )
          }}
          onEquipItem={(itemElement: ItemElement): void => {
            urnWithTokenIdMemo.set(
              itemElement.urn as URNWithoutTokenId,
              itemElement.individualData[0].id
            )

            // TODO consider moving transform logic to redux with payload : { emoteURN, slotIndex }
            const newEquippedEmotes: EquippedEmote[] = [
              ...backpackState.equippedEmotes
            ]
            newEquippedEmotes[backpackState.selectedEmoteSlot] = itemElement.urn
            store.dispatch(updateEquippedEmotesAction(newEquippedEmotes))
          }}
          onUnequipItem={(): void => {
            // TODO consider moving transform logic to redux with payload : { emoteURN, slotIndex }
            const newEquippedEmotes: EquippedEmote[] = [
              ...backpackState.equippedEmotes
            ]
            newEquippedEmotes[backpackState.selectedEmoteSlot] = ''
            store.dispatch(updateEquippedEmotesAction(newEquippedEmotes))
          }}
        />
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
        active={!backpackState.equippedEmotes[backpackState.selectedEmoteSlot]}
        icon={{
          spriteName: `emote-circle-${backpackState.selectedEmoteSlot}`,
          atlasName: 'backpack'
        }}
        text={`EMOTE ${(backpackState.selectedEmoteSlot + 1) % 10}`}
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
          display: backpackState.equippedEmotes[backpackState.selectedEmoteSlot]
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
        text={getEmoteName(
          backpackState.equippedEmotes[backpackState.selectedEmoteSlot]
        )?.toUpperCase()}
        uiTransform={{
          padding: 20 * canvasScaleRatio,
          height: 80 * canvasScaleRatio,
          display: backpackState.equippedEmotes[backpackState.selectedEmoteSlot]
            ? 'flex'
            : 'none'
        }}
      />
    </UiEntity>
  )
}

function EquippedEmoteList({
  equippedEmotes
}: {
  equippedEmotes: EquippedEmote[]
}): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()

  return (
    <UiEntity uiTransform={{ flexDirection: 'column' }}>
      {equippedEmotes.map(
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
                  backpackState.selectedEmoteSlot === index
                    ? COLOR.ACTIVE_BACKGROUND_COLOR
                    : COLOR.SMALL_TAG_BACKGROUND
              }}
              onMouseDown={() => {
                store.dispatch(selectEmoteSlotAction(index))
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
              <UiEntity
                uiText={{
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
