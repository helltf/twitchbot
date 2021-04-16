const client = require("../client")
const database = require("../../database");
const util = require("./../functions/functions");
const DEFAULT_COOLDOWN={
  DEFAULT_TITLE_COOLDOWN:60000,
  DEFAULT_GAME_COOLDOWN:5000,
  DEFAULT_LIVE_COOLDOWN:180000
}

module.exports=async(streamer,value,key)=>{

  // Easier displaying of key
    if(key==="game_id")  key="game";

    // Get cooldown from database for the key
    let cooldownfromdb = await database.selectWhere(`${key.toUpperCase()}_COOLDOWN`,"CHANNEL_INFO","CHANNEL_NAME",streamer)
    let cooldown = cooldownfromdb[0][`${key.toUpperCase()}_COOLDOWN`]
    
    if(Date.now()<=cooldown) return;

    let response = await database.custom(`SELECT * FROM NOTIFY JOIN TWITCH_USER ON NOTIFY.TWITCH_ID=TWITCH_USER.TWITCH_ID WHERE STREAMER = '${streamer}' AND ${key.toUpperCase()} = '1'`)

    // no user notified for this streamer
    if(response===undefined) return;

   let notifymap = new Map()
   let beginmessage 

   // Overwrites the game_id with the actual game
   if(key==="game") value = await util.getGame(value)

   // Creates the right begin of the Message
   switch(key){
        case "live": beginmessage = `PagMan 👉  ${streamer} went live DinkDonk `; break;
        case "offline": beginmessage = `FeelsBadMan 👉  ${streamer} went offline DinkDonk `; break;
        default: beginmessage = `PagMan 👉  ${streamer} has changed the ${key} to ${value} DinkDonk `; break;
   }
   // Prepares the channel and the User in a map
   response.forEach((notifyentry) => {
       let channel = notifyentry.CHANNEL
       if(notifymap.has(channel)){
        notifymap.get(channel).push(notifyentry.USERNAME)
      }else{
        notifymap.set(channel,[notifyentry.USERNAME])  
      }
   });

   // Takes every channel of the map and creates the right message including all user for it
   for(let[channel,notifyuser]of notifymap){
       let uservalue = notifyuser.join(" ")
       let result  = beginmessage+uservalue
      client.sendAllowedMessage(channel,result)
   }
   database.updateWhere("CHANNEL_INFO",`${key.toUpperCase()}_COOLDOWN`,Date.now()+DEFAULT_COOLDOWN[`${key.toUpperCase}_COOLDOWN`],"CHANNEL_NAME",streamer)
}