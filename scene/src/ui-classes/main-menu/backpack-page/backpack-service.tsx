import { store } from '../../../state/store'
import { ITEMS_CATALOG_PAGE_SIZE } from '../../../utils/backpack-constants'
import { getPlayer } from '@dcl/sdk/src/players'
import { ZERO_ADDRESS } from '../../../utils/constants'
import { updatePage } from './ItemCatalog'
import { BACKPACK_SECTION } from '../../../state/backpack/state'
import { fetchWearablesPage } from '../../../utils/wearables-promise-utils'
import { getRealm } from '~system/Runtime'
import { fetchEmotesPage } from '../../../utils/emotes-promise-utils'

export const updatePageGeneric = async (): Promise<void> => {
  const backpackState = store.getState().backpack
  const pageParams = {
    pageNum: backpackState.currentPage,
    pageSize: ITEMS_CATALOG_PAGE_SIZE,
    address: getPlayer()?.userId ?? ZERO_ADDRESS,
    cacheKey: store.getState().backpack.cacheKey,
    orderBy: store.getState().backpack.searchFilter.orderBy,
    orderDirection: store.getState().backpack.searchFilter.orderDirection
  }
  await updatePage(
    backpackState.activeSection === BACKPACK_SECTION.WEARABLES
      ? async () =>
          await fetchWearablesPage((await getRealm({}))?.realmInfo?.baseUrl)({
            ...pageParams,
            wearableCategory: backpackState.activeWearableCategory,
            searchFilter: backpackState.searchFilter
          })
      : async () =>
          await fetchEmotesPage({
            ...pageParams,
            searchFilter: backpackState.searchFilter
          })
  )
}
