import ReactEcs, { Button, type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { store } from '../../../state/store'
import { NavButton } from '../../../components/nav-button/NavButton'
import Icon from '../../../components/icon/Icon'
import {
  categoryHasColor,
  WEARABLE_CATEGORY_DEFINITIONS,
  type WearableCategory
} from '../../../service/wearable-categories'
import { WearableCatalogGrid } from '../../../components/backpack/WearableCatalogGrid'
import type { URNWithoutTokenId } from '../../../utils/definitions'
import {
  resetOutfitAction,
  updateAvatarBase,
  updateCurrentPage,
  updateEquippedWearables,
  updateLoadedPage,
  updateLoadingPage,
  updateSavedResetVersion,
  updateSelectedWearableURN
} from '../../../state/backpack/actions'
import type { CatalogWearableElement } from '../../../utils/wearables-definitions'
import {
  BASE_FEMALE_URN,
  BASE_MALE_URN,
  urnWithTokenIdMemo
} from '../../../utils/urn-utils'
import { Pagination } from '../../../components/pagination/pagination'
import {
  catalystWearableMap,
  fetchWearablesData,
  fetchWearablesPage
} from '../../../utils/wearables-promise-utils'
import { updateAvatarPreview } from '../../../components/backpack/AvatarPreview'
import {
  ROUNDED_TEXTURE_BACKGROUND,
  WEARABLE_CATALOG_PAGE_SIZE,
  ZERO_ADDRESS
} from '../../../utils/constants'
import { getPlayer } from '@dcl/sdk/src/players'
import { WearableColorPicker } from './WearableColorPicker'
import { COLOR } from '../../../components/color-palette'

export function WearablesCatalog(): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack
  const mustShowColor = categoryHasColor(backpackState.activeWearableCategory)

  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        padding: 14 * canvasScaleRatio,
        margin: { left: 30 * canvasScaleRatio },
        height: '100%'
      }}
    >
      {/* CATALOG NAV_BAR */}
      <UiEntity uiTransform={{ flexDirection: 'row', width: '100%' }}>
        <NavButton
          active={backpackState.activeWearableCategory === null}
          icon={{ spriteName: 'all', atlasName: 'backpack' }}
          text={'ALL'}
          uiTransform={{ padding: 40 * canvasScaleRatio }}
          onClick={() => {
            if (backpackState.activeWearableCategory === null) return null
            // this.changeCategory(null)
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
            display:
              backpackState.activeWearableCategory === null ? 'none' : 'flex'
          }}
          icon={{
            spriteName: 'RightArrow',
            atlasName: 'icons'
          }}
        />
        {backpackState.activeWearableCategory && (
          <NavButton
            active={true}
            showDeleteButton={true}
            onDelete={() => {
              // this.changeCategory(null)
            }}
            icon={{
              spriteName: `category-${backpackState.activeWearableCategory}`,
              atlasName: 'backpack'
            }}
            text={
              WEARABLE_CATEGORY_DEFINITIONS[
                backpackState.activeWearableCategory
              ].label
            }
            uiTransform={{ padding: 20 * canvasScaleRatio }}
          />
        )}
        {mustShowColor && <WearableColorPicker />}
      </UiEntity>
      <WearableCatalogGrid
        uiTransform={{
          margin: { top: 20 * canvasScaleRatio }
        }}
        loading={backpackState.loadingPage}
        wearables={backpackState.shownWearables}
        equippedWearables={backpackState.equippedWearables}
        baseBody={backpackState.outfitSetup.base}
        onChangeSelection={(selectedURN: URNWithoutTokenId | null): void => {
          store.dispatch(updateSelectedWearableURN(selectedURN))
        }}
        onEquipWearable={(wearable: CatalogWearableElement): void => {
          urnWithTokenIdMemo.set(
            wearable.entity.metadata.id,
            wearable.individualData[0].id
          )
          updateEquippedWearable(
            wearable.category,
            wearable.entity.metadata.id
          ).catch(console.error)
        }}
        onUnequipWearable={(wearable: CatalogWearableElement): void => {
          updateEquippedWearable(wearable.category, null).catch(console.error)
        }}
      />
      <Pagination
        uiTransform={{
          positionType: 'absolute',
          position: { bottom: 130 * canvasScaleRatio }
        }}
        disabled={backpackState.loadingPage}
        onChange={(page: number) => {
          store.dispatch(updateCurrentPage(page))
          updatePage().catch(console.error)
        }}
        pages={backpackState.totalPages}
        currentPage={backpackState.currentPage}
      />
      {backpackState.changedFromResetVersion && (
        <Button
          value={'RESET OUTFIT'}
          uiTransform={{
            positionType: 'absolute',
            height: '5%',
            padding: { left: '1%', right: '2%' },
            position: { bottom: '1%', left: '-54%' }
          }}
          uiBackground={{
            ...ROUNDED_TEXTURE_BACKGROUND,
            color: COLOR.SMALL_TAG_BACKGROUND
          }}
          onMouseDown={() => {
            resetOutfit().catch(console.error)
          }}
        />
      )}
    </UiEntity>
  )
}

async function resetOutfit(): Promise<void> {
  store.dispatch(resetOutfitAction())

  updateAvatarPreview(
    store.getState().backpack.equippedWearables,
    store.getState().backpack.outfitSetup.base,
    store.getState().backpack.forceRender
  )
}

export function saveResetOutfit(): void {
  store.dispatch(updateSavedResetVersion())
}

async function updateEquippedWearable(
  category: WearableCategory,
  wearableURN: URNWithoutTokenId | null
): Promise<void> {
  const backpackState = store.getState().backpack
  if (category === WEARABLE_CATEGORY_DEFINITIONS.body_shape.id) {
    if (wearableURN === null) {
      store.dispatch(
        updateAvatarBase({
          ...backpackState.outfitSetup.base,
          bodyShapeUrn:
            store.getState().backpack.outfitSetup.base.bodyShapeUrn ===
            BASE_MALE_URN
              ? BASE_FEMALE_URN
              : BASE_MALE_URN
        })
      )
    } else {
      store.dispatch(
        updateAvatarBase({
          ...backpackState.outfitSetup.base,
          bodyShapeUrn: wearableURN
        })
      )
    }
  } else {
    const equippedWearablesWithoutPrevious =
      backpackState.equippedWearables.filter(
        (wearableURN) =>
          wearableURN !== backpackState.outfitSetup.wearables[category]
      )

    const wearables =
      wearableURN === null
        ? equippedWearablesWithoutPrevious
        : [...equippedWearablesWithoutPrevious, wearableURN]
    await fetchWearablesData(...(wearables ?? []))
    store.dispatch(
      updateEquippedWearables({
        wearables,
        wearablesData: catalystWearableMap
      })
    )
  }

  updateAvatarPreview(
    store.getState().backpack.equippedWearables,
    store.getState().backpack.outfitSetup.base,
    store.getState().backpack.forceRender
  )
}

export async function updatePage(): Promise<void> {
  const backpackState = store.getState().backpack
  store.dispatch(updateLoadingPage(true))
  // TODO improve with throttle and remove disabled prop
  const wearablesPage = await fetchWearablesPage({
    pageNum: backpackState.currentPage,
    pageSize: WEARABLE_CATALOG_PAGE_SIZE,
    address: getPlayer()?.userId ?? ZERO_ADDRESS,
    wearableCategory: backpackState.activeWearableCategory,
    cacheKey: store.getState().backpack.cacheKey
  })

  store.dispatch(
    updateLoadedPage({
      totalPages: Math.ceil(
        wearablesPage.totalAmount / WEARABLE_CATALOG_PAGE_SIZE
      ),
      shownWearables: wearablesPage.elements
    })
  )
}
