const assert = require("chai").assert
const database = require("./../database")

describe("database",()=>{
    it("Query should give back all connected channels not undefined",async()=>{
        console.log(await database.getConnectedChannels())
        assert.notEqual(await database.getConnectedChannels(),undefined)
    })
})
describe("database",()=>{
    it("Get color for a registered user",async()=>{
        assert.equal(await database.getColorForUser(109035947),"#FF69B4")
    })
})
describe("database",()=>{
    it("Query should give back all watchchannels not undefined",async()=>{
        assert.notEqual(await database.getAllWatchChannels(),undefined)
    })
})
describe("database",()=>{
    it("Query should give back all commands not undefined",async()=>{
        assert.notEqual(await database.getCommands(),undefined)
    })
})
