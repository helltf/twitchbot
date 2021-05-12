const functions =require("../../../lib/functions/functions")
const assert = require("chai").assert
const updateAT = require("../../../lib/functions/ATHandler").updateAT
const database = require("../../../database")
const adminuseruser={
    "user-id":109035947,
    badges:{
        broadcaster:1
    }
}
const moduser={
    "user-id":182285668,
    badges:undefined
}

before(async()=>{
    await updateAT()
})

describe("Check Streamer on API",()=>{
    it("Streamer not available at twitch api should return false",async()=>{
        let result = await functions.checkAvailableAtTwtichAPI("asdadadba")
        assert.isFalse(result)
    }).timeout(5000)
})
describe("Check Streamer on API",()=>{
    it("Streamer is available at twitch api should return true",async()=>{
        let result = await functions.checkAvailableAtTwtichAPI("helltf")
        assert.isTrue(result)
    }).timeout(5000)
})
describe("Get Game",()=>{
    it("Return right game for game id",async()=>{
        let result = await functions.getGameByID(509658)
        assert.equal(result,"Just Chatting")
    }).timeout(5000)
})
describe("Get Game",()=>{
    it("Return right game for game id",async()=>{
        let result = await functions.getGameByID(4242424242424242)
        assert.isUndefined(result)

    }).timeout(5000)
})
describe("Get Emotes",()=>{
    it("Exsisting Channel returns BTTV and FFZ Emotes",async()=>{
       let result = await functions.getThirdPartyEmotes("helltf")
       assert.isArray(result)
    }).timeout(5000)
})
describe("Get Emotes",()=>{
    it("non-exsisting Channel resolves undefined",async()=>{
        let result = await functions.getThirdPartyEmotes("saadasdadbafgbs")
        assert.isUndefined(result)
    }).timeout(5000)
})
describe("shorten Time",()=>{
    it("unix timestamp return shortened",()=>{
        assert.doesNotThrow(()=>{
            functions.shortenTime(1615286707554)
        })
    })
})
describe("shorten Time",()=>{
    it("unix timestamp return shortened",()=>{
        assert.doesNotThrow(()=>{functions.shortenTime(-15353)})
    })
})
describe("get Permissions",()=>{
    it("Normal user should have Level 1 permissions",async()=>{
        let unknownuser={
                "user-id":427842,
                badges:undefined
    }
    let result = await functions.getPermissions(unknownuser)
    assert.equal(result,1)
    }).timeout(5000)
})
describe("get Permissions",()=>{
    it("Banned user  has Level 0 permissions",async()=>{
        let bannedtestuser={
                "user-id":180611958,
                badges:undefined
    }
    let result = await functions.getPermissions(bannedtestuser)
    assert.equal(result,0)
    }).timeout(5000)
})
describe("get Permissions",()=>{
    it("Unknown broadcaster has Level 2 permissions",async()=>{
        let unknownbroadcaster={
            "user-id":78429742789,
            badges:{
                broadcaster:1
            }
        }
    let result = await functions.getPermissions(unknownbroadcaster)
    assert.equal(result,2)
    }).timeout(5000)
})
describe("get Permissions",()=>{
    it("Known broadcaster with lvl 1 permissions in database has Level 2 permissions",async()=>{
        const broadcasteruser={
            "user-id":182285668,
            badges:{
                broadcaster:1
            }
        }
    let result = await functions.getPermissions(broadcasteruser)
    assert.equal(result,2)
    }).timeout(5000)
})
describe("get Permissions",()=>{
    it("Known broadcaster with lvl 4 permissions in database has Level 4 permissions",async()=>{
    let result = await functions.getPermissions(adminuseruser)
    assert.equal(result,4)
    }).timeout(5000)
})
describe("get Permissions",()=>{
    it("Mod user  has Level 3 permissions",async()=>{
        let moduser={
                "user-id":230853735,
                badges:undefined
    }
    let result = await functions.getPermissions(moduser)
    assert.equal(result,3)
    }).timeout(5000)
})
describe("get Permissions",()=>{
    it("Admin user  has Level 4 permissions",async()=>{
        let moduser={
                "user-id":109035947,
                badges:undefined
    }
    let result = await functions.getPermissions(moduser)
    assert.equal(result,4)
    }).timeout(5000)
})
describe("split user message",()=>{
    it("empty array returns only beginmessage",()=>{
        let beginmessage="PagMan"
        let result = functions.splitUserMessage([],beginmessage)
        assert.equal(result,beginmessage)
    })
})
describe("split user message",()=>{
    it("one user in array returns only beginmessage plus user",()=>{
        let beginmessage="PagMan"
        let result = functions.splitUserMessage(["helltf"],beginmessage)
        assert.equal(result[0],beginmessage+" helltf")
    })
})
describe("split user message",()=>{
    it("many user exceed limit of 500 characters return array of two elements",()=>{
        let beginmessage="PagMan"
        let result = functions.splitUserMessage(["testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123","testuser123"],beginmessage)
        assert.equal(result.length,2)
    })
})
describe("Register user",()=>{
    it("Non registered User will be registered in the database",async()=>{
        let user ={
            username:"testuser",
            "user-id":1111111111,
            color:"#CC39DE "
        }
        await functions.registerUser(user)
        let result = await database.getUserInfo(user.username)
        assert.notEqual(result,undefined)
        assert.equal(result.username,user.username)
        assert.equal(result.twitch_id,user["user-id"])
        assert.equal(result.color,user.color)
        database.deleteUser(user["user-id"])
    }).timeout(5000)
})
describe("Register user",()=>{
    it("Already registered User will not be registered in the database",async()=>{
        let user ={
            username:"helltf",
            "user-id":109035947,
            color:"#FF69B4 "
        }
        await functions.registerUser(user)
        let result = await database.getUserInfo(user.username)
        assert.notEqual(result,undefined)
    }).timeout(5000)
})