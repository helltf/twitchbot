const bansearch = require("../../../lib/commands/bansearch").invocation
const assert = require("chai").assert
describe("commands",()=>{
    it("bansearch returns result if found user provided",async()=>{
        assert.isString(await bansearch("","",["helltf"]))
    }).timeout(5000)
})
describe("commands",()=>{
    it("bansearch returns result if found user provided",async()=>{
        assert.isString(await bansearch("","",["helltf","helltf"]))
    }).timeout(5000)
})
describe("commands",()=>{
    it("bansearch returns if wrong input",async()=>{
        let result = await bansearch("","",[])
        assert.isUndefined(result)
    }).timeout(5000)
})