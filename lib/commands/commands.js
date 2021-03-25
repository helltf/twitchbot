const database = require("../../database")
/**
 * @author helltf
 */
module.exports={
    description:"Gives you a list containing all available commands",
    name: "commands",
    required_parameters:"none",
    required_permissions: 1,
    optional_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        return `Here can you find all the available commands for helltfbot 👉  https://github.com/helltf/twitchbot`
    }
}