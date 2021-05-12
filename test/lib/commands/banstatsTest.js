const banstats = require("../../../lib/commands/banstats").invocation
const assert = require("chai").assert
describe("commands",()=>{
    it("banstats returns if wrong input",async()=>{
        banstats().then((value)=>{
            assert.isAbove(value.substring(28),0)
        })
    })
})
