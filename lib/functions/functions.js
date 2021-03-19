const database = require("../../database")
const request = require('request')
const got = require('got')
const fs = require('fs');
const humanizeDuration = require("humanize-duration");
/**
 * adds a channel to the database if its not known already
 * @param {String} channel name of the channel 
 */
 const addChannel = async (channel)=>{
    database.insert("CHANNELS","CHANNEL_NAME,ALLOWED,TIMES_CONNECTED,CURR_CONNECTED,FIRST_CONNECTED",`'${channel}','0','1','1','${Date.now()}'`)
}
/**
 * Checks permission for a twitch_id for the user
 * @param {userstate} user Userstate of current user
 * @returns The current permissionlevel of that user
 */
const getPermissions = async (user) =>{
    let response = await database.query(`SELECT PERMISSIONS FROM TWITCH_USER WHERE TWITCH_ID = '${user['user-id']}'`);
    let permissionlvl;
    if(response!=undefined){
        permissionlvl= response[0].PERMISSIONS;
    }else if((user.badges!=undefined||user.badges!=null)&&user.badges.broadcaster!=undefined&&permissionlvl<2){
        permissionlvl= 2;
    }
    else{
        permissionlvl=1;
    }
    return permissionlvl;
}
/**
 * Helper function to shorten humanized time
 * @param {String} time time as String 
 * @returns shortened time
 */
const shortenTime = (time)=>{
  time = humanizeDuration(time)
  time = time.replace(/year?/,"y") //replaces year with y
  .replace(/month?/,"m") //replaces months with m
  .replace(/day?/,"d") //replaces days with d
  .replace(/hour?/,"h") //replaces hours with h
  .replace(/minute?/,"min") //replaces minutes with min
  .replace(/second?/,"s") //replaces seconds with s
  .replace(/\s/g,"") //removes whitespaces
  .replace(/,/g," ") //replaces comma with whitespace
  return time;
}
/**
 * 
 * @param {String} user Username of the user
 * @param {Int} permissionlvl new permissionlevel for the user
 */
const setPermissions = async (user,permissionlvl) =>{
    database.updateWhere("TWITCH_USER","PERMISSIONS",permissionlvl,"USERNAME",user)
}
/**
 * Appends the new Color to the data for the user with the twitch_id
 * @param {number} twitch_id Users twitch_id
 * @param {colorcode} color current Color of the user
 */
const storeColor= async(twitch_id,color)=>{
    let colorresponse = await database.query(`SELECT * FROM COLOR_HISTORY WHERE TWITCH_ID = '${twitch_id}'`)
        var colorhistory="";
        var colorhistoryarray = colorresponse[0].COLOR_HIST.split(",").reverse();
        if(colorhistoryarray.length<10){
          if(!colorhistoryarray.includes(color)){
            colorhistoryarray.push(color);
          }else{
           var index  = colorhistoryarray.indexOf(color);
           colorhistoryarray.splice(index,1);
           colorhistoryarray.push(color);
          }
        }else{
          colorhistoryarray.splice(0,1);
          colorhistoryarray.push(color);
        }
        colorhistoryarray.reverse();
        for(var i =0;i<colorhistoryarray.length;++i){
          if(i===0){
            colorhistory+=colorhistoryarray[i];
          }
          else{colorhistory+="," + colorhistoryarray[i]}
        }
        database.updateWhereMultipleSets('COLOR_HISTORY',`COLOR_HIST='${colorhistory}',LAST_CHANGE='${Date.now()}'`,"TWITCH_ID",twitch_id);      
}
/**
 * Updates the color in the TWITCH_USER database
 * @param {Int} user_id Users twitch_id
 * @param {colorcode} color current Color of user
 */
const updateColor = (user_id, color)=>{
  database.updateWhere("TWITCH_USER","COLOR",color,"TWITCH_ID",user_id)
}
/**
 * 
 * @param {*} options GET options
 * @returns parsed body of the callback
 */
const promiserequest = async(options)=>{
  return new Promise((resolve,reject)=>{
    request.get(options,(err,res,body)=>{
      if(err){reject(err);
      }
      else{
        resolve(JSON.parse(body))
      }
    })
  })
}
/**
 * simple got request
 * @param {*} url URL 
 * @returns parsed body of the callback
 */
const gotR = async(url)=>{
  return new Promise(async(resolve,reject)=>{
    let response = await got(url)
    resolve(JSON.parse(response.body))
  })
}
/**
 * Writes a JSON to a given File
 * @param {*} path path dependend on this file location
 * @param {*} jsonobject content for the written file
 */
const writeFile = (path,jsonobject)=>{
  fs.writeFile(path, JSON.stringify(jsonobject), function writeJSON(err) {
      if (err) return console.log(err);
  });
}
/**
 * 
 * @param {String} command 
 */
 const incrementCommandCounter = async(command)=>{
  let response = await database.selectWhere("COUNTER","COMMANDS","NAME",command.toUpperCase())
  let currentcount = response[0].COUNTER
  database.updateWhere("COMMANDS","COUNTER",currentcount+1,"NAME",command.toUpperCase())
}
/**
 * Simple timer
 * @param {number} ms time the function will wait
 */
const timer = ms => new Promise(res => setTimeout(res, ms))

module.exports.incrementCommandCounter=incrementCommandCounter;
module.exports.updateColor=updateColor;
module.exports.storeColor=storeColor;
module.exports.setPermissions=setPermissions;
module.exports.getPermissions=getPermissions;
module.exports.addChannel=addChannel;
module.exports.request=promiserequest;
module.exports.got=gotR;
module.exports.writeFile=writeFile;
module.exports.timer=timer;
module.exports.shortenTime=shortenTime;