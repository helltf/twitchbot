const client = require("../client")
const database = require("../../database");
const util = require("./../functions/functions");
const DEFAULT_COOLDOWN={
  DEFAULT_TITLE_COOLDOWN:60000,
  DEFAULT_GAME_COOLDOWN:5000,
  DEFAULT_LIVE_COOLDOWN:60000*5
}

module.exports=async(streamer,value,key)=>{
    let beginmessage 

    if(key==="game_id")  key="game";

    if(key==="game") value = await util.getGameByID(value)
    if(value===undefined) return;
   switch(key){
    case "live": 
      if (value) {
        beginmessage = `PagMan 👉  ${streamer} went live DinkDonk `;
        break
      }
        beginmessage = `FeelsBadMan 👉  ${streamer} went offline DinkDonk `; break;
    default: beginmessage = `PagMan 👉  ${streamer} has changed the ${key} to ${value} DinkDonk `; break;
}
    let cooldown=await database.getNotifyCooldownForKey(key.toUpperCase(),streamer)
    if (Date.now()<=cooldown) return;
    if (key==="live"&&!value) key ="offline"

    let notifiedUsers = await database.getNotifedUserForStreamerOnEvent(streamer,key.toUpperCase())

    if(!notifiedUsers) return;

   let notifymap = new Map()

   // Prepares the channel and the User in a map
   notifiedUsers.forEach((entry) => {
       let channel = entry.CHANNEL
       if(notifymap.has(channel)){
          return notifymap.get(channel).push(entry.USERNAME)
       } 
        notifymap.set(channel,[entry.USERNAME])  
   });
  
   // Takes every channel of the map and creates the right message including all user for it
   for(let[channel,notifyuser]of notifymap){
       let messageArray=util.splitUserMessage(notifyuser,beginmessage)
       messageArray.forEach(message=> client.sendAllowedMessage(channel,message))
   }
   if(key==="offline") key = "live"
   database.updateWhere("CHANNEL_INFO",`${key.toUpperCase()}_COOLDOWN`,Date.now()+DEFAULT_COOLDOWN[`DEFAULT_${key.toUpperCase()}_COOLDOWN`],"CHANNEL_NAME",streamer)
}