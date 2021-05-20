const database = require("./../../database")
const {getRegexExp} = require("./../functions/functions")
/**
 * @author helltf
 */
module.exports={
  description:"Deprecated, No longer required!",
    name:"register",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: 
    async(channel,user,[event])=>{
      if(event.search(/^color$|^ping$/)===-1) return
         return await events[event](user)
    }
  }
const events = {
  color: async({"user-id":id,color})=>{
    let entry = await database.selectWhere("TWITCH_ID","COLOR_HISTORY","TWITCH_ID",id);
   
    if(entry)     
      return 'Sorry but you are already registered for color history. To unregister your Account use hb unregistercolor.'

    database.addNewRecordToColorHistory(id,color)
    return 'Succesfully registered you for color history. You can get your recent colors with the command hb colorhistory'
    },

    ping:async({"user-id":id,username})=>{
      if(await database.isRegisteredForPing(id)) 
        return 'Sorry but you are already registered for the ping module'
        let regex = getRegexExp(username)
      database.addUserToPing(id,regex)
      return 'Succesfully added you to the ping module'
    }
}

