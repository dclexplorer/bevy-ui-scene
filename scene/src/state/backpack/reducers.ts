import { type BackpackPageState } from './state'
import { BACKPACK_ACTION, type BackpackActions } from './actions'
import { getOutfitSetupFromWearables } from '../../service/outfit'

export function reducer(
  backpackPageState: BackpackPageState,
  action: BackpackActions
): BackpackPageState {
  switch (action.type) {
    case BACKPACK_ACTION.UPDATE_CURRENT_PAGE:
      return { ...backpackPageState, currentPage: action.payload }
    case BACKPACK_ACTION.SELECT_WEARABLE_URN:
      return { ...backpackPageState, selectedURN: action.payload }
    case BACKPACK_ACTION.UPDATE_ACTIVE_WEARABLE_CATEGORY:
      return {
        ...backpackPageState,
        activeWearableCategory: action.payload,
        currentPage: 1
      }
    case BACKPACK_ACTION.UPDATE_LOADING_PAGE:
      return {
        ...backpackPageState,
        loadingPage: true
      }
    case BACKPACK_ACTION.UPDATE_LOADED_PAGE:
      return {
        ...backpackPageState,
        totalPages: action.payload.totalPages,
        shownWearables: action.payload.shownWearables,
        loadingPage: false
      }
    case BACKPACK_ACTION.UPDATE_EQUIPPED_WEARABLES:
      return {
        ...backpackPageState,
        equippedWearables: action.payload.wearables,
        outfitSetup: {
          ...backpackPageState.outfitSetup,
          wearables: {
            ...backpackPageState.outfitSetup.wearables,
            ...getOutfitSetupFromWearables(
              action.payload.wearables,
              action.payload.wearablesData
            )
          }
        }
      }
    case BACKPACK_ACTION.UPDATE_AVATAR_BASE:
      return {
        ...backpackPageState,
        outfitSetup: {
          ...backpackPageState.outfitSetup,
          base: {
            ...backpackPageState.outfitSetup.base,
            name: action.payload.name,
            eyesColor: action.payload.eyesColor,
            hairColor: action.payload.hairColor,
            skinColor: action.payload.skinColor,
            bodyShapeUrn: action.payload.bodyShapeUrn
          }
        }
      }
    case BACKPACK_ACTION.UPDATE_CACHE_KEY:
      return {
        ...backpackPageState,
        cacheKey: Date.now().toString()
      }
    case BACKPACK_ACTION.SWITCH_FORCE_RENDER_CATEGORY:
      return {
        ...backpackPageState,
        forceRender: backpackPageState.forceRender.includes(action.payload)
          ? backpackPageState.forceRender.filter((i) => i !== action.payload)
          : [...backpackPageState.forceRender, action.payload]
      }
    default:
      return backpackPageState
  }
}
