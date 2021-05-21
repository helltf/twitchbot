const database = require('../../database')
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
    async(channel,user)=>{
        let user_id=user['user-id']

          let DatabaseEntryForColorhistory = await database.selectWhere("TWITCH_ID","COLOR_HISTORY","TWITCH_ID",user_id);
           
          if(!DatabaseEntryForColorhistory){
              database.addNewRecordToColorHistory(user_id,user.color)
              return 'Succesfully registered you for color history. You can get your recent colors with the command hb colorhistory'
            }
              return 'Sorry but you are already registered for color history. To unregister your Account use hb unregistercolor.';
    }
}