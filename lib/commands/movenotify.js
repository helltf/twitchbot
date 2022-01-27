const database=require("../../database")

module.exports={
    description:"Moves your notifications to another channel",
    required_parameters:"streamer channel",
    name: "movenotify",
    required_permissions: 0,
    optional_parameters:"none",
    invocation: async(channel, user,[streamer, newChannel])=>{
        if(!streamer && !newChannel) return

        let alreadyKnown = await database.getNotifyEntryForStreamer(user["user-id"], streamer)
        
        if(alreadyKnown){
            let connectedToChannel=await database.getConnectedChannel(newChannel)
            database.updateNotifyChannelForUser(user["user-id"], newChannel, streamer)
            if(connectedToChannel){
                return `Successfully moved your notifications for ${streamer} to ${newChannel}`
            }
            return `Successfully moved your notifications for ${streamer} to ${newChannel}. But be aware that the bot is not connected to the given channel!`
        }
        return `There is no notify connected to your account for ${streamer}. To add a notify for a streamer use the command notify!`
    }
}