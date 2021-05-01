const database = require("../../database")
const request = require('request')
const got = require('got')
const fs = require('fs');
const humanizeDuration = require("humanize-duration");
const AT = require("./ATHandler").AT;

module.exports.updateChannelInfoDatabase = async(channel)=>{
  let DatabaseChannels = await database.selectWhere("CHANNEL_NAME","CHANNEL_INFO","CHANNEL_NAME",channel)
  if(!DatabaseChannels)
    database.addNewChannelForAPIUpdates(channel,Date.now())
}
 module.exports.addChannel= async (channel)=>{
    database.insert("CHANNELS","CHANNEL_NAME,ALLOWED,TIMES_CONNECTED,CURR_CONNECTED,FIRST_CONNECTED,ALLOWED_LIVE",`'${channel}','0','1','1','${Date.now()}','1'`)
}
module.exports.splitUserMessage=(users,beginmessage)=>{
  let messageArray=[]
  let currentmessage=beginmessage
  for(user of users){
    if((currentmessage+" "+user).length<500){
      currentmessage+=" "+user
    }else{
      messageArray.push(currentmessage)
      currentmessage= beginmessage+ " "+user
    }
  }
  return messageArray
}
/**
 * Adds an user to the database if not registered
 * @param {*} user 
 */
 module.exports.registerUser= async(user)=>{
  let username= user.username
  let user_id = user["user-id"]
  let color = user.color
  let response = await database.selectWhere("USERNAME","TWITCH_USER","USERNAME",username)
  if(response===undefined){
    database.insert("TWITCH_USER","USERNAME, TWITCH_ID, COLOR,PERMISSIONS,REGISTER_TIME",`'${username}', '${user_id}', '${color}','1','${Date.now()}'`)
  }
}
/**
 * Checks permission for a twitch_id for the user
 * @param {userstate} user Userstate of current user
 * @returns The current permissionlevel of that user
 */
 module.exports.getPermissions=async (user) =>{
    let response = await database.selectWhere("PERMISSIONS","TWITCH_USER","TWITCH_ID",user['user-id']);
    let permissionlvl;
    if((user.badges!=undefined||user.badges!=null)&&user.badges.broadcaster!=undefined){
      permissionlvl= 2;
  }
    if(response!=undefined){
      if(response[0].PERMISSIONS===0)return 0;
        if(permissionlvl<response[0].PERMISSIONS||permissionlvl===undefined)permissionlvl= response[0].PERMISSIONS;
    }
    else if(permissionlvl===undefined){
        permissionlvl=1;
    }
    return permissionlvl;
}
/**
 * Helper function to shorten humanized time to make it better readable
 * @param {String} time time as String 
 * @returns shortened time
 */
 module.exports.shortenTime = (time)=>{
  time = humanizeDuration(time)
  return time.replace(/years?/,"y") //replaces year with y
  .replace(/months?/,"m") //replaces months with m
  .replace(/weeks?/,"w")//replaces weeks with w
  .replace(/days?/,"d") //replaces days with d
  .replace(/hours?/,"h") //replaces hours with h
  .replace(/minutes?/,"min") //replaces minutes with min
  .replace(/seconds?/,"s") //replaces seconds with s
  .replace(/\s/g,"") //removes whitespaces
  .replace(/,/g," ") //replaces comma with whitespace
}

 module.exports.setPermissionsForUser=async (user,permissionlvl) =>{
    database.updateWhere("TWITCH_USER","PERMISSIONS",permissionlvl,"USERNAME",user)
}
/**
 * Appends the new Color to the data for the user with the twitch_id
 * @param {number} twitch_id Users twitch_id
 * @param {colorcode} color current Color of the user
 */
const changePostionOfColorToFirst = (colorHistoryArray,newcolor,user_id)=>{
  let index = colorHistoryArray.indexOf(newcolor)
  colorHistoryArray.splice(index,1);
  colorHistoryArray.unshift(newcolor);
  database.updateColorHistoryInDatabase(colorHistoryArray,user_id)
}
const addColorToFirstPosition = (colorHistoryArray,newcolor,user_id)=>{
  colorHistoryArray.unshift(newcolor);
  database.updateColorHistoryInDatabase(colorHistoryArray,user_id)
}
const addColorToFirstPositionAndRemoveLastColor = (colorHistoryArray,newcolor,user_id)=>{
  colorHistoryArray.splice(colorHistoryArray.length-1,1);
  colorHistoryArray.unshift(newcolor);
  database.updateColorHistoryInDatabase(colorHistoryArray,user_id)
}
 module.exports.storeColor=async(user_id,newcolor)=>{
    let colorresponse = await database.selectWhere("*","COLOR_HISTORY","TWITCH_ID",user_id)
    let colorHistoryArray = JSON.parse(colorresponse[0].COLOR_HIST)
      if(colorHistoryArray.includes(newcolor)){
        return changePostionOfColorToFirst(colorHistoryArray,newcolor,user_id);
      }
        if(colorHistoryArray.length<10){
           addColorToFirstPosition(colorHistoryArray, newcolor, user_id)
        }else{
           addColorToFirstPositionAndRemoveLastColor(colorHistoryArray, newcolor, user_id)
        }
}

 module.exports.updateColor= (user_id, color)=>{
  database.updateWhere("TWITCH_USER","COLOR",color,"TWITCH_ID",user_id)
}
/**
 * 
 * @param {*} options GET options
 * @returns parsed body of the callback
 */
 module.exports.request=async(options)=>{
  return new Promise((resolve,reject)=>{
    request.get(options,(err,res,body)=>{
      if(err){
        reject(err);
      }
      else{
        try{
          resolve(JSON.parse(body))
        }catch(err){
          console.log(err)
          resolve(undefined)
        }
        
      }
    })
  })
}
/**
 * 
 * @param {*} options GET options
 * @returns parsed body of the callback
 */
 module.exports.postrequest= async(options)=>{
  return new Promise((resolve,reject)=>{
    request.post(options,(err,res,body)=>{
      if(err){
        reject(err);
      }
      else{
        resolve(body)
      }
    })
  })
}
/**
 * simple got request
 * @param {*} url URL 
 * @returns parsed body of the callback
 */
 module.exports.got= async(url)=>{
  return new Promise(async(resolve,reject)=>{
    let response = await got(url)
    if(response===undefined){
      reject("error")
    }else{
      resolve(JSON.parse(response.body))
    }
  })
}
/**
 * Writes a JSON to a given File
 * @param {*} path path dependend on this file location
 * @param {*} jsonobject content for the written file
 */
 module.exports.writeFile= (path,jsonobject)=>{
  fs.writeFile(path, JSON.stringify(jsonobject), function writeJSON(err) {
      if (err) return console.log(err);
  });
}
/**
 * Increments the Counter of the command in the database
 * @param {String} command 
 */
 module.exports.incrementCommandCounter = async(command)=>{
  let response = await database.selectWhere("COUNTER","COMMANDS","NAME",command.toUpperCase())
  let currentcount = response[0].COUNTER
  database.updateWhere("COMMANDS","COUNTER",currentcount+1,"NAME",command.toUpperCase())
}
/**
 * Simple sleeping functions
 * @param {number} ms time the function will wait
 */
 module.exports.timer= ms => new Promise(res => setTimeout(res, ms))

module.exports.getThirdPartyEmotes=async(channel)=>{
  let allemotes= []
  let id;
await got(`https://api.frankerfacez.com/v1/room/${channel}`).json()
  .then((value)=>{
      id = value.room.twitch_id
      let setid = Object.keys(value.sets)[0]
      value.sets[setid].emoticons.forEach((emote)=>{
          allemotes.push(emote.name)
      })
  })
  .catch((reason)=>{
      console.log(reason)
  })
await got(`https://api.betterttv.net/3/cached/users/twitch/${id}`).json().then((value)=>{
      value.channelEmotes.forEach((emote)=>{
          allemotes.push(emote.code)
      })
  }).catch((reason)=>{
      console.log(reason)
  })
  return new Promise((resolve,reject)=>{
    if(allemotes.length===0){
      reject("Couldn't find that channel")
    }else {
      resolve (allemotes);
    }
  });
}
module.exports.getIndicesOf=(searchStr, str, caseSensitive)=> {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
      return [];
  }
  var startIndex = 0, index, indices = [];
  if (!caseSensitive) {
      str = str.toLowerCase();
      searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
  }
  return indices;
}
module.exports.getGameByID=async(id)=>{
  const options = {
    url: "https://api.twitch.tv/helix/games?id="+id,
    method:'GET',
    headers:{
        'Client-ID':process.env.CLIENT_ID,
        'Authorization': 'Bearer ' + AT.access_token
    }
}
return new Promise((resolve,reject)=>{
  request.get(options,(err,res,body)=>{
    if(err){
       reject(err)
       console.log(err)
    }
    let parsed = JSON.parse(body)
    if(!parsed?.data[0]?.name) resolve(undefined) 
    resolve(parsed?.data[0]?.name)
  })
})
}
module.exports.checkAvailableAtTwtichAPI = async(channelname)=>{
  channelname=channelname.replace(/[^\x00-\x7F]|\n|'/g,"")
  const options = {
    url: "https://api.twitch.tv/helix/search/channels?query="+channelname,
    method:'GET',
    headers:{
        'Client-ID':process.env.CLIENT_ID,
        'Authorization': 'Bearer ' + AT.access_token
      }
    }
    return new Promise((resolve,reject)=>{
      request.get(options,(err,res,body)=>{
        if(err){
           reject(err)
           console.log(err)
        }
        let parseddata = JSON.parse(body)
        resolve(parseddata?.data.some((streamer)=>{
          return (streamer.broadcaster_login===channelname)
        }))
    })
    })
}