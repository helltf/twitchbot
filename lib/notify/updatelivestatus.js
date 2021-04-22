const database = require("../../database")
const AT = require("../functions/ATHandler").AT
const util = require("../functions/functions")
const notify= require("./notifymessage")
const UPDATE_COOLDOWN=10000

module.exports.update =async ()=>{
    let channels = await database.custom(`
    SELECT * 
    FROM CHANNEL_INFO 
    WHERE NEXT_UPDATE 
    <= ${Date.now()}`)
    if (channels===undefined) return
        for await(channel of channels){
            let channelname=channel.CHANNEL_NAME
            let oldtitle = channel.TITLE
            let oldgame_id=channel.GAME_ID
            let oldlive= channel.LIVE
            //database.updateWhere("CHANNEL_INFO","NEXT_UPDATE",Date.now()+UPDATE_COOLDOWN,"CHANNEL_NAME",channelname)
            database.custom(`UPDATE CHANNEL_INFO SET NEXT_UPDATE ='${Date.now()+UPDATE_COOLDOWN}' WHERE CHANNEL_NAME = '${channelname}'`)
            const options = {
                url: "https://api.twitch.tv/helix/search/channels?query="+channelname,
                method:'GET',
                headers:{
                    'Client-ID':process.env.CLIENT_ID,
                    'Authorization': 'Bearer ' + AT.access_token
                }
            }
            await util.request(options).then((response)=>{
                console.log("request")
                let data = response.data
                data.forEach((streamer) => {
                    if(streamer.broadcaster_login===channelname){
                        checkForUpdates(channelname, oldtitle, streamer.title,"title")
                        checkForUpdates(channelname, oldgame_id, streamer.game_id,"game_id")
                        checkForUpdates(channelname, oldlive, streamer.is_live,"live")
                        return;
                    }
            })
        }).catch((err)=>{
                console.log(err)
            })
        }
}
module.exports.init=async()=>{

    // Gets all channels for API updates
    let channels = await database.custom(`
    SELECT * 
    FROM CHANNEL_INFO`)

    if (channels===undefined) return

        for(channel of channels){
            let channelname=channel.CHANNEL_NAME
            // await database.updateWhere("CHANNEL_INFO","NEXT_UPDATE",Date.now()+UPDATE_COOLDOWN,"CHANNEL_NAME",channelname)
            database.custom(`UPDATE CHANNEL_INFO SET NEXT_UPDATE ='${Date.now()+UPDATE_COOLDOWN}' WHERE CHANNEL_NAME = '${channelname}'`)

            // Options for the API request. 
            const options = {
                url: "https://api.twitch.tv/helix/search/channels?query="+channelname,
                method:'GET',
                headers:{
                    'Client-ID':process.env.CLIENT_ID,
                    'Authorization': 'Bearer ' + AT.access_token
                }
            }
            // waits for the response of the API
            let response = await util.request(options).catch((err)=>{
                console.log(err)
            })
            data=response.data
            if(data===undefined) return
            data.forEach(async(streamer)=>{

                //Gets the exact streamer from the Array provided by the API
                if(streamer.broadcaster_login===channelname){

                    //Updates the data in the database
                    await database.custom(`UPDATE CHANNEL_INFO SET LIVE='${streamer.is_live}',TITLE='${streamer.title.replace(/[^\x00-\x7F]|\n/g,"") }',GAME_ID='${streamer.game_id}', LIVE_COOLDOWN='${Date.now()}',TITLE_COOLDOWN='${Date.now()}',GAME_COOLDOWN='${Date.now()}' WHERE CHANNEL_NAME='${channelname}'`)
                }
            })
        }
}
/**
 * Compares the old and the new value for a channel. Notifies if values are different
 * @param {*} channelname 
 * @param {*} oldvalue 
 * @param {*} newvalue 
 * @param {*} key 
 */
const checkForUpdates=(channelname,oldvalue,newvalue,key)=>{
    checkvalue=newvalue

    // Removes non Ascii characters, to save the string in database and removes new lines for better checking
    if(key==="title") checkvalue=newvalue.replace(/[^\x00-\x7F]|\n/g,"") 

    // Value is undefined in the database and will be overwritten with the real value
    if(oldvalue==="undefined"||oldvalue===-1) database.updateWhere("CHANNEL_INFO",key.toUpperCase(),checkvalue,"CHANNEL_NAME",channelname)

    // Converts string "true" or "false" to boolean so next condition can check
    if(key==='live') oldvalue = (oldvalue=='true') 

    // Old and new Value are not undefined and the value has changed => notify all users
    if(oldvalue!="undefined"&&oldvalue!=-1&&checkvalue!=undefined&&oldvalue!=checkvalue){

        // notify users
        notify(channelname,newvalue,key)

        // Update the value in the database
        database.updateWhere("CHANNEL_INFO",key.toUpperCase(),checkvalue,"CHANNEL_NAME",channelname)
    }
    if((!oldvalue==="undefined")&&(!newvalue)){
        console.log(channelname)
        if(key==='live') {
        newvalue="false"
        database.updateWhere("CHANNEL_INFO",key.toUpperCase(),checkvalue,"CHANNEL_NAME",channelname)
        }
    }
}
