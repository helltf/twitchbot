const database = require("../../database")
const util = require("../functions/functions")
module.exports={
    name:"lastban",
    description:"Searches for the last ban occured in the given channel",
    required_permissions:1,
    required_parameters:"channel",
    invocation:async(channel,user,messageparts)=>{
        if(messageparts[0]===undefined)return;
        let lookupchannel = messageparts[0]
        let response = await database.custom
        (`SELECT * 
        FROM BANNED_USER 
        WHERE CHANNEL= '${lookupchannel}' 
        ORDER BY TIME DESC`)
        if(response!=undefined){
            message = `Last ban in channel ${lookupchannel} was ${util.shortenTime(Date.now()-response[0].TIME)} ago! ${response[0].USERNAME} got permanently banned MODS`
        }else{
            message=`No ban tracked in channel: ${lookupchannel}!`
        }
        return message;
    }
}