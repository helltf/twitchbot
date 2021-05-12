const commands = require("../../../lib/commands/commands").invocation
const assert = require("chai").assert

describe("commands",()=>{
    it("Returns the info text with link to commands",async()=>{
        let result = await commands()
        assert.equal(result,`Here can you find all the available commands for helltfbot 👉  https://github.com/helltf/twitchbot`)
    })
})