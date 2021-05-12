const disablemessages = require("../../../lib/commands/disablemessages").invocation
const assert = require("chai").assert
const database = require("../../../database")
afterEach(async()=>{
    await database.setEnabledForChannel("helltf")
})
describe("Disable messages",()=>{
    it("Change nothing if already disabled",async()=>{
        await database.setDisabledForChannel("helltf")
        await disablemessages("helltf")
        let {allowed} = await database.getAllowed("helltf")
        assert.isTrue(!allowed)
    }).timeout(5000)
})

describe("Disable messages",()=>{
    it("Disable the messages in channel if enabled",async()=>{
        await database.setEnabledForChannel("helltf")
        await disablemessages("helltf")
        let {allowed} = await database.getAllowed("helltf")
        assert.isTrue(!allowed)
    }).timeout(5000)
})