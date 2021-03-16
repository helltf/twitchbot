const database = require('../../database');
module.exports={
    description:"Used to disallow messages send by the bot in the current channel!",
    name: "disablemessages",
    required_permissions: 2,
    invocation: async(channel,user,message)=>{
        database.updateWhere("CHANNELS","ALLOWED","0","CHANNEL_NAME",channel)
    }
}