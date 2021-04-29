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
        if(messageparts[0]) channel=messageparts[0]
        let response = await database.getTimeoutsForChannel(channel.replace(/[^\x00-\x7F]|\n|'/g,"") )
        if(!response){ 
            return`No timeout tracked in channel: ${channel}!`
        }
        return`Last timeout in channel ${channel} was ${util.shortenTime(Date.now()-response[0].TIME)} ago! ${response[0].USERNAME} has been timeouted for ${response[0].DURATION}s!`
    }
}