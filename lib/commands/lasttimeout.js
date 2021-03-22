const database = require("../../database")
const util = require("../functions/functions")
module.exports={
    name:"lasttimeout",
    description:"Searches for the last timeout occured in the given channel. Only tracks timeouts longer than 300s",
    required_permissions:1,
    required_parameters:"channel",
    invocation:async(channel,user,messageparts)=>{
        if(messageparts[0]===undefined)return;
        let lookupchannel = messageparts[0]
        let response = await database.custom
        (`SELECT * 
        FROM TIMEOUT_USER 
        WHERE CHANNEL= '${lookupchannel}' 
        ORDER BY TIME DESC`)
        if(response!=undefined){
            message = `Last ban in channel ${lookupchannel} was ${util.shortenTime(Date.now()-response[0].TIME)} ago! ${response[0].USERNAME} has been timeouted for ${response[0].DURATION}s!`
        }else{
            message=`No timeout tracked in channel: ${lookupchannel}!`
        }
        return message;
    }
}