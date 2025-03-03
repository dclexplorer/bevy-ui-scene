import type {URN, URNWithoutTokenId} from "./definitions";

const urnWithoutTokenIdMemo: Record<URN, URNWithoutTokenId> = {} // TODO consider using Map if possible for performance improvement because long keys

export function getURNWithoutTokenId(urn: URN | null, avoidCache: boolean = false): URN | null {
    if (urn === null) return null;
    if (urnWithoutTokenIdMemo[urn] !== undefined && !avoidCache) return urnWithoutTokenIdMemo[urn];
    if (!urn.includes(":item:") || urn.split(":").length < 6) {
        urnWithoutTokenIdMemo[urn] = urn;
    } else {
        urnWithoutTokenIdMemo[urn] = urn.replace(/^(.*):[^:]+$/, "$1") as URNWithoutTokenId;
    }
    return urnWithoutTokenIdMemo[urn];
}