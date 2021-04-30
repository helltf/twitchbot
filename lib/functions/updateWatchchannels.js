const database=require("../../database")
module.exports=async()=>{
    let channels = await database.getConnectedChannels()
    for await(channel of channels){ 
        let isWatchChannel = await database.isWatchChannel(channel.CHANNEL_NAME)
        if(isWatchChannel) continue;
        database.addNewWatchChannel(channel.CHANNEL_NAME)
    }
}