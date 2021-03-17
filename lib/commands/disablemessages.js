const database = require('../../database');
/**
 * @author helltf
 */
module.exports={
    description:"Used to disallow messages send by the bot in the current channel!",
    name: "disablemessages",
    required_permissions: 2,
    required_parameters:"none",
    invocation: async(channel,user,message)=>{
        database.updateWhere("CHANNELS","ALLOWED","0","CHANNEL_NAME",channel)
    }
}