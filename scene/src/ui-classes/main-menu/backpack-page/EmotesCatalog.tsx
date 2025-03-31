import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import {
  type EquippedEmote,
  type URNWithoutTokenId
} from '../../../utils/definitions'
import { getEmoteName } from '../../../service/emotes'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { ITEMS_CATALOG_PAGE_SIZE, ZERO_ADDRESS } from '../../../utils/constants'
import { ItemsCatalog } from './ItemCatalog'
import { changeCategory } from '../../../service/wearable-category-service'
import { store } from '../../../state/store'
import Icon from '../../../components/icon/Icon'
import type { ItemElement } from '../../../utils/item-definitions'
import { CatalogGrid } from '../../../components/backpack/CatalogGrid'
import { getPlayer } from '@dcl/sdk/src/players'
import { fetchEmotesPage } from '../../../utils/emotes-promise-utils'
import {
  updateEquippedEmoteAction,
  updateSelectedWearableURN
} from '../../../state/backpack/actions'
import { urnWithTokenIdMemo } from '../../../utils/urn-utils'
import { playEmote } from '../../../components/backpack/AvatarPreview'
import { EquippedEmoteList } from './EquippedEmoteList'
import { NavButton } from '../../../components/nav-button/NavButton'

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
            playEmote(selectedURN as EquippedEmote)
          }}
          onEquipItem={(itemElement: ItemElement): void => {
            urnWithTokenIdMemo.set(
              itemElement.urn as URNWithoutTokenId,
              itemElement.individualData[0].id
            )

            store.dispatch(
              updateEquippedEmoteAction({
                equippedEmote: itemElement.urn,
                slot: backpackState.selectedEmoteSlot
              })
            )
          }}
          onUnequipItem={(): void => {
            store.dispatch(
              updateEquippedEmoteAction({
                equippedEmote: '',
                slot: backpackState.selectedEmoteSlot
              })
            )
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
