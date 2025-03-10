import { expect } from "chai";
import { getPaginationItems } from '../../scene/src/components/pagination/pagination-util'


describe("pagination", () => {
  describe("getPaginationItems", ()=>{
    it("when currentPage is 1 and pages > 5 , should return all items from 1 to 5", ()=>{
      expect(getPaginationItems({currentPage:1, total:5})).to.deep.equal([1,2,3,4,5]);
    })
    it("when currentPage is 4 and pages 6 , should return all items from 2 to 6", ()=>{
      expect(getPaginationItems({currentPage:4, total:6})).to.deep.equal([2,3,4,5,6]);
    })
    it("when currentPage is 4 and pages > 6 , should return all items from 2 to 6", ()=>{
      expect(getPaginationItems({currentPage:4, total:7})).to.deep.equal([2,3,4,5,6]);
    })
    it("when currentPage is 4 and pages are 4 , should return all items from 1 to 4", ()=>{
      expect(getPaginationItems({currentPage:4, total:4})).to.deep.equal([1,2,3,4]);
    })
  })
})