const database = require("../../database")
const util = require("../functions/functions")
module.exports.notify = async(emote,streamer,event)=>{
   let beginmessage
   switch(event){
      case "added":  beginmessage = `PagMan 👉 NEW EMOTE IN ${streamer} 👉 ${emote} DinkDonk `
      break;
      case "removed": beginmessage = `FeelsBadMan 👉 EMOTE REMOVED IN ${streamer}👉 ${emote} DinkDonk`
   }
    let notifiedUsers = await database.getNotifedUserForStreamerOnEvent(streamer,`EMOTE_${event.toUpperCase()}`)

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
       messageArray.forEach(message=> hb.sendAllowedMessage(channel,message))
    }
}
