const database = require("../../database");
module.exports={
    description:"Search for a certain user in the database",
    required_parameters:"username",
    name:"searchuser",
    required_permissions:4,
    invocation: 
        /**
     * 
     * @param {String} Name of the channel
     * @param {userstate} user userstate of the user who used the command
     * @param {Array} messageparts Array containing the information for execution
     * @returns message Message which will be send in the channel
     */
    async(channel,user,messageparts)=>{
        let searchuser = messageparts[0];
        let message = "";
        let response = await database.query(`SELECT * FROM TWITCH_USER WHERE USERNAME = '${searchuser.toLowerCase()}'`)
        if(response!=undefined){
            message=`The user with the username ${searchuser} is known under the id ${response[0].TWITCH_ID} and current hexcolor ${response[0].COLOR}`
        }else{
            message=`User ${messageparts[0]} couldn't be found in the database!`;
        }
            return message;
    }
}