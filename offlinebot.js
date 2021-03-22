const database = require('./database');
database.connect();
const client = require('./lib/client.js');
const watchclient = require("./lib/watchclient");
require('dotenv').config();
const got = require('got')
var mysql = require('mysql');
const updatecmd = require("./lib/functions/updateCommandsDatabase")
updatecmd();

async function updateEmotes(channel,callback){
    var ffzemotes=[]
     var bttvemotes=[] 
     var allemotes=[]
     const ffz=await got(`https://api.frankerfacez.com/v1/room/${channel}`).json();
     var id =ffz.room.twitch_id; 
     const bttv=await got(`https://api.betterttv.net/3/cached/users/twitch/${id}`).json();
     const setId = Object.keys(ffz.sets)[0];
     for(var i = 0;i<ffz.sets[setId].emoticons.length;++i){
      ffzemotes.push(ffz.sets[setId].emoticons[i].name);
     }
     for(var i=0;i<bttv.channelEmotes.length;++i){
       bttvemotes.push(bttv.channelEmotes[i].code);
     }
     for(var i=0;i<bttv.sharedEmotes.length;++i){
      bttvemotes.push(bttv.sharedEmotes[i].code);
    }
    allemotes=ffzemotes.concat(bttvemotes);
    callback(allemotes)
}
const updateChannels= async ()=>{
  allChannels = client.getChannels();
  console.log(allChannels)
  for(var i = 0;i<allChannels.length;++i){
    var channel = allChannels[i].substring(1,allChannels[i].length);
    await updateEmotes(channel,(callback)=>{
      emoteJSON[channel]=callback;
    });
  }
}

var emoteJSON={}

let runningRpsGames=[]
module.exports.runningRpsGames=runningRpsGames;
database.custom("DELETE FROM TIMEOUT_USER WHERE DURATION < 180")