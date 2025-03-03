import { expect } from "chai";
import { getOutfitSetupFromWearables, getWearablesFromOutfit, EMPTY_OUTFIT } from "../../scene/src/service/outfit";
import type { URN, URNWithoutTokenId } from "../../scene/src/utils/definitions";
import type { WearableEntity, OutfitSetup } from "../../scene/src/utils/wearables-definitions";

describe("getOutfitSetupFromWearables", () => {
    it("should return an outfit with wearables mapped correctly", () => {
        const equippedWearables: URN[] = [
            "urn:decentraland:ethereum:collections-v1:0x1234:item:1",
            "urn:decentraland:ethereum:collections-v1:0x5678:item:2"
        ];

        const catalystWearables: WearableEntity[] = [
            { id: "urn:decentraland:ethereum:collections-v1:0x1234:item", data: { category: "hat" } } as any,
            { id: "urn:decentraland:ethereum:collections-v1:0x5678:item", data: { category: "eyewear" } } as any
        ];

        const outfit = getOutfitSetupFromWearables(equippedWearables, catalystWearables);
        expect(outfit.hat).to.equal(equippedWearables[0]);
        expect(outfit.eyewear).to.equal(equippedWearables[1]);
    });

    it("should return an empty outfit when no wearables match", () => {
        const outfit = getOutfitSetupFromWearables([], []);
        expect(outfit).to.deep.equal(EMPTY_OUTFIT.wearables);
    });
});


describe("getWearablesFromOutfit", () => {
    it("should extract wearables from an outfit", () => {
        const outfit: OutfitSetup = {
            ...EMPTY_OUTFIT,
            wearables: {
                ...EMPTY_OUTFIT.wearables,
                hat: "urn:decentraland:ethereum:collections-v1:0x1234:item" as URNWithoutTokenId,
                eyewear: "urn:decentraland:ethereum:collections-v1:0x5678:item" as URNWithoutTokenId
            }
        };


        const wearables = getWearablesFromOutfit(outfit);

        expect(wearables).to.include("urn:decentraland:ethereum:collections-v1:0x1234:item");
        expect(wearables).to.include("urn:decentraland:ethereum:collections-v1:0x5678:item");

        //TODO fix maybe getOutfitSetupFromWearables is mutating EMPTY_OUTFIT
        console.log("EMPTY_OUTFIT.wearables", EMPTY_OUTFIT.wearables)

        expect(wearables.length).to.equal(2);
    });

    it("should return an empty array if no wearables are equipped", () => {
        expect(getWearablesFromOutfit(EMPTY_OUTFIT)).to.deep.equal([]);
    });
});
