const tmi = require('tmi.js');
const anonymconfig = require('../config2')
const database= require("../database")
const util = require("./functions/functions")
const chalk = require("chalk")
const MINIMUM_DURATION=600;
const watchclient = new tmi.Client(anonymconfig)

watchclient.on("ban",(channel,username,reason)=>{
    channel=channel.replace("#","")
    database.addNewBan(channel,username)
})

watchclient.on("timeout",(channel,username,reason,duration)=>{
    channel=channel.replace("#","")
    if(MINIMUM_DURATION < duration){
        database.addNewTimeout(username, channel, duration)
    }
})

watchclient.on('part',async(channel,username,self)=>{
    if(!self) return
    channel = channel.replace('#',"")
    console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.red("[PARTED]")} ${chalk.green("[")}${chalk.green(channel.toUpperCase())}${chalk.green("]")}`)
    database.removeWatchChannel(channel)
})

watchclient.on('chat',async(channel,user,message,self)=>{
    let {['user-id']:user_id, color} = user
    if(await database.isUserRegistered(user_id)) {
        let databaseColor = await database.getColorForUser(user_id)
        database.updateUser(user)
        if(databaseColor && databaseColor != color){
            if(await database.userIsRegisteredForColorHistory(user_id)) 
                database.updateColorHistoryInDatabase(await util.getColorArrayWithNewColor(user_id,color),user_id)
        }
    }
})

watchclient.on('connected',(address,port)=>{
    console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.green("[SUCCESSFUL]")}`)
    joinAllChannels();
})

watchclient.on('join',async(channel, username, self)=>{
    if(!self) return;
    channel= channel.replace("#","");
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
            reject("Channel is not available!")
        })
    })
}
const joinAllChannels = async()=>{
    let watchchannels = await database.select("CHANNEL_NAME","WATCHCHANNELS")
    if(process.env.IS_RASPI==="false") return watchclient.join("helltf")
    for await(let {CHANNEL_NAME: channelName} of watchchannels){
      await watchclient.join(channelName).catch(reason => database.removeWatchChannel(channelName))
      await util.timer(1000)
    }
  }
const startWatchClient=async()=>{
    await watchclient.connect()    
    .catch((reason)=>{
        console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.red("[FAILED]")}`)
    })
    setInterval(reconnectWatchClient, 86400000)
}

const reconnectWatchClient = async () => {
    await watchclient.disconnect()
    await watchclient.connect()
}

module.exports={watchclient, startWatchClient}