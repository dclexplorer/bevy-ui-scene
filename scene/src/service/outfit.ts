import type {URN, URNWithoutTokenId} from '../utils/definitions'
import type {WearableEntity, OutfitSetup, OutfitSetupWearables} from "../utils/wearables-definitions";
import {WEARABLE_CATEGORY_DEFINITIONS, type WearableCategory} from "./wearable-categories";
import {BASE_MALE_URN, getURNWithoutTokenId} from "../utils/URN-utils";


export const EMPTY_OUTFIT: OutfitSetup = {
    wearables: {
        body_shape: fromBaseToURN('BaseMale'),
        hair: null,
        eyebrows: null,
        eyes: null,
        mouth: null,
        facial_hair: null,
        upper_body: null,
        hands_wear: null,
        lower_body: null,
        feet: null,
        hat: null,
        eyewear: null,
        earring: null,
        mask: null,
        top_head: null,
        tiara: null,
        helmet: null,
        skin: null
    },
    base: {
        name:"default_name",
        skinColor:{r:1,g:1,b:1},
        hairColor:{r:1,g:1,b:1},
        eyesColor:{r:1,g:1,b:1},
        bodyShapeUrn:BASE_MALE_URN
    }
}

export function getOutfitSetupFromWearables(equippedWearables:URN[] = [], catalystWearables: WearableEntity[]): OutfitSetupWearables {
    // TODO unit test candidate
    return catalystWearables.reduce((acc: OutfitSetupWearables, catalystWearable: WearableEntity) => {
        acc[catalystWearable.data.category] = equippedWearables.find(e=> getURNWithoutTokenId(e) === catalystWearable.id) as URN;
        return acc;
    }, EMPTY_OUTFIT.wearables)
}

export function getWearablesFromOutfit(outfit:OutfitSetup):URNWithoutTokenId[]{
    // TODO unit test candidate
    const result:URNWithoutTokenId[] = []
    Object.keys(WEARABLE_CATEGORY_DEFINITIONS).forEach((category):void => {
        if(outfit.wearables[category as WearableCategory] !== null && category !== WEARABLE_CATEGORY_DEFINITIONS.body_shape.id){
            result.push(outfit.wearables[category as WearableCategory] as URNWithoutTokenId)
        }
    });
    return result;
}

function fromBaseToURN(baseKey: string): URN {
    return `urn:decentraland:off-chain:base-avatars:${baseKey}`
}
