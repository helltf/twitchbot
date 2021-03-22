const database = require("./../../database")

module.exports={
    name:"rps",
    description:"play a game of rock, paper, scissors vs. the bot",
    required_permissions:1,
    required_parameters:"[rock/paper/scissor]",
    invocation:
    async(channel,user,messageparts)=>{
        if(messageparts[0]===undefined)return;
        let useraktion = messageparts[0].toLowerCase();
        if(useraktion.search(/^rock$|^paper$|^scissor$/)===-1)return;
        let message= ""
        let possiblebotaktions = ["rock","paper","scissor"]
        let user_id=user["user-id"]
        let botaktion = possiblebotaktions[Math.floor(Math.random()*possiblebotaktions.length)]
        message=`Your decision: ${useraktion}! Bot's decision: ${botaktion}! `

        let response =await database.selectWhere("*","RPS_STATS","TWITCH_ID",user_id)
        if(response===undefined) await database.insert("RPS_STATS","TWITCH_ID,DRAW,WIN,LOSE",`'${user_id}','0','0','0'`)
        let currentstats = await database.selectWhere("*","RPS_STATS","TWITCH_ID",user_id)
        let drawstats=currentstats[0].DRAW
        let losestats=currentstats[0].LOSE
        let winstats=currentstats[0].WIN
        if(botaktion===useraktion){
            database.updateWhere("RPS_STATS","DRAW",drawstats+1,"TWITCH_ID",user_id)
            message+="Result: Draw :\\ "
        }
        else if(useraktion==="rock"){
            if(botaktion==="scissor"){
                message+="Result: bot lost LuL  "
                database.updateWhere("RPS_STATS","WIN",winstats+1,"TWITCH_ID",user_id)
            }else{
                message+="Result: bot won GlitchCat "
                database.updateWhere("RPS_STATS","LOSE",losestats+1,"TWITCH_ID",user_id)
            }
        }else if(useraktion==="paper"){
            if(botaktion==="scissor"){
                message+="Result: bot won GlitchCat "
                database.updateWhere("RPS_STATS","LOSE",losestats+1,"TWITCH_ID",user_id)
            }else{
                message+="Result: bot lost LuL  "
                database.updateWhere("RPS_STATS","WIN",winstats+1,"TWITCH_ID",user_id)
            }
        }else if(useraktion==="scissor"){
            if(botaktion==="rock"){
                message+="Result: bot won GlitchCat "
                database.updateWhere("RPS_STATS","LOSE",losestats+1,"TWITCH_ID",user_id)
            }else{
                message+="Result: bot lost LuL  "
                database.updateWhere("RPS_STATS","WIN",winstats+1,"TWITCH_ID",user_id)
            }
    }
    return message;
}
}