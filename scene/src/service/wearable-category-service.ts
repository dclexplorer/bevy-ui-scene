import type { WearableCategory } from './wearable-categories'
import { store } from '../state/store'
import { updateActiveWearableCategory } from '../state/backpack/actions'
import { setAvatarPreviewCameraToWearableCategory } from '../components/backpack/AvatarPreview'
import { closeColorPicker } from '../ui-classes/main-menu/backpack-page/WearableColorPicker'
import { updatePage } from '../ui-classes/main-menu/backpack-page/WearableCatalog'

export function changeCategory(category: WearableCategory | null): void {
  store.dispatch(updateActiveWearableCategory(category))
  setAvatarPreviewCameraToWearableCategory(category)
  closeColorPicker()
  updatePage().catch(console.error)
}
