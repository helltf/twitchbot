const database = require("../../database")

module.exports={
    name:"emotegamestats",
    description:"Provides your stats for emotegames",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"username",
    invocation:
    async(channel,user,messageparts)=>{
        let user_id = user["user-id"]
        let response = await database.selectJoin("*","EMOTEGAME_STATS","TWITCH_USER","EMOTEGAME_STATS.TWITCH_ID","TWITCH_USER.TWITCH_ID","EMOTEGAME_STATS.TWITCH_ID",user_id)
        if(response!=undefined){       
            let letters_guessed = response[0].LETTERS_GUESSED
            let emotes_guessed = response[0].EMOTES_GUESSED
        let leaderbordarray=[]
        let leaderbordresponse = await database.custom(`
        SELECT  * 
        FROM TWITCH_USER 
        JOIN EMOTEGAME_STATS ON  
        TWITCH_USER.TWITCH_ID = EMOTEGAME_STATS.TWITCH_ID
        ORDER BY EMOTEGAME_STATS.EMOTES_GUESSED DESC`)
        console.log(leaderbordresponse)
        leaderbordresponse.forEach(user => {
            leaderbordarray.push(user.USERNAME)
        });
           return `Your stats for Emotegame are: LETTERS guessed: ${letters_guessed}! EMOTES guessed: ${emotes_guessed}! Current leaderboardposition: ${leaderbordarray.indexOf(user.username.toLowerCase())+1}!`
       }else{
           return `Sorry but to reveal your stats you have to register or play a emotegame! Command: "hb register" to register!/ "hb emotegame" to play the emotegame!`
       }
    }
}