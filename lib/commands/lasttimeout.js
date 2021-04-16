const database = require("../../database")
const util = require("../functions/functions")
/**
 * @author helltf
 */
module.exports={
    name:"lasttimeout",
    description:"Searches for the last timeout occured in the given channel. Only tracks timeouts longer than 300s",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"channel",
    invocation:async(channel,user,messageparts)=>{
        let lookupchannel = messageparts[0]
        if(lookupchannel===undefined)lookupchannel=channel;
        let response = await database.custom
        (`SELECT * 
        FROM TIMEOUT_USER 
        WHERE CHANNEL= '${lookupchannel}' 
        ORDER BY TIME DESC`)
        if(response!=undefined){
            return`Last timeout in channel ${lookupchannel} was ${util.shortenTime(Date.now()-response[0].TIME)} ago! ${response[0].USERNAME} has been timeouted for ${response[0].DURATION}s!`
        }
         return`No timeout tracked in channel: ${lookupchannel}!`
    }
}