const commandinfo = require("../../../lib/commands/commandinfo").invocation
const assert = require("chai").assert

describe("commandinfo",()=>{
    it("If command is unknown return not found",async()=>{
        let result = await commandinfo("","",["samflksanfklsafn"])
        assert.equal(result,"Couldn't find the given command in my database")
    }).timeout(5000)
})
describe("commandinfo",()=>{
    it("If command is known return command info",async()=>{
        let result = await commandinfo("","",["ping"])
        assert.isTrue(result.startsWith("Given Command:"))
    }).timeout(5000)
})
describe("commandinfo",()=>{
    it("If message is empty return undefined",async()=>{
        let result = await commandinfo("","",[undefined])
        assert.isUndefined(result)
    }).timeout(5000)
})