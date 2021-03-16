const database = require("../../database");
module.exports={
  description:"Used to register yourself. The bot will save your current color, twitch-id and your current username",
    name:"register",
    required_permissions:1,
    invocation: 
        /**
     * 
     * @param {String} Name of the channel
     * @param {userstate} user userstate of the user who used the command
     * @param {Array} messageparts Array containing the information for execution
     * @returns message Message which will be send in the channel
     */
    async(channel,user,messageparts)=>{
            let message =""
            let username= user.username
            let user_id = user["user-id"]
            let color = user.color
            let response = await database.query(`SELECT USERNAME FROM TWITCH_USER WHERE USERNAME = '${username}'`)
            if(response===undefined){
              database.insert("TWITCH_USER","USERNAME, TWITCH_ID, COLOR,PERMISSIONS,REGISTER_TIME",`'${username}', '${user_id}', '${color}','1','${Date.now()}'`)
              message = 'Successfully registered your account'
            }else{
              message = 'Your Account has already been registered'
            }
            return message;
          }
}