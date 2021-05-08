const database= require("../../database.js");
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
        var username = parts[0];
        var permissionlvl = parts[1];
        let response = await database.custom(`SELECT * FROM TWITCH_USER WHERE USERNAME = '${username}'`)
        if(response){
            database.setPermissionsForUser(username,permissionlvl);
            return`Succesfully set permissions!`;
        }
           return`Sorry but couldn't find that user in my database`;
    }
}