const database = require("../../database")
const util = require("../functions/functions")
/**
 * @author helltf
 */
module.exports={
    name:"lastban",
    description:"Searches for the last ban occured in the given channel",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"channel",
    invocation:async(channel,user,[channelname])=>{
        if(channelname) channel = channelname

        let response = await database.getBansForChannel(channel.replace(/[^\x00-\x7F]|\n|'/g,"") )

        if(!response){ 
            return `No ban tracked in channel: ${channel}!`
        }
        
        return `Last ban in channel ${channel} was ${util.shortenTime(Date.now()-response[0].TIME)} ago! ${response[0].USERNAME} got permanently banned MODS`
    }
}