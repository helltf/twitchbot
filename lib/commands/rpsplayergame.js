const RpsGame= require(`../classes/rpsgame`).Rpsgame
const runningRpsGames=require("./../functions/runningrpsgames").runningRpsGames
/**
 * @author helltf
 */
module.exports={
    description:`Play a game of rps`,
    name: `rpsplayergame`,
    required_permissions: 1,
    required_parameters:`player`,
    optional_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        const timeLimit = 20000;

        if(!messageparts[0]) return `No opponent given!`

        let opponent=messageparts[0].toLowerCase()

        let username = user.username;

        let gamerunning=runningRpsGames.some(game=>{return game.player1===username||game.player2===username||game.player1===opponent||game.player2===opponent})

        if(gamerunning) return `Either you or your opponent is in a game!`;

        let currentgame = new RpsGame(username,opponent,channel)

        runningRpsGames.push(currentgame)
        setTimeout(()=>{
            if(runningRpsGames.includes(currentgame)){
                hb.sendAllowedMessage(channel,`The game between ${opponent} and ${username} has been canceled`)
                runningRpsGames.splice(runningRpsGames.indexOf(currentgame),1)
            }
        },timeLimit)

        return `You now have ${timeLimit/1000}s to whisper your decision to me!`
    }
}