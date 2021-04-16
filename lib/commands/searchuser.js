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
        let searchuser = messageparts[0];
        let response = await database.selectWhere("*","TWITCH_USER","USERNAME",searchuser.toLowerCase())
        response = response[0]
        if(response!=undefined)return `The user with the username ${searchuser} is known under the id ${response.TWITCH_ID} and current hexcolor ${response.COLOR}. Registered ${util.shortenTime(Date.now()-response.REGISTER_TIME)} ago.`;
            return `User ${searchuser} couldn't be found in the database!`;
    }
}