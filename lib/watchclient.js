const tmi = require('tmi.js');
const anonymconfig = require('../config2')
const database= require("../database")
const util = require("./functions/functions")
const chalk = require("chalk")
let ColorRegisteredUser=[];

const watchclient = new tmi.Client(anonymconfig)

watchclient.on('part',async(channel,username,self)=>{
    channel = channel.replace('#',"")
    if(self){
        console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.red("[PARTED]")} ${chalk.green("[")}${chalk.green(channel.toUpperCase())}${chalk.green("]")}`)
        database.remove("WATCHCHANNELS","CHANNEL_NAME",channel)
    }
})
watchclient.on('chat',async(channel,user,message,self)=>{
    let username = user['display-name'].toLowerCase();
    let user_id = user['user-id'];
    let color = user.color;

if(!ColorRegisteredUser.includes(username))return;
let databasedata = await database.query(`SELECT * FROM TWITCH_USER WHERE TWITCH_ID = '${user_id}'`)
    if(databasedata!=undefined&&databasedata[0].COLOR!=color){
        util.updateColor(user_id,color)
        let colorhistorydata = await database.query(`SELECT * FROM COLOR_HISTORY WHERE TWITCH_ID = '${user_id}'`)
        if(colorhistorydata!=undefined){
          util.storeColor(user_id,color)
        }
      }
})

watchclient.on('connected',(address,port)=>{
    fillColorRegisteredUser();
    console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.green("[SUCCESSFUL]")}`)
})
watchclient.on('join',async(channel,username,self)=>{
    channel= channel.replace("#","");
    if(self){
        console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.hex('#800080').bold("[JOINED]")} ${chalk.hex("#96ffcb").bold("[")}${chalk.hex('#96ffcb').bold(channel.replace("#","").toUpperCase())}${chalk.hex('#96ffcb').bold("]")}`)
        let response = await database.query(`SELECT * FROM WATCHCHANNELS WHERE CHANNEL_NAME= '${channel}'`)
        if(response===undefined){
            database.insert("WATCHCHANNELS","CHANNEL_NAME",`'${channel}'`)
        }
    }
})
/**
 * Joines a channel, which now will be tracked
 * @param {String} channel 
 */
const join = (channel)=>{
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
const leave = (channel)=>{
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
    let response = await database.query(`SELECT TWITCH_ID FROM COLOR_HISTORY`);
    response.forEach(async(user) => {
        let userresponse = await database.query(`SELECT USERNAME FROM TWITCH_USER WHERE TWITCH_ID = '${user.TWITCH_ID}'`)
        ColorRegisteredUser.push(userresponse[0].USERNAME.toLowerCase())
    });
}
const joinChannel = async()=>{
    await watchclient.connect()
    .then((value)=>{
    })
    .catch((reason)=>{
        console.log(`${chalk.blue("[WATCHCLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.red("[FAILED]")}`)
        setTimeout(()=>{
            console.log("NOT CONNECTED")
            return joinChannel();
        },2000)
    })
    let response = await database.select("CHANNEL_NAME","WATCHCHANNELS")
    for(var i = 0;i<response.length;++i){
      await watchclient.join(response[i].CHANNEL_NAME)
      await util.timer(100)
    }
  }
  joinChannel();
  
module.exports.join=join;
module.exports.leave=leave;
module.exports.updateArray= fillColorRegisteredUser;
module.exports.RegisteredUser=ColorRegisteredUser;