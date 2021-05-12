const colorhistory = require("../../../lib/commands/colorhistory").invocation
const assert = require("chai").assert

describe("commands",()=>{
    it("colorhistory returns info message if the user is not known",async()=>{
        colorhistory("",{user:{"user-id":3728947324932}}).then(value=>{
            assert.equal(value, 'First of all you have to register your account for history with hb registercolor')
        })
    })
})

describe("commands",()=>{
    it("colorhistory returns colorhistory if user known",async()=>{
        colorhistory("",{user:{"user-id":109035947}}).then(value=>{
            assert.isTrue(value.startsWith("Your recent colors are"))
        })
    })
})