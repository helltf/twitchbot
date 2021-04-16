const database = require('../../database')
const client = require("../watchclient")
/**
 * @author helltf
 */
module.exports={
  description:"Used to register yourself for colorhistory. The bot will save your 10 latest colors and the time of your last change",
    name:"registercolor",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"none",
    invocation:
    async(channel,user,messageparts)=>{
        let username = user.username
        let user_id=user['user-id']
          let coloresponse = await database.selectWhere("TWITCH_ID","COLOR_HISTORY","TWITCH_ID",user_id);
            if(coloresponse===undefined){
              database.insert("COLOR_HISTORY","TWITCH_ID,COLOR_HIST,REGISTER_TIME,LAST_CHANGE",`'${user_id}','${user.color}','${Date.now()}','${Date.now()}'`)
              client.RegisteredUser.push(username)
              return'Succesfully registered you for color history'
            }
              return 'Sorry but you are already registered for color history';
    }
}