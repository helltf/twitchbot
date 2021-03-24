
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
    async (channel,user,messageparts)=>{
        let colorresponse = await database.selectWhere("COLOR_HIST,LAST_CHANGE","COLOR_HISTORY","TWITCH_ID",user['user-id']);
        if(colorresponse!=undefined){
          var message = "";
          var colorarray = colorresponse[0].COLOR_HIST.split(",")
          for(var i = 0;i<colorarray.length;++i){
            if(i===0){
              message+=`Your recent colors are ${i+1}: ${colorarray[i]} `
            }else{
              message+=`${i+1}: ${colorarray[i]} `
            }
          }
          let time = util.shortenTime(Date.now()-colorresponse[0].LAST_CHANGE);
          message+= `and your latest change was ${time} ago`
        }else{
          message='First of all you have to register your account for history with hb register color';
        }
        return message;
    }
}