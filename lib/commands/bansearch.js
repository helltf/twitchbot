const database = require("../../database")
const util = require("../functions/functions")
module.exports={
    name:"bansearch",
    description:"Searches for the last ban for a certain user",
    required_permissions:1,
    required_parameters:"user",
    optional_parameters:"channel",
    invocation:async(channel,user,messageparts)=>{
        if(messageparts[0]===undefined)return;
        if(messageparts.length===2){
            let lookupuser = messageparts[0].toLowerCase()
            let lookupchannel= messageparts[1].toLowerCase();
            let response = await database.custom
            (`SELECT * 
            FROM BANNED_USER 
            WHERE USERNAME= '${lookupuser}' 
            AND CHANNEL = '${lookupchannel}' 
            ORDER BY TIME DESC`)
            if(response!=undefined){
                message = `Tracked bans for ${lookupuser} in channel ${lookupchannel}: ${response.length}! Last ban was  ${util.shortenTime(Date.now()-response[0].TIME)} ago.`
            }else{
                message=`No ban tracked for user: ${lookupuser} in ${lookupchannel}!`
            }
            return message;
        }else if(messageparts.length===1){
            let lookupuser = messageparts[0].toLowerCase()
            let response = await database.custom
            (`SELECT * 
            FROM BANNED_USER 
            WHERE USERNAME= '${lookupuser}' 
            ORDER BY TIME DESC`)
            if(response!=undefined){
                message = `Tracked bans for ${lookupuser}: ${response.length}! Last ban was in channel ${response[0].CHANNEL}: ${util.shortenTime(Date.now()-response[0].TIME)} ago!`
            }else{
                message=`No ban tracked for user: ${lookupuser}!`
            }
            return message;
        }
        
    }
}