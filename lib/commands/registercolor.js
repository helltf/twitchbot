const database = require('../../database')
const client = require("../watchclient")
module.exports={
  description:"Used to register yourself for colorhistory. The bot will save your 10 latest colors and the time of your last change",
    name:"registercolor",
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
        let username = user.username
        let user_id=user['user-id']
        let message ="";
        let userresponse = await database.query(`SELECT USERNAME,TWITCH_ID FROM TWITCH_USER WHERE USERNAME = '${username}'`)
        if(userresponse===undefined){
          message = 'Sorry but your Account is not normally registered. Just write register to register your account'
        }else{
          let coloresponse = await database.query(`SELECT TWITCH_ID FROM COLOR_HISTORY WHERE TWITCH_ID ='${user_id}'`);
            if(coloresponse===undefined){
              database.insert("COLOR_HISTORY","TWITCH_ID,COLOR_HIST,REGISTER_TIME,LAST_CHANGE",`'${user_id}','${user.color}','${Date.now()}','${Date.now()}'`)
              client.RegisteredUser.push(username)
              message='Succesfully registered you for color history'
            }
            else{
              message ='Sorry but you are already registered for color history';
            }
        }
        return message;
    }
}