const database = require("../../database");
const util = require("../functions/functions")
/**
 * @author helltf
 */
module.exports={
    description:"Search for a certain user in the database",
    required_parameters:"username",
    name:"searchuser",
    required_permissions:4,
    optional_parameters:"none",
    invocation: 
    async(channel,user,messageparts)=>{
        if(messageparts.length!=1) return
        let searchuser = messageparts[0];
        let response = await database.getUserInfo(searchuser)
        if(response)return `The user with the username ${searchuser} is known under the id ${response.twitch_id} and current hexcolor ${response.color}. Registered ${util.shortenTime(Date.now()-response.register_time)} ago.`;
            return `User ${searchuser} couldn't be found in the database!`;
    }
}