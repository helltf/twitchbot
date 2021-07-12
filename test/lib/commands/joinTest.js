const join = require("../../../lib/commands/join").invocation
const assert = require("chai").assert
const database = require("../../../database")
const timer = require("../../../lib/functions/functions").timer
global.hb = {}
hb.client=require('../../../lib/client.js').client
before(async()=>{
    await hb.client.connect()
})
after(async()=>{
    await hb.client.disconnect()
})
describe("Join",()=>{
    it("Client joines a new channel",async()=>{
        let channel = "pepegepaul"
        let message = await join(undefined,undefined,[channel])
        await timer(200)
        let databaseChannels = await database.getConnectedChannels()
        assert.notEqual(hb.client.getChannels().length,0)
        assert.isTrue(databaseChannels.some((entry)=>{ return entry.CHANNEL_NAME===channel}))
        assert.equal(message,`Successfully joined the channel: ${channel}`)
        await hb.client.part(channel)
        await database.custom(`DELETE FROM channels WHERE CHANNEL_NAME='${channel}'`)
    }).timeout(5000)
})

describe("Join",()=>{
    it("Client does not join a new channel if already connected",async()=>{
        let channel = "helltf"
        assert.equal(hb.client.getChannels().length,1)
        let message = await join(undefined,undefined,[channel])
        assert.equal(hb.client.getChannels().length,1)
        assert.equal((await database.getConnectedChannel(channel)).length,1)
        assert.equal(message,"Sorry but I'm already in this channel!")
    }).timeout(5000)
})
describe("Join",()=>{
    it("Client does not join a new channel if already connected",async()=>{
        let channel = "asdadsadsadad"
        assert.equal(hb.client.getChannels().length,1)
        let message = await join(undefined,undefined,[channel])
        assert.equal(hb.client.getChannels().length,1)
        assert.isUndefined(await database.getConnectedChannel(channel))
        assert.isTrue(message.startsWith(`Couldn't join the channel: ${channel} because`))
    }).timeout(5000)
})