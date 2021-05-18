const database = require('../../database');
/**
 * @author helltf
 */
module.exports={
    description:"Used to disallow messages send by the bot in the current channel!",
    name: "disablemessages",
    required_permissions: 2,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: async(channel)=>{
        await database.setDisabledForChannel(channel)
    }
}