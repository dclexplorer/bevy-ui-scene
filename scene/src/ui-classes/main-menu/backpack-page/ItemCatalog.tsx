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
import {
  catalystMetadataMap,
  type WearablesPageResponse
} from '../../../utils/wearables-promise-utils'
import { ITEMS_CATALOG_PAGE_SIZE } from '../../../utils/constants'
import { type EmotesPageResponse } from '../../../utils/emotes-promise-utils'
import { InfoPanel } from '../../../components/backpack/InfoPanel'
export type ItemsCatalogProps = {
  children?: ReactElement
  fetchItemsPage: () => Promise<EmotesPageResponse | WearablesPageResponse>
}
export function ItemsCatalog({
  children,
  fetchItemsPage
}: ItemsCatalogProps): ReactElement {
  const canvasScaleRatio = getCanvasScaleRatio()
  const backpackState = store.getState().backpack

  return (
    <UiEntity>
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
            updatePage(fetchItemsPage).catch(console.error)
          }}
          pages={backpackState.totalPages}
          currentPage={backpackState.currentPage}
        />
      </UiEntity>
      <InfoPanel
        uiTransform={{
          position: {
            top: -50 * canvasScaleRatio,
            left: -20 * canvasScaleRatio
          }
        }}
        canvasScaleRatio={canvasScaleRatio}
        entityMetadata={
          backpackState.selectedURN === null
            ? null
            : catalystMetadataMap[backpackState.selectedURN]
        }
      />
    </UiEntity>
  )
}

export function saveResetOutfit(): void {
  store.dispatch(updateSavedResetVersion())
}

export async function updatePage(
  fetchItemsPage: () => Promise<WearablesPageResponse | EmotesPageResponse>
): Promise<void> {
  store.dispatch(updateLoadingPage(true))
  // TODO improve with throttle and remove disabled prop
  const itemsPage = await fetchItemsPage()
  store.dispatch(
    updateLoadedPage({
      totalPages: Math.ceil(itemsPage.totalAmount / ITEMS_CATALOG_PAGE_SIZE),
      elements: itemsPage.elements
    })
  )
}
