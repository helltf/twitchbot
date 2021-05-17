const database = require("../../database")
const util = require("../functions/functions")

/**
 * @author helltf
 */

module.exports={
    name:"bansearch",
    description:"Searches for the last ban for a certain user",
    required_permissions:1,
    required_parameters:"user",
    optional_parameters:"channel",
    invocation:
    async(channel,user,{username,channelname})=>{
        if(username===undefined) return `Required flag username required. Use the command again with the flag hb bansearch username:<username>`;

        if(channelname!=undefined){
            let response = await database.custom
            (`SELECT * 
            FROM BANNED_USER 
            WHERE USERNAME= '${username}' 
            AND CHANNEL = '${channelname}' 
            ORDER BY TIME DESC`)

            if(response) 
                return`Tracked bans for ${username} in channel ${channelname}: ${response.length}! Last ban was  ${util.shortenTime(Date.now()-response[0].TIME)} ago.`
            return `No ban tracked for user: ${lookupuser} in ${lookupchannel}!`

        }
        let response = await database.custom
            (`SELECT * 
            FROM BANNED_USER 
            WHERE USERNAME= '${username}' 
            ORDER BY TIME DESC`)

        if (response) 
            return `Tracked bans for ${username}: ${response.length}! Last ban was in channel ${response[0].CHANNEL}: ${util.shortenTime(Date.now()-response[0].TIME)} ago!`

        return `No ban tracked for user: ${username}!`;
        }
}