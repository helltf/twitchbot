const rpsgameclass= require(`../classes/rpsgame`)
const client = require(`../client`)
const runningRpsGames=require("./../functions/runningrpsgames").runningRpsGames
const database= require("../..//database")
const util = require(`./../functions/functions`)
module.exports={
    description:`Play a game of rps`,
    name: `rpsplayergame`,
    required_permissions: 1,
    required_parameters:`player`,
    optional_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        let time = 20000;
        let opponent;
        if(messageparts[0]!=undefined){
            opponent=messageparts[0].toLowerCase()
        } else{
            return `no opponent given!`
        }
        let username = user.username.toLowerCase();
        let hasgame=false;
        runningRpsGames.forEach((game)=>{
            if(game.player1===username||game.player2===user){
                hasgame=true
            }else if(game.player1===opponent||game.player2===opponent){
                hasgame=true
            }
        })
        if(hasgame)return `Either you or your opponent is in a game!`;

        let currentgame = new rpsgameclass.Rpsgame(username,opponent,channel)

        runningRpsGames.push(currentgame)
        setTimeout(()=>{
            if(runningRpsGames.includes(currentgame)){
                client.sendAllowedMessage(channel,`The game between ${opponent} and ${username} has been canceled`)
                runningRpsGames.splice(runningRpsGames.indexOf(currentgame),1)
            }
        },time)

        return `You now have ${time/1000}s to whisper your decision to me!`
    }
}