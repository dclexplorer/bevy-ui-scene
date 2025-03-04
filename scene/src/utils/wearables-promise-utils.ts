import type {CatalogWearableElement, WearableEntity, CatalystWearableMap} from "./wearables-definitions";
import type {URNWithoutTokenId} from "./definitions";
import {type WearableCategory} from "../service/wearable-categories";

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
    wearableCategory: WearableCategory | null
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
            wearableCategory,
            includeBase: true,
            includeOnChain: true
        });
        const wearablesPageResponse:any = await fetch(wearableCatalogPageURL);
        const result:WearablesPageResponse = await wearablesPageResponse.json();

        result.elements?.forEach((wearableElement:CatalogWearableElement) => {
            if(wearableElement.urn.includes(":collections-v1:") || wearableElement.urn.includes(":off-chain:")){
                // TODO review if we can use CatalogWearableElement instead of CatalystWearable
                wearableElement.entity.metadata.name = wearableElement.entity.metadata.i18n[0].text;
            }
            catalystWearableMap[wearableElement.urn] = wearableElement.entity.metadata;
        })
        return result;
    }catch(error) {
        console.error('wearablesPage Error fetching:', error)
        throw error
    }

    function getWearableCatalogPageURL({pageNum, pageSize, address, wearableCategory, includeBase, includeOnChain}:WearableCatalogPageParams):string {
        // TODO use realm BaseURL ?
        let str:string = `https://peer.decentraland.org/explorer/${address}/wearables?pageNum=${pageNum}&pageSize=${pageSize}&includeEntities=true`;
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
}

export async function fetchWearablesData(...wearableURNs:URNWithoutTokenId[]):Promise<WearableEntity[]>{
    if(wearableURNs.every((wearableURN)=>catalystWearableMap[wearableURN])){
        return wearableURNs.map(wearableURN => (catalystWearableMap[wearableURN]))
    }
    try {
        const baseURL = `https://peer.decentraland.org/lambdas/collections/wearables`;
        const url = `${baseURL}?${wearableURNs.map((urn:URNWithoutTokenId) => {
            return `wearableId=${urn}`;
        }).join('&')}`;
        const response = await fetch(url);
        const wearables = (await response.json()).wearables;
        wearables.forEach((wearable:WearableEntity) => {
            catalystWearableMap[wearable.id] = wearable;
        })
        return wearables;
    }catch(error) {
        console.error("fetchWearablesData error", error);
        return []
    }
}

