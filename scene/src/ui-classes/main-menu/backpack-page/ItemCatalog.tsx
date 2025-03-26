import ReactEcs, { type ReactElement, UiEntity } from '@dcl/react-ecs'
import { getCanvasScaleRatio } from '../../../service/canvas-ratio'
import { store } from '../../../state/store'
import {
  updateCurrentPage,
  updateLoadedPage,
  updateLoadingPage,
  updateSavedResetVersion
} from '../../../state/backpack/actions'

import { Pagination } from '../../../components/pagination/pagination'
import { fetchWearablesPage } from '../../../utils/wearables-promise-utils'
import {
  WEARABLE_CATALOG_PAGE_SIZE,
  ZERO_ADDRESS
} from '../../../utils/constants'
import { getPlayer } from '@dcl/sdk/src/players'

export function ItemsCatalog({ children }: any): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack

  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        padding: 14 * canvasScaleRatio,
        margin: { left: 30 * canvasScaleRatio },
        height: '100%'
      }}
    >
      {children}
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
    </UiEntity>
  )
}

export function saveResetOutfit(): void {
  store.dispatch(updateSavedResetVersion())
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
