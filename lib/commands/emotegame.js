 const  Emotegame  = require("../classes/EmoteGame").Emotegame
const runningEmoteGames = require("../functions/runningEmoteGames").runningEmoteGames;
const util = require("../functions/functions")
const database =require("../../database")
const eventEmitter = require("./../functions/eventEmitter")
/**
 * @author helltf
 */
module.exports={
    description:`Starts a game of hangman with thirdparty emotes!`,
    name: `emotegame`,
    required_permissions: 1,
    required_parameters:`none`,
    optional_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        let time = 600000 
        let response = await database.selectWhere("ALLOWED","CHANNELS","CHANNEL_NAME",channel)
        if(!response[0].ALLOWED)return;
        let hit = runningEmoteGames.some(game=>{ return game.channel===channel })
        if(hit) return `There is already a game running in this channel!`
        let allemotes = await util.getThirdPartyEmotes(channel)
        let emote = allemotes[Math.floor(Math.random()*allemotes.length)]
        let underscores="";
        for(var i =0;i<emote.length;i++){
            underscores+="_ "
        }
        underscores = underscores.substring(0,underscores.length-1)
        let currentgame =  new Emotegame(emote,channel,underscores)

        runningEmoteGames.push(currentgame)
       
        setTimeout(()=>{
            if(runningEmoteGames.includes(currentgame)){
                eventEmitter.emit("emotegameexceeded",channel)
                runningEmoteGames.splice(runningEmoteGames.indexOf(currentgame),1)
            }
        },time)
        return `A Bttvgame has started in this channel! You guess the Emote either writing single letters or the whole Emotename. Emote: ${underscores}`
    }
}