const tmi = require('tmi.js');
const anonymconfig = require('../config2')
const database= require("../database")
const util = require("./functions/functions")
const chalk = require("chalk")
let ColorRegisteredUser=[];
const MINIMUM_DURATION=600;
const watchclient = new tmi.Client(anonymconfig)

watchclient.on("ban",(channel,username,reason)=>{
    channel=channel.replace("#","")
    database.addNewBan(channel,username)
    console.log(`[${username.toUpperCase()}] [BANNED] [${channel.toUpperCase()}]`)
})

watchclient.on("timeout",(channel,username,reason,duration)=>{
    channel=channel.replace("#","")
    if(MINIMUM_DURATION<duration){
        database.addNewTimeout(username,channel,duration)
        console.log(`[${username.toUpperCase()}] [TIMEOUT] [${channel.toUpperCase()}][${duration}s]`)
    }
})

watchclient.on('part',async(channel,username,self)=>{
    if(!self) return
    channel = channel.replace('#',"")
    console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.red("[PARTED]")} ${chalk.green("[")}${chalk.green(channel.toUpperCase())}${chalk.green("]")}`)
    database.removeWatchChannel(channel)
})

watchclient.on('chat',async(channel,user,message,self)=>{
    let username = user['display-name'].toLowerCase();
    let user_id = user['user-id'];
    let color = user.color;

if(!ColorRegisteredUser.includes(username))return;

    let databaseColor = await database.getColorForUser(user_id)

    if(databaseColor&&databaseColor!=color){
        util.updateColor(user_id,color)
        let colorhistorydata = await database.selectWhere("*","COLOR_HISTORY","TWITCH_ID",user_id)
        if(colorhistorydata){
          util.storeColor(user_id,color)
        }
      }
})

watchclient.on('connected',(address,port)=>{
    console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.green("[SUCCESSFUL]")}`)
    fillColorRegisteredUser();
    joinAllChannels();
})
watchclient.on('join',async(channel,username,self)=>{
    if(!self) return;
    channel= channel.replace("#","");
    console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.hex('#800080').bold("[JOINED]")} ${chalk.hex("#96ffcb").bold("[")}${chalk.hex('#96ffcb').bold(channel.replace("#","").toUpperCase())}${chalk.hex('#96ffcb').bold("]")}`)
    let response = await database.selectWhere("*","WATCHCHANNELS","CHANNEL_NAME",channel)
        if(!response){
            database.addNewWatchChannel(channel)
    }
})
/**
 * Joines a channel, which now will be tracked
 * @param {String} channel 
 */
 module.exports.join = (channel)=>{
    return new Promise(async(resolve,reject)=>{
        watchclient.join(channel).then((value)=>{
            resolve("Successfull!")
        }).catch((reason)=>{
            console.log(reason)
            reject("this channel does not exist monkaS")
        })
    })
}
/**
 * Leaves a channel, which was tracked before
 * @param {String} channel 
 */
 module.exports.leave = (channel)=>{
    return new Promise(async(resolve,reject)=>{
        watchclient.part(channel).then((value)=>{
            resolve("Successful!")
        }).catch((reason)=>{
            console.log(reason)
            reject("channel not available!")
        })
    })
}
/**
 * Fills an Array with all users who wants to be tracked
 */
const fillColorRegisteredUser = async()=>{
    let response = await database.select("TWITCH_ID","COLOR_HISTORY");
    response.forEach(async(user) => {
        let userresponse = await database.selectWhere("USERNAME","TWITCH_USER","TWITCH_ID",user.TWITCH_ID)
        ColorRegisteredUser.push(userresponse[0].USERNAME.toLowerCase())
    });
}
const joinAllChannels = async()=>{
    let watchchannels = await database.select("CHANNEL_NAME","WATCHCHANNELS")
    for await(let channel of watchchannels){
      await watchclient.join(channel.CHANNEL_NAME).catch(reason => database.removeWatchChannel(channel.CHANNEL_NAME))
      await util.timer(100)
    }
  }
const startwatchClient=async()=>{
    await watchclient.connect()
    .catch((reason)=>{
        console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.red("[FAILED]")}`)
    })
}
startwatchClient();
module.exports.ColorRegisteredUser=RegisteredUser
module.exports.updateArray=fillColorRegisteredUser;