import { expect } from "chai";
import { forceRenderHasEffect } from '../../scene/src/service/force-render-service'
import { WEARABLE_CATEGORY_DEFINITIONS } from '../../scene/src/service/categories'
import catalystWearableMapMock from './catalyst-wearable-map-mock.json'
import { CatalystWearableMap } from '../../scene/src/utils/item-definitions'
import { URNWithoutTokenId } from '../../scene/src/utils/definitions'

const hairURN ="urn:decentraland:ethereum:collections-v1:mf_sammichgamer:mf_animehair" as URNWithoutTokenId
const wearableURNOfHatHidingHair = "urn:decentraland:matic:collections-v2:0x07d03ca2c27f29ec3c4cf3afad857c5af13f61cd:0" as URNWithoutTokenId


describe("forceRenderHasEffect", () => {
  it("it should return false for body_shape category", () => {
      expect(forceRenderHasEffect(
        WEARABLE_CATEGORY_DEFINITIONS.body_shape.id,
        "decentraland:ethereum:collections-v1:contractAddress:0x1",
        {},
        []
      )).to.equal(false);
  });

  it("it should return false when wearableURN is null", () => {
    expect(forceRenderHasEffect(
      WEARABLE_CATEGORY_DEFINITIONS.body_shape.id,
      null,
      {},
      []
    )).to.eq(false);
  });

  it("it should return true if an equipped wearable is hiding current wearable category", ()=>{
    const equippedHairAndHatThatHidesHair:URNWithoutTokenId[] = [
      hairURN,
      wearableURNOfHatHidingHair
    ]
    expect(forceRenderHasEffect(
      WEARABLE_CATEGORY_DEFINITIONS.hair.id,
      hairURN as URNWithoutTokenId,
      catalystWearableMapMock as CatalystWearableMap,
      equippedHairAndHatThatHidesHair
    )).to.eq(true);
  })

  it("it should return true if an equipped wearable is hiding head and current category is hair", ()=>{
    const catrinaMaskURN = "urn:decentraland:matic:collections-v2:0x4fde0297c458e7a0bc35f07c015f322ca31b459e:0"
    const equippedMaskHidingHeadThenHair = [
      hairURN,
      catrinaMaskURN
    ]
    expect(forceRenderHasEffect(
      WEARABLE_CATEGORY_DEFINITIONS.hair.id,
      hairURN as URNWithoutTokenId,
      catalystWearableMapMock as CatalystWearableMap,
      equippedMaskHidingHeadThenHair as URNWithoutTokenId[]
    )).to.eq(true);

  })
});
