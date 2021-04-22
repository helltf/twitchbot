const database  = require("../../database")

/**
 * @author helltf
 */
 module.exports={
    description:"Disables notifications for a given streamern on an certain event. Right usage: hb notify <streamer> <event>. Available events: live/offline/title/game/all",
    name:"removeme",
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
        const DEFAULTMESSAGE_SUCCESSFUL=`Successfully removed notifications for ${streamer} on ${event} changes FeelsBadMan`
        const DEFAULTMESSAGE_SUCCESSFUL_ALL=`Successfully removed all notifications for ${streamer} `
        const DEFAULTMESSAGE_NOT_SUCCESFUL=`You're not registered for ${event} notifications for ${streamer}. To register for notifications use the command notify!`
        let user_id = user["user-id"]

        let databaseEntryForStreamer = await database.custom(`SELECT * FROM NOTIFY WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`)
        if(databaseEntryForStreamer){

            // User is known for this streamer on some Events
            databaseinfo=databaseEntryForStreamer[0]

            if(event==="all"){

                // Removes the whole record for the user
                database.removeNotifyRecordInDatabase(user_id,streamer)
                return DEFAULTMESSAGE_SUCCESSFUL_ALL
            }
            if(databaseinfo[event.toUpperCase()]===0) return DEFAULTMESSAGE_NOT_SUCCESFUL;

            await database.updateEventForUser(user_id,streamer,event,0)
            checkForRecordNeeded(user_id,streamer)
            return DEFAULTMESSAGE_SUCCESSFUL;
        }
        return DEFAULTMESSAGE_NOT_SUCCESFUL;
    }
}
const checkForRecordNeeded = async(user_id,streamer)=>{
    let notifyEntry = await database.custom(`SELECT * FROM NOTIFY WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`)
    let notifyinfo = notifyEntry[0]
    if(notifyinfo.TITLE===0&&notifyinfo.LIVE===0&&notifyinfo.OFFLINE===0&&notifyinfo.GAME===0) 
    {
        database.removeNotifyRecordInDatabase(user_id,streamer)
    }
}