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
    async(channel,user,messageparts)=>{
        let user_id = user["user-id"]
        let response = await database.selectJoin("*","RPS_STATS","TWITCH_USER","RPS_STATS.TWITCH_ID","TWITCH_USER.TWITCH_ID","RPS_STATS.TWITCH_ID",user_id)
       if(response!=undefined){
        let wins=response[0].WIN
        let losses=response[0].LOSE
        let draws=response[0].DRAW
        let leaderbordarray=[]
        let leaderbordresponse = await database.custom(`
        SELECT  * 
        FROM TWITCH_USER 
        JOIN RPS_STATS ON  
        TWITCH_USER.TWITCH_ID = RPS_STATS.TWITCH_ID
        ORDER BY RPS_STATS.WIN DESC`)
        leaderbordresponse.forEach(user => {
            leaderbordarray.push(user.USERNAME)
        });
           return `Your stats for RPS are WINS: ${wins}! LOSSES: ${losses}! DRAWS: ${draws}! Games played: ${wins+losses+draws}! Current leaderboardposition: ${leaderbordarray.indexOf(user.username.toLowerCase())+1}!`
       }
           return `Sorry but to reveal your stats you have to register or play a game of rps! Command: "hb register" to register!/ "hb rps" to play a game of rps!`
    }
}