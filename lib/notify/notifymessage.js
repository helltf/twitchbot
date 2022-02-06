const database = require("../../database");
const util = require("./../functions/functions");

const DEFAULT_COOLDOWN={
  DEFAULT_TITLE_COOLDOWN:60000,
  DEFAULT_GAME_COOLDOWN:5000,
  DEFAULT_LIVE_COOLDOWN:60000*5
}

module.exports = async(streamer, value, event)=>{
    if(event==="game_id") {
      event="game"
      value = await util.getGameByID(value)
    }

    if(value===undefined) return;

    if(event==="added"||event==="removed") {
      event = `EMOTE_${event}` 
    }else{
      if (Date.now() <= await database.getNotifyCooldownForEvent(event.toUpperCase(), streamer)) return;
    }

    if (event==="live" && !value) event ="offline"

    let databaseNotifiedUsers = await database.getNotifedUserForStreamerOnEvent(streamer, event.toUpperCase())

    if(!databaseNotifiedUsers) return;

  let notifymap = prepareNotifiedUserMap(databaseNotifiedUsers)

   // Takes every channel of the map and creates the right message including all user for it
   for(let[channel, notifyuser]of notifymap){
       let messageArray=await util.splitUserMessage(notifyuser, event, channel, streamer, value)
        messageArray.forEach( message=> hb.sendAllowedMessage(channel, message))
   }

   if(event==="offline") {
      event = "live"
  }

   if((!event==="EMOTE_added" || !event==="EMOTE_removed"))
      database.updateWhere("CHANNEL_INFO",`${event.toUpperCase()}_COOLDOWN`, Date.now()+DEFAULT_COOLDOWN[`DEFAULT_${event.toUpperCase()}_COOLDOWN`],"CHANNEL_NAME", streamer)
}

const prepareNotifiedUserMap = (notifiedUsers)=>{
  let notifymap = new Map()

  notifiedUsers.forEach(({CHANNEL:channel, DISPLAYNAME, USERNAME, ADDITIONAL_INFO:flags}) => {
    if(DISPLAYNAME && DISPLAYNAME.toLowerCase() === USERNAME)
       USERNAME = DISPLAYNAME
       
    if(notifymap.has(channel)){
       return notifymap.get(channel).push({USERNAME, flags})
    } 

     notifymap.set(channel, [{USERNAME, flags}])  
});
  return notifymap
}