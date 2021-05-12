const lastban = require("../../../lib/commands/lastban").invocation
const assert = require("chai").assert
const database = require("../../../database")

describe("Last ban",()=>{
    it("get no ban for channel if no channel is provided and database is empty",async()=>{
       let channel = "test1234"
        let message = lastban(channel)
        assert.equal(message,`No ban tracked in channel: ${channel}!`)
    })
}).timeout(10000)

describe("Last ban",()=>{
    it("get one ban for channel if no channel is provided",async()=>{
        let channel = "TriHard"
        let username="testuser"
        database.addNewBan(channel,username)
        let message = await lastban(channel)
        assert.isTrue(message.startsWith(`Last ban in channel ${channel} was`))
        database.deleteBan(channel,username)
    }).timeout(10000)
})

describe("Last ban",()=>{
    it("get no ban from provided channel",async()=>{
        let channel = "TriHard"
        database.addNewBan(channel,"testuser")
        let message = await lastban(channel)
        assert.isTrue(message.startsWith(`Last ban in channel ${channel} was`))
    }).timeout(10000)
})