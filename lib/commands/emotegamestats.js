const database = require("../../database")
/**
 * @author helltf
 */
module.exports={
    name:"emotegamestats",
    description:"Provides your stats for emotegames",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"username",
    invocation:
    async(channel,user,messageparts)=>{
        let user_id = user["user-id"]
        let stats = await database.getEmotegameStatsForUserID(user_id)
        if(stats){       
           return `Your stats for Emotegame are: Letters guessed: ${stats.letters_guessed}! Emotes guessed: ${stats.emotes_guessed}! Current leaderboardposition: ${await database.getLeaderboardPositionEmoteGame(user_id,"EMOTEGAME")}!`
    } 
    return `Sorry but to reveal your stats you have to play a emotegame! Command: "hb emotegame" to play the emotegame!`
    }
}