const config=require('../config.json');
const chalk = require("chalk")
const tmi = require('tmi.js');
const client = new tmi.Client(config);
const database = require('../database.js');
const requireDir = require('require-dir');
const commands = requireDir('./commands');
const util=require('./functions/functions');

client.on('connected',(address,port)=>{
  console.log(`${chalk.yellow("[NORMAL CLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.green("[SUCCESSFUL]")}`)
})
client.on('part',(channel,username,self)=>{
  channel=channel.replace("#","")
  if(!self)return;
  database.updateWhere("CHANNELS","CURR_CONNECTED","0","CHANNEL_NAME",channel)
  console.log(`${chalk.yellow("[NORMAL CLIENT]")} ${chalk.red("[PARTED]")} ${chalk.green("[")}${chalk.green(channel.replace("#","").toUpperCase())}${chalk.green("]")}`)
})
client.on('join',async (channel,user,self)=>{
  channel= channel.replace("#","");
  if(self) {
    console.log(`${chalk.yellow("[NORMAL CLIENT]")} ${chalk.hex('#800080').bold("[JOINED]")} ${chalk.hex('#96ffcb').bold("[")}${chalk.hex("#96ffcb").bold(channel.replace("#","").toUpperCase())}${chalk.hex('#96ffcb').bold("]")}`)
    let response = await database.query(`SELECT * FROM CHANNELS WHERE CHANNEL_NAME= '${channel}'`)
    if(response!=undefined){
        let timesconnected = response[0].TIMES_CONNECTED;
        database.updateWhere("CHANNELS","TIMES_CONNECTED",timesconnected+1,"CHANNEL_NAME",channel)
        if(response[0].FIRST_CONNECTED===null) database.updateWhere("CHANNELS","FIRST_CONNECTED",Date.now(),"CHANNEL_NAME",channel)
    }else{
      util.addChannel(channel);
    }
  }
})
client.on('chat',async (channel,user,message,self)=>{
    if(self)return;   //if the message comes from the bot return
    let messageparts = message.split(' ');

    if(messageparts[0].toLowerCase()!='hb') return; //check for prefix

     channel= channel.replace("#","");
     
    let userpermissions = await util.getPermissions(user);

    let command = messageparts[1].toLowerCase();
    
     messageparts.splice(0,2);
     //check if user is banned
    if(commands[command]===undefined||userpermissions===0) return;
    
    //check userpermissions 
    if(commands[command].required_permissions>userpermissions)return;

    //running the code for a certain command
    let result = await commands[command].invocation(channel, user, messageparts);

    //get if channel is allowed
    let allresponse = await database.query(`SELECT ALLOWED FROM CHANNELS WHERE CHANNEL_NAME = '${channel}'`);
      allowed = allresponse[0].ALLOWED;
    //check if channel is allowed
    if(allowed&&result!=undefined){
      client.say(channel,`${result}`);
    }
  });
  const leave = (channel)=>{
    return new Promise(async(resolve,reject)=>{
        client.part(channel).then((value)=>{
            resolve("Successfull!")
        }).catch((reason)=>{
            console.log(reason)
            reject("Channel not available!")
        })
    })
}
const join = (channel)=>{
  return new Promise(async(resolve,reject)=>{
      client.join(channel).then((value)=>{
          resolve("Successfull!")
      }).catch((reason)=>{
          console.log(reason)
          reject("not Successfull")
      })
  })
}
const joinChannel = async()=>{
  await client.connect()
  .then((value)=>{
  })
  .catch((reason)=>{
    console.log(`${chalk.yellow("[NORMAL CLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.red("[FAILED]")}`)
  })
  let response = await database.selectWhere("CHANNEL_NAME","CHANNELS","CURR_CONNECTED","1")
  for(var i = 0;i<response.length;++i){
    await client.join(response[i].CHANNEL_NAME)
    await util.timer(100)
  }
}
const ping = async()=>{
  return new Promise(async(resolve,reject)=>{
    await client.ping().then((value)=>{
      resolve(value);
    }).catch((reason)=>{
      reject(reason)
    })
  })
}
joinChannel();
module.exports.ping=ping;
module.exports.join=join;
module.exports.leave=leave;