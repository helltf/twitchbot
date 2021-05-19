const database = require("../../database")
/**
 * @author helltf
 */
module.exports={
    name:"rpsstats",
    description:"Provides your stats for rps",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"username",
    invocation:
    async(channel,user)=>{
        let user_id = user["user-id"]
        let stats = await database.getRPSStatsForUserID(user_id)
       if(stats){
           return `Your stats for RPS are WINS: ${stats.wins}! LOSSES: ${stats.losses}! DRAWS: ${stats.draws}! Games played: ${stats.wins+stats.losses+stats.draws}! Current leaderboardposition: ${await database.getLeaderboardPositionRPS(user_id,"RPS")}!`
       }
           return `Sorry but to reveal your stats you have to register or play a game of rps! Command: "hb register" to register!/ "hb rps" to play a game of rps!`
    }
}