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
    async(channel,user,[lookupuser,lookupchannel])=>{
        if(!lookupuser) return 
        lookupuser =lookupuser.toLowerCase()

        if(lookupchannel){
            
             lookupchannel= lookupchannel.toLowerCase();

            if(!database.isWatchChannel(lookupchannel)) return `Channel does not get tracked. You can add channels with command track`

            let response = await database.custom
            (`SELECT * 
            FROM BANNED_USER 
            WHERE USERNAME= '${lookupuser}' 
            AND CHANNEL = '${lookupchannel}' 
            ORDER BY TIME DESC`)

            if(response) 
                return`Tracked bans for ${lookupuser} in channel ${lookupchannel}: ${response.length}! Last ban was  ${util.shortenTime(Date.now()-response[0].TIME)} ago.`
            
            return `No ban tracked for user: ${lookupuser} in ${lookupchannel}!`
        }
            let response = await database.custom
            (`SELECT * 
            FROM BANNED_USER 
            WHERE USERNAME= '${lookupuser}' 
            ORDER BY TIME DESC`)

            if (response) {
            let [{CHANNEL,TIME}] = response
                return `Tracked bans for ${lookupuser}: ${response.length}! Last ban was in channel ${CHANNEL}: ${util.shortenTime(Date.now()-TIME)} ago!`
            }
            return `No ban tracked for user: ${lookupuser}!`;
    }
}