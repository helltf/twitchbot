const database = require('../../database');
/**
 * @author helltf
 */
module.exports={
    description:"Used to allow messages send by the bot in the current channel!",
    name: "allowmessages",
    required_permissions: 2,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: async(channel,user,message)=>{
        database.updateWhere("CHANNELS","ALLOWED","1","CHANNEL_NAME",channel)
    }
}