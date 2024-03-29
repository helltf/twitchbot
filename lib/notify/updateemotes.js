
const database = require("../../database")
const notify = require("./notifymessage")

module.exports.updateEmotes = async()=>{
    let channels = await database.getEmoteUpdateChannels()
    for await(channel of channels){
        let {FFZ_EMOTES:oldffz, BTTV_EMOTES:oldbttv, CHANNELNAME:channelname} = channel
         hb.util.getThirdPartyEmotesDECAPI(channelname).then((emotes)=>{
            let [ffz, bttv] = emotes
             checkForUpdate(channelname,{
                old:{
                    ffz:JSON.parse(oldffz),
                    bttv:JSON.parse(oldbttv)
                },
                new:{
                    ffz,
                    bttv
                }
            })
        })
    }
}

module.exports.initEmotes = async()=>{
    const channels = await database.getEmoteChannels()
    for await(channel of channels){
        let [ffz, bttv] = await hb.util.getThirdPartyEmotesDECAPI(channel)
        await database.updateEmotes(channel, ffz, bttv)
    }
}

const checkForUpdate = async(channel,{"new": newEmotes, old:oldEmotes})=>{
    for await(let[key, newvalue] of Object.entries(newEmotes)){
        let oldvalue = oldEmotes[key]
        if(!newvalue||!oldvalue) return
        if(!(JSON.stringify(newvalue)===JSON.stringify(oldvalue))){

            let info = {
                channel,
                newvalue,
                oldvalue
            }
             if(await checkForMissingEmote(info) || await checkForAddedEmote(info))
                await database.updateEmotes(channel, newEmotes.ffz, newEmotes.bttv)
        }
    }
}

const checkForAddedEmote = async({newvalue:Array, oldvalue:lookupArray, channel})=>{
    return await checkForUpdatedEmote(lookupArray, Array, channel, "added")
}

const checkForMissingEmote = async({newvalue:lookupArray, oldvalue:Array, channel})=>{
    return await checkForUpdatedEmote(lookupArray, Array, channel, "removed")
}

const checkForUpdatedEmote = async (lookupArray, Array, channel, event)=>{
    for await(emote of Array){
        if(!lookupArray.includes(emote)){
            await notify(channel, emote, event)
            await database.updateLast(emote, channel, event)
            return true
        }
    }
    return false
}