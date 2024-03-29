"use strict";

const database = require("../../database")
const util = require("../functions/functions")
const notify= require("./notifymessage")
const UPDATE_COOLDOWN=0

module.exports.update =async ()=>{
    let channels = await database.getChannelsRequiredUpdates()
    if (!channels) return
        let promises = []
        for await(let channel of channels){
            let {CHANNEL_NAME:channelname, TITLE:oldtitle, GAME_ID:oldgame_id, LIVE:oldlive} = channel

            database.setUpdateCooldown(channelname, UPDATE_COOLDOWN)
            
            let channelInfo = {channelname, oldtitle, oldgame_id, oldlive}
            promises.push(util.getChannelUpdates(channelInfo))
    }

    if(promises.length!==0)
        Promise.allSettled(promises).then(results => results?.forEach(({value:{info, channelinfo}})=> lookupBroadcaster(info, channelinfo)))
}

const lookupBroadcaster = (info, {channelname:channelName, oldtitle, oldgame_id, oldlive}) => {
    info.forEach(({broadcaster_login, title, game_id, is_live}) => {
        if(broadcaster_login === channelName)
            return checkForUpdates(channelName,{
                    old:{
                        title:oldtitle,
                        game_id:`${oldgame_id}`,
                        live:oldlive==1
                    },
                    new :{
                        title:title,
                        game_id:game_id,
                        live:is_live 
                    }
            })
    })
}

const checkForUpdates=(channelName, {old:oldInfo, new:latestInfo})=>{
    for(let[key, oldvalue] of Object.entries(oldInfo)){
        if( oldvalue==="undefined" || oldvalue===-1 ){
            return database.updateWhere("CHANNEL_INFO", key.toUpperCase(), latestInfo[key],"CHANNEL_NAME", channelName)
        } 

        if( latestInfo[key]!=undefined && oldvalue!=latestInfo[key] ){
            notify(channelName, latestInfo[key], key)
            database.updateChannelInfoValue(key.toUpperCase(), latestInfo[key], channelName)
        }
    }
}



module.exports.init=async()=>{
    let promises = []
    let channels = await hb.queryBuilder
    .select("*")
    .from("CHANNEL_INFO")
    .query()

    if (channels===undefined) return
        for(let {CHANNEL_NAME: channel} of channels){
            hb.queryBuilder
                .update("CHANNEL_INFO")
                .set(["NEXT_UPDATE", Date.now() + UPDATE_COOLDOWN])
                .where("CHANNEL_NAME", channel)
                .query()

            promises.push(util.getChannelUpdates({channelname:channel}))
        }

        if(promises.length!==0){
            let results = await Promise.allSettled(promises)
            for(let {status, value:{channelinfo, info}} of results){
                info?.forEach((streamer)=>{
                    if(streamer.broadcaster_login === channelinfo.channelname){
                        return database.updateChannelInfo(streamer)
                    }
                })
            }
     }
}
