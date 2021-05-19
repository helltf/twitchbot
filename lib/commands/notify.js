const util = require("../functions/functions")
const database = require("../../database")

/**
 * @author helltf
 */
 module.exports={
    description:"Enables notifications for a given streamern on an certain event. Available events: live/offline/title/game/all",
    name:"notify",
    required_permissions:1,
    required_parameters:"streamer event",
    optional_parameters:"none",
    invocation: 
    async (channel,user,[streamer,event])=>{

        // Wrong input return
        if(!streamer && !event) return

        //Check if event is valid input
        if(event.search(/^live$|^offline$|^title$|^game$|^all$/)===-1) return `Wrong event provided! Available events: live/offline/title/game/all`

        // Sets Value of Default Messages
        let {"user-id":user_id} = user

        let databaseEntryForStreamer = await database.getNotifyEntryForStreamer(user_id,streamer)

        if(databaseEntryForStreamer){
            return updateNotifyEntry(user_id,streamer,event)
       }
       return insertNewNotifyEntry(user_id,streamer,event)
    }
}
const updateNotifyEntry = async(user_id,streamer,event)=>{
            // User is already known for this streamer on some events
            if(event==="all"){

                // Updates all variables to 1 if the event is all
                 database.custom(`UPDATE NOTIFY SET LIVE='1',OFFLINE='1',TITLE='1',GAME='1' WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`)
                 return `Successfully added all notifications for ${streamer} in ` + databaseEntryForStreamer.CHANNEL
            }

            //User is already registered for this event
            if(databaseEntryForStreamer[event.toUpperCase()]===1) return `You're already registered for this event on ${streamer} in ` + databaseEntryForStreamer.CHANNEL+". If you want to get notified in an other channel use the command movenotify";

            //User is not registered. Updates database on the event to 1
            database.updateEventForUser(user_id,streamer,event,1)

            return `Successfully added notifications for ${streamer} on ${event} changes PogChamp`
}

const insertNewNotifyEntry = async(user_id,streamer,event)=>{
    
       if(!(await database.channelInfoGetsUpdated(streamer))){ 
        // Check if API supports the streamer so we can decide if we wont to add him to the database
            if(!(await util.checkAvailableAtTwtichAPI(streamer))) 
                return `Twitch API does not support this streamer :\\`

       // Create new instance of the streamer in the Channel info database for API updates if not existing already
            database.addNewChannelForAPIUpdates(streamer,Date.now())
       }

       if(event==="all"){
            database.addNewNotifyEntryAllEvents()
         return `Successfully added all notifications for ${streamer} in ` + `this channel`
    }
        // Inserts a new record in the database for the user in current channel
       await database.addNewNotifyEntryNoEvents()

       // Sets the value on the given event to 1 
      database.updateEventForUser(user_id,streamer,event,1)
       
       return `Successfully added notifications for ${streamer} on ${event} changes PogChamp`
}