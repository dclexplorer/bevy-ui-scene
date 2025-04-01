import { expect } from "chai";
import { EmotesCatalogPageRequest, EmotesPageResponse } from '../../scene/src/utils/emotes-promise-utils'
import { ITEMS_CATALOG_PAGE_SIZE } from '../../scene/src/utils/backpack-constants'
import { decoratePageResultWithEmbededEmotes } from '../../scene/src/service/emote-catalog-decoration'


describe.skip("emote-catalog-decoration", () => {
  it("should fill last page with the necessary default emotes to complete the page", ()=>{
    const params ={pageNum:1,
      pageSize:ITEMS_CATALOG_PAGE_SIZE,}
    const responseResult:EmotesPageResponse = {
      ...params,
      elements:new Array(ITEMS_CATALOG_PAGE_SIZE).fill({}),
      totalAmount:ITEMS_CATALOG_PAGE_SIZE + 1
    }
    const decoratedPageResult = decoratePageResultWithEmbededEmotes(params as EmotesCatalogPageRequest, responseResult)

    expect(decoratedPageResult).to.equal(responseResult)
  })

  it("should add an extra page if we left default emotes to fill the last page from original results", ()=>{

  })
})