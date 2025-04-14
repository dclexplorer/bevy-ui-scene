import { expect } from "chai";
import { EmotesCatalogPageRequest, EmotesPageResponse } from '../../scene/src/utils/emotes-promise-utils'
import {
  DEFAULT_EMOTE_ELEMENTS,
  DEFAULT_EMOTES,
  ITEMS_CATALOG_PAGE_SIZE
} from '../../scene/src/utils/backpack-constants'
import { decoratePageResultWithEmbededEmotes } from '../../scene/src/service/emote-catalog-decoration'

describe("emote-catalog-decoration", () => {
  it("should incrememt totalAmount with DEFAULT_EMOTES length", ()=>{
    const params ={
      pageNum:1,
      pageSize:ITEMS_CATALOG_PAGE_SIZE
    }
    const totalAmount = ITEMS_CATALOG_PAGE_SIZE + 1
    const responseResult:EmotesPageResponse = {
      ...params,
      elements:new Array(ITEMS_CATALOG_PAGE_SIZE).fill({}),
      totalAmount
    }
    const decoratedPageResult = decoratePageResultWithEmbededEmotes(params as EmotesCatalogPageRequest, responseResult)

    expect(decoratedPageResult.totalAmount).to.equal(totalAmount + DEFAULT_EMOTES.length)
  })

  it("should append DEFAULT_EMOTES to fill last page from original results", ()=>{
    const params ={
      pageNum:2,
      pageSize:ITEMS_CATALOG_PAGE_SIZE
    }
    const totalAmount = ITEMS_CATALOG_PAGE_SIZE + 1
    const responseResult:EmotesPageResponse = {
      ...params,
      elements:[{} as any],
      totalAmount
    }
    const decoratedPageResult = decoratePageResultWithEmbededEmotes(params as EmotesCatalogPageRequest, responseResult)
    const expectedPage = [{}, ...DEFAULT_EMOTE_ELEMENTS]
    expect(decoratedPageResult.elements).to.deep.equal(expectedPage)
  })

  it("should append the necessary DEFAULT_EMOTES to fill last page from original results", ()=>{
    const params ={
      pageNum:2,
      pageSize:ITEMS_CATALOG_PAGE_SIZE
    }
    const totalAmount = ITEMS_CATALOG_PAGE_SIZE*2-1
    const responseResult:EmotesPageResponse = {
      ...params,
      elements:new Array(15).fill({}),
      totalAmount
    }
    const decoratedPageResult = decoratePageResultWithEmbededEmotes(params as EmotesCatalogPageRequest, responseResult)
    const expectedPage = [
      ...new Array(ITEMS_CATALOG_PAGE_SIZE-1).fill({}),
      DEFAULT_EMOTE_ELEMENTS[0]
    ]
    expect(decoratedPageResult.elements[15]).to.deep.equal(DEFAULT_EMOTE_ELEMENTS[0])
    expect(decoratedPageResult.elements.length).to.eq(16)
  })

  it("should append DEFAULT_EMOTES but handling name filter", ()=>{
    const params ={
      pageNum:2,
      pageSize:ITEMS_CATALOG_PAGE_SIZE,
      searchFilter:{
        name:"Head"
      }
    }
    const totalAmount = ITEMS_CATALOG_PAGE_SIZE*2-1
    const responseResult:EmotesPageResponse = {
      ...params,
      elements:new Array(15).fill({}),
      totalAmount
    }
    const decoratedPageResult = decoratePageResultWithEmbededEmotes(params as EmotesCatalogPageRequest, responseResult)

    expect(decoratedPageResult.totalAmount).to.equal(totalAmount + 1)
    expect(decoratedPageResult.elements[15]).to.deep.equal(DEFAULT_EMOTE_ELEMENTS[8])
    expect(decoratedPageResult.elements.length).to.eq(16)
  })
})