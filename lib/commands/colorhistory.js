
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
    optional_parameters:"none",
    invocation: 
    async (channel,user)=>{
        let colorresponse = await database.selectWhere("COLOR_HIST,LAST_CHANGE","COLOR_HISTORY","TWITCH_ID",user['user-id']);
        let message = `Your recent colors are `
        if(colorresponse){
          let colorarray = JSON.parse(colorresponse[0].COLOR_HIST)
          let counter = 1
          for(let color of colorarray){
              message+=`${counter}: ${color} `
              counter++;
          }
          return message + `and your latest change was ${util.shortenTime(Date.now()-colorresponse[0].LAST_CHANGE)} ago`;
        }
          return 'First of all you have to register your account for history with hb registercolor';
    }
}