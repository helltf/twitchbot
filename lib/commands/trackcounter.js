const database = require("../../database")
/**
 * @author helltf
 */
module.exports={
    "name":"trackcounter",
    "description":"Gets the current amount of tracked channels across twitch",
    required_permissions: 1,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: async()=>{
        let response = await database.select("CHANNEL_NAME","WATCHCHANNELS")
        return `This bot is currently tracking ${response.length} channels`;
    }
}
