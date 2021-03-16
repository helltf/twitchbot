const database = require('../../database');
module.exports={
    description:"Used to allow messages send by the bot in the current channel!",
    name: "allowmessages",
    required_permissions: 2,
    invocation: async(channel,user,message)=>{
        database.updateWhere("CHANNELS","ALLOWED","1","CHANNEL_NAME",channel)
    }
}