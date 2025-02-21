import {type WearableCategory, type WearableCategoryURIParam} from "../service/wearable-categories";
import type {CatalogWearableElement, CatalystWearable, CatalystWearableMap} from "./wearables-definitions";
import type {URN, URNWithoutTokenId} from "./definitions";

export type WearablesPageResponse = {
    elements:CatalogWearableElement[],
    pageNum:number,
    pageSize:number,
    totalAmount:number
};

export type WearableCatalogPageParams = {
    pageNum: number
    pageSize: number
    address: string
    wearableCategory: WearableCategoryURIParam | null
    includeBase: boolean
    includeOnChain: boolean
}

// cache
export const catalystWearableMap:CatalystWearableMap = {};

export async function fetchWearablesPage({pageNum, pageSize, wearableCategory, address}:any):Promise<WearablesPageResponse>{
    try {
        const wearableCatalogPageURL = getWearableCatalogPageURL({
            pageNum,
            pageSize,
            address,
            wearableCategory:fixBodyCategoryURIParam(wearableCategory),
            includeBase: true,
            includeOnChain: true
        });
        const wearablesPageResponse:any = await fetch(wearableCatalogPageURL);
        const result:WearablesPageResponse = wearablesPageResponse.json();
        result.elements?.forEach((wearableElement:CatalogWearableElement) => {
            catalystWearableMap[wearableElement.urn] = wearableElement.entity.metadata;
        })
        return result;
    }catch(error) {
        console.error('wearablesPage Error fetching:', error)
        throw error
    }

    function getWearableCatalogPageURL({pageNum, pageSize, address, wearableCategory, includeBase, includeOnChain}:WearableCatalogPageParams):string {
        // TODO use realm BaseURL ?
        let str:string = `https://peer.decentraland.org/explorer/${address}/wearables?pageNum=${pageNum}&pageSize=${pageSize}`;
        if(wearableCategory !== null){
            str += `&category=${wearableCategory}`
        }
        if(includeBase){
            str += `&collectionType=base-wearable`
        }
        if(includeOnChain){
            str += `&collectionType=on-chain`
        }
        return str;
    }

    function fixBodyCategoryURIParam(category:WearableCategory):WearableCategoryURIParam {
        if(category === "body") return "body_shape"
        return category;
    }
}



export async function fetchWearablesData(...wearableURNs:URNWithoutTokenId[]):Promise<CatalystWearable[]>{
    if(wearableURNs.every((wearableURN)=>catalystWearableMap[wearableURN])){
        return wearableURNs.map(wearableURN => (catalystWearableMap[wearableURN]))
    }
    try {
        const baseURL = `https://peer.decentraland.org/lambdas/collections/wearables`;
        const url = `${baseURL}?${wearableURNs.map((urn:URNWithoutTokenId) => {
            const urnWithoutTokenId = urn
            return `wearableId=${urnWithoutTokenId}`;
        }).join('&')}`;
        const response = await fetch(url);
        const wearables = (await response.json()).wearables;
        wearables.forEach((wearable:CatalystWearable) => {
            catalystWearableMap[wearable.id] = wearable;
        })
        return wearables;
    }catch(error) {
        console.error("fetchWearablesData error", error);
        return []
    }
}

export function getURNWithoutTokenId(urn:URN):URN{
    // TODO add unit test?
    // TODO should not break the URN when executed 2 times
    return (urn.includes(":off-chain:") || urn.split(":").length < 6 ? urn : urn.replace(/^(.*):[^:]+$/, "$1")) as URN
}