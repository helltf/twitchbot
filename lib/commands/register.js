const database = require("../../database");
/**
 * @author helltf
 */
module.exports={
  description:"Used to register yourself. The bot will save your current color, twitch-id and your current username",
    name:"register",
    required_permissions:1,
    required_parameters:"none",
    invocation: 
    async(channel,user,messageparts)=>{
            let message =""
            let username= user.username
            let user_id = user["user-id"]
            let color = user.color
            let response = await database.selectWhere("USERNAME","TWITCH_USER","USERNAME",username)
            if(response===undefined){
              database.insert("TWITCH_USER","USERNAME, TWITCH_ID, COLOR,PERMISSIONS,REGISTER_TIME",`'${username}', '${user_id}', '${color}','1','${Date.now()}'`)
              message = 'Successfully registered your account'
            }else{
              message = 'Your Account has already been registered'
            }
            return message;
          }
}