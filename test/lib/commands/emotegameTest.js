const emotegame = require("../../../lib/commands/emotegame").invocation
const assert = require("chai").assert
const runningEmoteGames = require("./../../../lib/functions/runningEmoteGames").runningEmoteGames;
describe("emotegame",()=>{
    it("if no emotegame is running start a new one",async()=>{
            await emotegame("helltf")
            assert.equal(runningEmoteGames.length,1)
    }) .timeout(10000)
})
describe("emotegame",()=>{
    it("if emotegame is already running don't start a new one",async()=>{
        await emotegame("helltf")
        let result = await emotegame("helltf")
        assert.equal(result,`There is already a game running in this channel!`)
    })  
})