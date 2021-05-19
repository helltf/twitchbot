const botinfo = require("../../../lib/commands/botinfo").invocation
const assert = require("chai").assert
describe("commands",()=>{
    it("botinfo returns botinfo",async()=>{
            let string = `This bot keeps track of your colorchanges in certain channels! If you want to use it register for colorchanges with "hb registercolor". Bot created by helltf. Git repository 👉 https://github.com/helltf/twitchbot/`
            assert.equal(await botinfo() ,string)
     } )
    })