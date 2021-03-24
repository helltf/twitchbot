const  Emotegame  = require("../classes/emotegame").Emotegame
const runningEmoteGames = require("../functions/runningEmoteGames").runningEmoteGames;
const util = require("../functions/functions")

module.exports={
    description:`Starts a game of hangman with thirdparty emotes!`,
    name: `emotegame`,
    required_permissions: 1,
    required_parameters:`none`,
    invocation: async(channel,user,messageparts)=>{
        let time = 600000
        let hit=false;
        runningEmoteGames.forEach((game)=>{
            if(game.channel===channel)hit = true;
        })
        if(hit)return `There is already a game running in this channel!`
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
                client.sendAllowedMessage(channel,`The Bttvgame has been canceled, because the game exceeded the timelimit of ${time/1000/60}min!`)
                runningEmoteGames.splice(runningEmoteGames.indexOf(currentgame),1)
            }
        },time)
        return `A Bttvgame has started in this channel! You guess the Emote either writing single letters or the whole Emotename. Emote: ${underscores}`
    }
}