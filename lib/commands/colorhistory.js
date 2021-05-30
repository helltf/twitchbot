
const database = require('../../database.js');
const humanizeDuration = require("humanize-duration");
const util = require("../functions/functions")
/**
 * @author helltf
 */
module.exports= {
    name : "colorhistory",
    description:"The bot will send a message containing your 10 latest colorchanges and the time between your latest change and now!",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"username",
    invocation: 
    async (channel,{username},[lookupuser])=>{
      if(!lookupuser)  lookupuser = username
        let colorresponse = await database.getColorHistoryForUser(lookupuser)
        let message = `${lookupuser} recent colors are `

        if(!colorresponse && username===lookupuser) return 'You are not registered for colorhistory. Use register command to register your account'
        if(!colorresponse) return 'This user is not registered for colorhistory'

          let colorarray = JSON.parse(colorresponse[0].COLOR_HIST)
          let counter = 1
          for(let color of colorarray){
              message+=`${counter}: ${color} `
              counter++;
          }
          return message + `and the latest change was ${util.shortenTime(Date.now()-colorresponse[0].LAST_CHANGE)} ago`;
    }
}