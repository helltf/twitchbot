
const database = require("../../database")
const notify = require("./emotenotify").notify

module.exports.updateEmotes = async()=>{
    let channels = await database.getEmoteUpdateChannels()
    for await({CHANNELNAME:channelname,FFZ_EMOTES:oldffz,BTTV_EMOTES:oldbttv,"7TV_EMOTES":oldseventv} of channels){
        let [ffz,bttv] = await hb.util.getThirdPartyEmotesDECAPI(channelname)
        checkForUpdate(channelname,{
            old:{
                ffz:JSON.parse(oldffz),
                bttv:JSON.parse(oldbttv),
            },
            new:{
                ffz:ffz,
                bttv:bttv,
            }
        })
    }
}

module.exports.initEmotes = async()=>{
    const channels = await database.getEmoteChannels()
    for await(channel of channels){
        let [ffz,bttv] = await hb.util.getThirdPartyEmotesDECAPI(channel)
        await database.updateEmotes(channel,ffz,bttv)
    }
}

const checkForUpdate = async(channel,emoteInfo)=>{
    for(let[key,newvalue] of Object.entries(emoteInfo.new)){
        let oldvalue = emoteInfo.old[key]
        if(!newvalue||!oldvalue) return
        if(!(JSON.stringify(newvalue)===JSON.stringify(oldvalue))){
             await checkForMissingEmote(newvalue,oldvalue,channel)
             await checkForAddedEmote(newvalue,oldvalue,channel)
        }
    }
}

const checkForAddedEmote = async(newArray,oldArray,channel)=>{
    return await checkForUpdatedEmote(oldArray, newArray, "added")
}

const checkForMissingEmote = async(newArray,oldArray)=>{
    return await checkForUpdatedEmote(newArray,oldArray,"removed")
}

const checkForUpdatedEmote = async (lookupArray,Array,event)=>{
    for(emote of Array){
        if(!lookupArray.includes(emote)){
            notify(emote,channel,event)
            await database.updateLast(emote,channel,event)
        }
    }
}