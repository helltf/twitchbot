const channelinfo = require("../../../lib/commands/channelinfo").invocation
const assert = require("chai").assert

describe("commands",()=>{
    it("channelinfo",async()=>{
            channelinfo().then((value)=>{
                assert.isString(value)
            })
    })
})