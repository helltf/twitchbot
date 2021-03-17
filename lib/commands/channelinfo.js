const database = require("../../database")
const humanizeDuration = require("humanize-duration");
const util = require("../functions/functions")
/**
 * @author helltf
 */
module.exports={
    name:"channelinfo",
    description:"Retrieves the currents stats about the channel",
    required_permissions:1,
    required_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        channel=channel.replace("'#","")
        let response = await database.selectWhere("*","CHANNELS","CHANNEL_NAME",channel.toUpperCase())
        return `Current information for channel: ${response[0].CHANNEL_NAME}! Times connected: ${response[0].TIMES_CONNECTED}! First time connected: ${util.shortenTime(humanizeDuration(Date.now()-response[0].FIRST_CONNECTED))} ago!`
    }
}