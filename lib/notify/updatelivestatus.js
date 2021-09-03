const database = require("../../database")
const AT = require("../functions/ATHandler").AT
const util = require("../functions/functions")
const notify= require("./notifymessage")
const UPDATE_COOLDOWN=10000

module.exports.update =async ()=>{
    let channels = await database.custom(`
    SELECT * 
    FROM CHANNEL_INFO
    WHERE NEXT_UPDATE < ${Date.now()}`)
    if (!channels) return
        for await(channel of channels){
            let {CHANNEL_NAME:channelname,TITLE:oldtitle, GAME_ID:oldgame_id,LIVE:oldlive} = channel
           database.setUpdateCooldown(channelname,UPDATE_COOLDOWN)
            const options = {
                url: "https://api.twitch.tv/helix/search/channels?query="+channelname,
                method:'GET',
                headers:{
                    'Client-ID':process.env.CLIENT_ID,
                    'Authorization': 'Bearer ' + AT.access_token
                }
            }
            util.request(options).then((response)=>{
                let data = response.data
                data.forEach((streamer) => {
                    if(streamer.broadcaster_login===channelname){
                        checkForUpdates(channelname,{
                                old:{
                                    title:oldtitle,
                                    game_id:`${oldgame_id}`,
                                    live:oldlive==1
                                },
                                new :{
                                    title:streamer.title,
                                    game_id:streamer.game_id,
                                    live:streamer.is_live 
                                }
                        })
                        return;
                    }
            })
        }).catch((err)=>{console.log(err)})
    }
}
module.exports.init=async()=>{

    let channels = await database.custom(`
    SELECT * 
    FROM CHANNEL_INFO`)

    if (channels===undefined) return

        for(channel of channels){
            let channelname=channel.CHANNEL_NAME
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
            let response = await util.request(options).catch((err)=>{console.log(err)})
            data=response.data
            if(!data) return
            data.forEach(async(streamer)=>{

                //Gets the exact streamer from the Array provided by the API
                if(streamer.broadcaster_login===channelname){
                    return await database.updateChannelInfo(streamer)
                }
            })
        }
}

const checkForUpdates=(channelname,channelinfo)=>{
    for(let[key,oldvalue]of Object.entries(channelinfo.old)){
        if(oldvalue==="undefined"||oldvalue===-1){
            return database.updateWhere("CHANNEL_INFO",key.toUpperCase(),channelinfo.new[key],"CHANNEL_NAME",channelname)
        } 
        if(channelinfo.new[key]!=undefined&&oldvalue!=channelinfo.new[key]){
            notify(channelname,channelinfo.new[key],key)
            database.updateChannelInfoValue(key.toUpperCase(),channelinfo.new[key],channelname)
        }
    }
}
