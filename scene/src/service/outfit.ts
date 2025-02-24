import type {URN, URNWithoutTokenId} from '../utils/definitions'
import type {CatalystWearable, OutfitSetup, OutfitSetupWearables} from "../utils/wearables-definitions";
import {WEARABLE_CATEGORY_DEFINITIONS, type WearableCategory} from "./wearable-categories";

export function getDefaultOutfitSetup(): OutfitSetup {
    return {
        wearables: {
            body: fromBaseToURN('BaseMale'),
            hair: fromBaseToURN('casual_hair_01'),
            eyebrows: fromBaseToURN('eyebrows_00'),
            eyes: fromBaseToURN('eyes_00'),
            mouth: fromBaseToURN('mouth_06'),
            facial_hair: null,
            upper_body: fromBaseToURN('bee_t_shirt'),
            hands_wear: null,
            lower_body: fromBaseToURN('corduroygreenpants'),
            feet: fromBaseToURN('comfy_sport_sandals'),
            hat: null,
            eyewear: null,
            earring: null,
            mask: null,
            top_head: null,
            tiara: null,
            helmet: null,
            skin: null
        },
        color: {
            eyes: [0.5, 0.2, 0.05],
            hair: [0.5, 0.2, 0.05],
            skin: [0.82, 0.76, 0.7]
        }
    }
}

export const EMPTY_OUTFIT: OutfitSetup = {
    wearables: {
        body: fromBaseToURN('BaseMale'),
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
    color: {
        eyes: [0.5, 0.2, 0.05],
        hair: [0.5, 0.2, 0.05],
        skin: [0.82, 0.76, 0.7]
    }
}

export function getOutfitSetupFromWearables(catalystWearables: CatalystWearable[]): OutfitSetupWearables {
    // TODO unit test candidate
    return catalystWearables.reduce((acc: OutfitSetupWearables, catalystWearable: CatalystWearable) => {
        acc[catalystWearable.data.category] = catalystWearable.id;
        return acc;
    }, EMPTY_OUTFIT.wearables)
}

export function getWearablesFromOutfit(outfit:OutfitSetup):URNWithoutTokenId[]{
    // TODO unit test candidate
    const result:URNWithoutTokenId[] = []
    Object.keys(WEARABLE_CATEGORY_DEFINITIONS).forEach((category):void => {
        if(outfit.wearables[category as WearableCategory] !== null){
            result.push(outfit.wearables[category as WearableCategory] as URNWithoutTokenId)
        }
    });
    return result;
}

function fromBaseToURN(baseKey: string): URN {
    return `urn:decentraland:off-chain:base-avatars:${baseKey}`
}
