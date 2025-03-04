import { expect } from 'chai';
import { getURNWithoutTokenId } from "../../scene/src/utils/URN-utils";
import { URN, URNWithoutTokenId } from "../../scene/src/utils/definitions";

describe("getURNWithoutTokenId1", () => {
    it("should return null if the URN is null", () => {
        expect(getURNWithoutTokenId(null)).to.be.null;
    });

    it("should return the same URN if it's off-chain", () => {
        const urn: URN = "urn:decentraland:off-chain:base-avatars:generic-avatar";
        expect(getURNWithoutTokenId(urn)).to.equal(urn);
    });

    it("should return the URN without the tokenId if it's on-chain", () => {
        const urn: URN = "urn:decentraland:ethereum:collections-v1:0x1234:item:56";
        const expected: URNWithoutTokenId = "urn:decentraland:ethereum:collections-v1:0x1234:item" as URNWithoutTokenId;
        expect(getURNWithoutTokenId(urn)).to.equal(expected);
    });

    it("should not break the URN when executed twice", () => {
        const urn: URN = "urn:decentraland:ethereum:collections-v1:0x1234:item:56";
        const result1 = getURNWithoutTokenId(urn);
        const result2 = getURNWithoutTokenId(result1 as URN);
        expect(result2).to.equal("urn:decentraland:ethereum:collections-v1:0x1234:item");
    });
});
