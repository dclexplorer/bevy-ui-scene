import type {URN, URNWithoutTokenId} from "./definitions";
export const BASE_MALE_URN:URNWithoutTokenId = "urn:decentraland:off-chain:base-avatars:BaseMale" as URNWithoutTokenId;

const urnWithoutTokenIdMemo: Record<URN, URNWithoutTokenId> = {} // TODO consider using Map if possible for performance improvement because long keys

export function getURNWithoutTokenId(urn: URN | null | URNWithoutTokenId, avoidCache: boolean = false): URNWithoutTokenId | null {
    if (urn === null) return null;

    // Check if the value is already cached and avoid cache flag is false
    if (urnWithoutTokenIdMemo[urn as URN] !== undefined && !avoidCache) {
        return urnWithoutTokenIdMemo[urn as URN];
    }

    // Check if it's an off-chain URN or has less than 6 parts
    if (urn.includes(":off-chain:") || urn.split(":").length < 6) {
        urnWithoutTokenIdMemo[urn as URN] = urn as URNWithoutTokenId;
    } else {
        // Split URN by ":" and check if the last part is a tokenId (numeric or alphanumeric, which can be removed)
        const parts = urn.split(":");
        const lastPart = parts[parts.length - 1];

        // Check if the last part is a number (tokenId), if so remove it
        if (/^\d+$/.test(lastPart)) {
            urnWithoutTokenIdMemo[urn as URN] = urn.replace(/^(.*):[^:]+$/, "$1") as URNWithoutTokenId;
        } else {
            // If it's not a tokenId (e.g., 'item' or other non-numeric part), don't remove it
            urnWithoutTokenIdMemo[urn as URN] = urn as URNWithoutTokenId;
        }
    }

    // Return the URN without the tokenId part
    return urnWithoutTokenIdMemo[urn as URN];
}