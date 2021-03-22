const config=require('../config.json');
const chalk = require("chalk")
const tmi = require('tmi.js');
const client = new tmi.Client(config);
const database = require('../database.js');
const requireDir = require('require-dir');
let commands = requireDir('./commands');
const util=require('./functions/functions');
const rpsarray=require("../offlinebot");

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
    let response = await database.selectWhere("*","CHANNELS","CHANNEL_NAME",channel)
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

    if(!message.toLowerCase().startsWith("hb"))return;
     channel= channel.replace("#","");
     
    let userpermissions = await util.getPermissions(user);
  console.log(userpermissions)
    let command;

    if(messageparts[1]!=undefined) command = messageparts[1].toLowerCase();
    
     messageparts.splice(0,2);
     //check if user is banned
    if(commands[command]===undefined||userpermissions===0) return;

    //check userpermissions 
    if(commands[command].required_permissions>userpermissions)return;

    //running the code for a certain command
    let result = await commands[command].invocation(channel, user, messageparts);
    util.incrementCommandCounter(command);
    //get if channel is allowed
    let allresponse = await database.selectWhere("ALLOWED","CHANNELS","CHANNEL_NAME",channel);
      allowed = allresponse[0].ALLOWED;
    //check if channel is allowed
    if(allowed&&result!=undefined){
      client.say(channel,`${result}`);
    }
  });
client.on('whisper',(from,user,message,self)=>{
  message=message.toLowerCase();
  if(message.search(/^rock$|^paper$|^scissor$/)===-1)return;
  let username = user.username.toLowerCase();
  rpsarray.runningRpsGames.forEach((rpsgame) => {
    let player1=rpsgame.player1
    let player2=rpsgame.player2
    if(player1===username||rpsgame.player1_decision===undefined){
      rpsgame.player1_decision=message;
    }else if(player2===username||rpsgame.player1_decision===undefined){
      rpsgame.player2_decision=message;
    }
  });
})

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
module.exports.client=client;
module.exports.ping=ping;
module.exports.join=join;
module.exports.leave=leave;
