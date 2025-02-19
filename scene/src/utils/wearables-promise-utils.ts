import type {WearableCategory} from "../service/wearable-categories";
import type {CatalogWearableElement, CatalystWearable, CatalystWearableMap} from "./wearables-definitions";
import type {URN} from "./definitions";

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

        return wearablesPageResponse.json();
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

}

export const catalystWearableMap:CatalystWearableMap = {};

export async function fetchWearablesData(...wearableURNs:URN[]):Promise<CatalystWearable[]>{
    if(wearableURNs.every((wearableURN)=>catalystWearableMap[wearableURN])){
        return wearableURNs.map(wearableURN => (catalystWearableMap[wearableURN]))
    }
    try {
        const baseURL = `https://peer.decentraland.org/lambdas/collections/wearables`;
        const url = `${baseURL}?${wearableURNs.map((urn:URN) => {
            const urnWithoutTokenId = getURNWithoutTokenId(urn)
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
    return (urn.includes(":off-chain:") || urn.split(":").length < 6 ? urn : urn.replace(/^(.*):[^:]+$/, "$1")) as URN
}