const database= require("../../database.js");
const util = require("../functions/functions")
/**
 * @author helltf
 */
module.exports= {
    description:"Sets the permissionslevel to the given level for a given user",
    required_parameters:"username permissionlevel",
    name : "setpermissions",
    required_permissions:4,
    optional_parameters:"none",
    invocation: async (channel,user,parts)=>{
        if(parts.length!=2)return;
        var message ="";
        var username = parts[0];
        var permissionlvl = parts[1];
        let response = await database.query(`SELECT * FROM TWITCH_USER WHERE USERNAME = '${username}'`)
        if(response!=undefined){
            util.setPermissions(username,permissionlvl);
            message=`Succesfully set permissions`;
        }
        else{
            message=`Sorry but couldn't find that user in my database`;
        }
        return message;
    }
}