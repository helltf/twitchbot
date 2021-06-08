const database = require("../../database");
const util = require("./../functions/functions");
const DEFAULT_COOLDOWN={
  DEFAULT_TITLE_COOLDOWN:60000,
  DEFAULT_GAME_COOLDOWN:5000,
  DEFAULT_LIVE_COOLDOWN:60000*5
}
module.exports=async(streamer,value,event)=>{
    if(event==="game_id")  event="game";

    if(event==="game") value = await util.getGameByID(value)
    if(value===undefined) return;

    if(event==="added"||event==="removed") {
      event = `EMOTE_${event}` 
    }else{
      let cooldown=await database.getNotifyCooldownForEvent(event.toUpperCase(),streamer)
      if (Date.now()<=cooldown) return;
    }

    if (event==="live"&&!value) event ="offline"

    let notifiedUsers = await database.getNotifedUserForStreamerOnEvent(streamer,event.toUpperCase())

    if(!notifiedUsers) return;

   let notifymap = new Map()

   // Prepares the channel and the User in a map
   notifiedUsers.forEach((entry) => {
       let channel = entry.CHANNEL
       if(entry.DISPLAYNAME && !entry.DISPLAYNAME.match(/[^\x00-\x7F]|\n|'/g))
          entry.USERNAME = entry.DISPLAYNAME
          
       if(notifymap.has(channel)){
          return notifymap.get(channel).push(entry.USERNAME)
       } 
        notifymap.set(channel,[entry.USERNAME])  
   });
  
   // Takes every channel of the map and creates the right message including all user for it
   for(let[channel,notifyuser]of notifymap){
       let messageArray=await util.splitUserMessage(notifyuser,event,channel, streamer, value)
       messageArray.forEach(message=> hb.sendAllowedMessage(channel,message))
   }
   if(event==="offline") event = "live"
   if((!event==="EMOTE_added"||!event==="EMOTE_removed"))
   database.updateWhere("CHANNEL_INFO",`${event.toUpperCase()}_COOLDOWN`,Date.now()+DEFAULT_COOLDOWN[`DEFAULT_${event.toUpperCase()}_COOLDOWN`],"CHANNEL_NAME",streamer)
}