import type { WearableCategory } from './categories'
import { store } from '../state/store'
import { updateActiveWearableCategory } from '../state/backpack/actions'
import { setAvatarPreviewCameraToWearableCategory } from '../components/backpack/AvatarPreview'
import { closeColorPicker } from '../ui-classes/main-menu/backpack-page/WearableColorPicker'
import { updatePage } from '../ui-classes/main-menu/backpack-page/ItemCatalog'
import { fetchWearablesPage } from '../utils/wearables-promise-utils'
import { CATALYST_BASE_URL_FALLBACK, ZERO_ADDRESS } from '../utils/constants'
import { getPlayer } from '@dcl/sdk/src/players'
import { getRealm } from '~system/Runtime'
import { ITEMS_CATALOG_PAGE_SIZE } from '../utils/backpack-constants'

export function changeCategory(category: WearableCategory | null): void {
  store.dispatch(updateActiveWearableCategory(category))
  const backpackState = store.getState().backpack
  // setAvatarPreviewCameraToWearableCategory(category)
  updatePage(
    async () =>
      await fetchWearablesPage(
        (await getRealm({}))?.realmInfo?.baseUrl ?? CATALYST_BASE_URL_FALLBACK
      )({
        pageNum: backpackState.currentPage,
        pageSize: ITEMS_CATALOG_PAGE_SIZE,
        address: getPlayer()?.userId ?? ZERO_ADDRESS,
        wearableCategory: backpackState.activeWearableCategory,
        cacheKey: backpackState.cacheKey,
        searchFilter: backpackState.searchFilter
      })
  ).catch(console.error)
  closeColorPicker()
}
