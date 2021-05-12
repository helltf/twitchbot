const emotegamestats = require("../../../lib/commands/emotegamestats").invocation
const assert = require("chai").assert

describe("emotegamestats",()=>{
    it("if the user has stats return the stats",async()=>{
        let result = await emotegamestats("",{"user-id":109035947})
        assert.isTrue(result.startsWith("Your stats for Emotegame are: Letters guessed:"))
    }).timeout(5000)
})

describe("emotegamestats",()=>{
    it("if the user has no stats return the info text",async()=>{
        let result = await emotegamestats("",{user:{"user-id":234242424}})
        assert.isTrue(result.startsWith(`Sorry but to reveal your stats you have to play a emotegame! Command: "hb emotegame" to play the emotegame!`))
    }).timeout(5000)
})