const config=require('../config.json');
const chalk = require("chalk")
const tmi = require('tmi.js');
const client = new tmi.Client(config);
const database = require('../database.js');
const requireDir = require('require-dir');
let commands = requireDir('./commands');
const util=require('./functions/functions');
const eventEmitter = require("../lib/functions/eventEmitter");
const { runningEmoteGames } = require('./functions/runningEmoteGames');
let AT="";

client.on('connected',(address,port)=>{
  console.log(`${chalk.yellow("[NORMAL CLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.green("[SUCCESSFUL]")}`)
  joinChannel();
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
    if(self||user["user-id"]===625016038) return; 

    channel= channel.replace("#","");
    let messageparts = message.split(' ');
    user.username=user.username.toLowerCase()

    if(!message.toLowerCase().startsWith("hb"))return;
     
    let userpermissions = await util.getPermissions(user);
    let command;

    if(messageparts[1]) command = messageparts[1].toLowerCase();
    
     messageparts.splice(0,2);
     util.registerUser(user)

    if(!commands[command]||!userpermissions) return;
    
    //check userpermissions 
    if(commands[command].required_permissions>userpermissions)return;

    //running the code for a certain command
    let result = await commands[command].invocation(channel, user, messageparts);
    util.incrementCommandCounter(command);
    
    //send message if allowed
    sendAllowedMessage(channel,result)
  });
client.on('whisper',(from,user,message,self)=>{
  message=message.toLowerCase();
  if(message.search(/^rock$|^paper$|^scissors$/)!=-1){
    eventEmitter.emit('rpswhisper',message,user)
  }
})
client.on('chat',(channel,user,message,self)=>{
  if(self) return;
  channel= channel.replace("#","");
  if(runningEmoteGames.length===0) return;
  runningEmoteGames.forEach((game)=>{
    if(game.channel===channel){
      eventEmitter.emit('emotegame',game,user,message)
    }
  })
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
          resolve("Successful!")
      }).catch((reason)=>{
          console.log(reason)
          reject("not Successful")
      })
  })
}

const joinChannel = async()=>{
  let response = await database.selectWhere("CHANNEL_NAME","CHANNELS","CURR_CONNECTED","1")
  for await(channel of response){
    util.updateChannelInfoDatabase(channel.CHANNEL_NAME)
     await client.join(channel.CHANNEL_NAME).catch( (reason) =>{console.log(reason)})
    await util.timer(150)
  }
}

eventEmitter.on('rpsfinished',async(message,channel)=>{
  sendAllowedMessage(channel,message)
})
eventEmitter.on('emotegamefinished',(user,channel,emote)=>{
  sendAllowedMessage(channel,`${user.username} has guessed the Emote PogChamp The emote was ${emote}`)
})
eventEmitter.on("emotegamerightguess",(message,game,letter,user)=>{
  sendAllowedMessage(game.channel,`The letter ${letter} has been guessed!  ${message}`)
})
const sendAllowedMessage=async (channel,message)=>{
  let response = await database.selectWhere("ALLOWED,ALLOWED_LIVE","CHANNELS","CHANNEL_NAME",channel);
  allowed = response[0].ALLOWED;
  allowed_live=response[0].ALLOWED_LIVE
  if(allowed&&allowed_live&&message!=undefined){
    client.say(channel,`${message}`)
  }
}
const startClient =async ()=>{
  await client.connect()  
  .catch((reason)=>{
    console.log(`${chalk.yellow("[NORMAL CLIENT]")} ${chalk.magenta("[TWITCH]")}${chalk.gray("[CONNECTION]")} ${chalk.red("[FAILED]")}`)
  })
}
startClient();
module.exports.client=client;
module.exports.join=join;
module.exports.leave=leave;
module.exports.sendAllowedMessage=sendAllowedMessage