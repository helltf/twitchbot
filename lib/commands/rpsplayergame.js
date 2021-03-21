const rpsgameclass= require(`../classes/rpsgame`)
const client = require(`../client`)
const rpsarray=require(`../../offlinebot`)
const database= require("../..//database")
const util = require(`./../functions/functions`)
module.exports={
    description:`Play a game of rps`,
    name: `rpsplayergame`,
    required_permissions: 1,
    required_parameters:`player`,
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
        rpsarray.runningRpsGames.forEach((game)=>{
            if(game.player1===username||game.player2===user){
                hasgame=true
            }else if(game.player1===opponent||game.player2===opponent){
                hasgame=true
            }
        })
        if(hasgame)return `Either you or your opponent is in a game!`;

        let currentgame = new rpsgameclass.Rpsgame(username,opponent)

        rpsarray.runningRpsGames.push(currentgame)

        client.client.say(channel,`You now have ${time/1000}s to whisper your decision to me!`)
        
        await util.timer(time)
        let player1_dec=currentgame.player1_decision
        let player2_dec=currentgame.player2_decision
        let player1 = currentgame.player1
        let player2= currentgame.player2
        let player1response = await database.selectWhere("*","TWITCH_USER","USERNAME",player1)
        let player2response = await database.selectWhere("*","TWITCH_USER","USERNAME",player2)
        let message=`${player1} decision: ${player1_dec}! ${player2}'s decision: ${player2_dec}! `
            if(player1_dec!=undefined&&player2_dec!=undefined){
                if(player2_dec===player1_dec){
                    //database.updateWhere(`RPS_STATS`,`DRAW`,drawstats+1,`TWITCH_ID`,user_id)
                    message+=`Result: Draw :\\ `
                }
                else if(player1_dec===`rock`){
                    if(player2_dec===`scissor`){
                        message+=`Result: ${player1} won ;P  `
                        //database.updateWhere(`RPS_STATS`,`WIN`,winstats+1,`TWITCH_ID`,user_id)
                    }else{
                        message+=`Result: ${player2} won ;P `
                        //database.updateWhere(`RPS_STATS`,`LOSE`,losestats+1,`TWITCH_ID`,user_id)
                    }
                }else if(player1_dec===`paper`){
                    if(player2_dec===`scissor`){
                        message+=`Result: ${player2} won ;P `
                       // database.updateWhere(`RPS_STATS`,`LOSE`,losestats+1,`TWITCH_ID`,user_id)
                    }else{
                        message+=`Result: ${player1} won ;P  `
                        //database.updateWhere(`RPS_STATS`,`WIN`,winstats+1,`TWITCH_ID`,user_id)
                    }
                }else if(player1_dec===`scissor`){
                    if(player2_dec===`rock`){
                        message+=`Result: ${player2} won ;P `
                       // database.updateWhere(`RPS_STATS`,`LOSE`,losestats+1,`TWITCH_ID`,user_id)
                    }else{
                        message+=`Result: ${player1} won ;P  `
                        //database.updateWhere(`RPS_STATS`,`WIN`,winstats+1,`TWITCH_ID`,user_id)
                    }
            }
            }else if(player1_dec===undefined){
               message = `${player1} did not whisper his decision!` 
            }else if(player2_dec===undefined){
                message=`${player2} did not whisper his decision!` 
            }
            rpsarray.runningRpsGames.splice(rpsarray.runningRpsGames.indexOf(currentgame),1)
            return message;
    }
}