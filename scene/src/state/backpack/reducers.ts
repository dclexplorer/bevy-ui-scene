import { type BackpackPageState } from './state'
import { BACKPACK_ACTION, type BackpackActions } from './actions'
import { getOutfitSetupFromWearables } from '../../service/outfit'
import { store } from '../store'
import { catalystWearableMap } from '../../utils/wearables-promise-utils'

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
        },
        changedFromResetVersion: true
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
        },
        changedFromResetVersion: true
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
          : [...backpackPageState.forceRender, action.payload],
        changedFromResetVersion: true
      }
    case BACKPACK_ACTION.UPDATE_SAVED_RESET_VERSION:
      return {
        ...backpackPageState,
        savedResetOutfit: {
          base: JSON.parse(
            JSON.stringify(store.getState().backpack.outfitSetup.base)
          ),
          equippedWearables: JSON.parse(
            JSON.stringify(store.getState().backpack.equippedWearables)
          ),
          forceRender: [...store.getState().backpack.forceRender]
        },
        changedFromResetVersion: false
      }
    case BACKPACK_ACTION.RESET_OUTFIT:
      return {
        ...backpackPageState,
        outfitSetup: {
          ...backpackPageState.outfitSetup,
          base: JSON.parse(
            JSON.stringify(backpackPageState.savedResetOutfit.base)
          ),
          wearables: getOutfitSetupFromWearables(
            backpackPageState.savedResetOutfit.equippedWearables,
            Object.values(catalystWearableMap)
          )
        },
        forceRender: [...backpackPageState.savedResetOutfit.forceRender],
        equippedWearables: [
          ...backpackPageState.savedResetOutfit.equippedWearables
        ],
        changedFromResetVersion: false
      }
    default:
      return backpackPageState
  }
}
