const database = require("./../../database")
const util = require("./../functions/functions")

module.exports={
    name:"lastping",
    description:"Gets the information about the lastping for an user",
    required_permissions:1,
    required_parameters:"user",
    optional_parameters:"channel",
    invocation:async (channel,user,[lookupuser])=>{
        if(!lookupuser) lookupuser = user.username
        let lastping = await database.getLastPing(lookupuser)
        if(!lastping){
            return `user is not registered for the ping module`
        }
        let {counter,pingchannel,phrase,time,by}=lastping
        return `Last ping was in channel ${pingchannel} ${util.shortenTime(Date.now()-time)} ago by ${by}. Matched phrase: ${phrase} Counted pings: ${counter}`
    }
}