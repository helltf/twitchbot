const util = require("../functions/functions")
const database = require("../../database")
/**
 * @author helltf
 */
 module.exports={
    description:"Enables notifications for a given streamern on an certain event. Right usage: hb notify <streamer> <event>. Available events: live/offline/title/game/all",
    name:"notify",
    required_permissions:1,
    required_parameters:"streamer event",
    optional_parameters:"none",
    invocation: 
    async (channel,user,messageparts)=>{

        // Wrong input return
        if(messageparts.length!=2) return
        let streamer = messageparts[0]
        let event = messageparts[1]

        //Check if event is valid input
        if(event.search(/^live$|^offline$|^title$|^game$|^all$/)===-1) return `Wrong event provided! Available events: live/offline/title/game/all`

        // Sets Value of Default Messages
        const DEFAULTMESSAGE_SUCCESSFUL=`Successfully added notifications for ${streamer} on ${event} changes PogChamp`
        const DEFAULTMESSAGE_SUCCESSFUL_ALL=`Successfully added all notifications for ${streamer} in `
        const DEFAULTMESSAGE_NOT_SUCCESFUL=`You're already registered for this event on ${streamer} in `
        let user_id = user["user-id"]

        let databaseEntryForStreamer = await database.getNotifyEntryForStreamer(user_id,streamer)

        if(databaseEntryForStreamer){
            // User is already known for this streamer on some events
            if(event==="all"){

                // Updates all variables to 1 if the event is all
                 database.custom(`UPDATE NOTIFY SET LIVE='1',OFFLINE='1',TITLE='1',GAME='1' WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`)
                 return DEFAULTMESSAGE_SUCCESSFUL_ALL + databaseEntryForStreamer.CHANNEL
            }

            //User is already registered for this event
            if(databaseEntryForStreamer[event.toUpperCase()]===1) return DEFAULTMESSAGE_NOT_SUCCESFUL + databaseEntryForStreamer.CHANNEL+". If you want to get notified in an other channel use the command movenotify";

            //User is not registered. Updates database on the event to 1
            database.updateEventForUser(user_id,streamer,event,1)

            return DEFAULTMESSAGE_SUCCESSFUL
       }

       // No User is not notified for this streamer at all
       let liveupdates_info= await database.selectWhere("CHANNEL_NAME","CHANNEL_INFO","CHANNEL_NAME",streamer)


       if(!liveupdates_info){ 
            console.log(await util.checkAvailableAtTwtichAPI(streamer))
        // Check if API supports the streamer so we can decide if we wont to add him to the database
            if(!await util.checkAvailableAtTwtichAPI(streamer)) return `Twitch API does not support this streamer :\\`

       // Create new instance of the streamer in the Channel info database for API updates if not existing already
            database.addNewChannelForAPIUpdates(streamer,Date.now())
       }

       if(event==="all"){

        // Inserts a new record in the database for the user in current channel
         database.insert(`NOTIFY`,
         "TWITCH_ID,CHANNEL,STREAMER,LIVE,OFFLINE,TITLE,GAME",
         `'${user_id}','${channel}','${streamer}','1','1','1','1'`)
         return DEFAULTMESSAGE_SUCCESSFUL_ALL + `this channel`
    }

        // Inserts a new record in the database for the user in current channel
       await database.insert("NOTIFY",`TWITCH_ID,CHANNEL,STREAMER,LIVE,OFFLINE,TITLE,GAME`, `'${user_id}','${channel}','${streamer}','0','0','0','0'`)

       // Sets the value on the given event to 1 
      database.updateEventForUser(user_id,streamer,event,1)
       
       return DEFAULTMESSAGE_SUCCESSFUL
    }
}