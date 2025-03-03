import type {URN, URNWithoutTokenId} from "../utils/definitions";

const urnWithoutTokenIdMemo:Record<URN, URNWithoutTokenId> = {} // TODO consider using Map if possible for performance improvement because long keys

export function getURNWithoutTokenId(urn:URN|null, avoidCache:boolean = false):URN|null{
    if(urn === null) return null
    if(urnWithoutTokenIdMemo[urn] !== undefined && !avoidCache) return urnWithoutTokenIdMemo[urn];
    // TODO add unit test?
    // TODO should not break the URN when executed 2 times
    urnWithoutTokenIdMemo[urn] = (urn.includes(":off-chain:") || urn.split(":").length < 6 ? urn : urn.replace(/^(.*):[^:]+$/, "$1")) as URNWithoutTokenId
    return urnWithoutTokenIdMemo[urn];
}