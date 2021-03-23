const eventEmitter = require("./eventEmitter");
const runningRpsGames =  require("./runningrpsgames").runningRpsGames

eventEmitter.on('rpswhisper',(message,user)=>{
    let username = user.username.toLowerCase();
    runningRpsGames.forEach((rpsgame) => {
      let player1=rpsgame.player1
      let player2=rpsgame.player2
      if(player1===username||rpsgame.player1_decision===undefined){
        rpsgame.player1_decision=message;
      }else if(player2===username||rpsgame.player1_decision===undefined){
        rpsgame.player2_decision=message;
      }
      if(rpsgame.player1_decision!=undefined&&rpsgame.player2_decision!=undefined){
          eventEmitter.emit('rpsend',rpsgame)
      }
    });
})

eventEmitter.on('rpsend',(rpsgame)=>{
    let player1_dec = rpsgame.player1_decision
    let player2_dec = rpsgame.player2_decision
    let player1 = rpsgame.player1
    let player2 = rpsgame.player2
    let channel = rpsgame.channel
    let message=`${player1}s decision: ${player1_dec}! ${player2}s decision: ${player2_dec} `;
    if(player1_dec!=undefined&&player2_dec!=undefined){
        if(player2_dec===player1_dec){ 
            message+=`Result: Draw :\\ `
        }
        else if(player1_dec===`rock`){
            if(player2_dec===`scissor`){
                message+=`Result: ${player1} won ;P  `
            }else{
                message+=`Result: ${player2} won ;P `
            }
        }else if(player1_dec===`paper`){
            if(player2_dec===`scissor`){
                message+=`Result: ${player2} won ;P `
            }else{
                message+=`Result: ${player1} won ;P  `
            }
        }else if(player1_dec===`scissor`){
            if(player2_dec===`rock`){
                message+=`Result: ${player2} won ;P `
            }else{
                message+=`Result: ${player1} won ;P  `
            }
    }
}
    runningRpsGames.splice(runningRpsGames.indexOf(rpsgame),1)
    eventEmitter.emit('rpsfinished',message,channel)
})