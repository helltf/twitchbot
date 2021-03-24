const eventEmitter = require("../functions/eventEmitter")
const runningEmoteGames = require("./../functions/runningEmoteGames").runningEmoteGames
const util = require("../functions/functions")
const database = require("../../database")
eventEmitter.on('emotegame',(game,user,message)=>{
    let emote = game.emote

    if(!(message.length===1||message.length===emote.length))return

    if(emote.toLowerCase()===message.toLowerCase()){
        eventEmitter.emit("emotegamefinished",user,game.channel,game.emote)
        runningEmoteGames.splice(runningEmoteGames.indexOf(game),1)

    }else if(emote.toLowerCase().includes(message.toLowerCase())&&!game.letterguessed.toLowerCase().includes(message)){
        eventEmitter.emit("emotegameupdate",game,user,message)
    }
})
eventEmitter.on('emotegameupdate',(game,user,message)=>{
    message = message
    let emote = game.emote
    let splitted = game.letterguessed.split(/\s/)
    let indeces = util.getIndicesOf(message,emote,false)

    indeces.forEach((index)=>{
        var rightCaseletter = emote.charAt(index)
        splitted[index]=rightCaseletter
    })

    let newguessed="";
    splitted.forEach((letter) => {
        newguessed+=letter+" "
    });

    newguessed=newguessed.substring(0,newguessed.length-1)

    if(newguessed.replace(/\s/g,"").toLocaleLowerCase()===emote.toLocaleLowerCase()) {
        eventEmitter.emit("emotegamefinished",user,game.channel,game.emote)
        runningEmoteGames.splice(runningEmoteGames.indexOf(game),1)
    }else{
        game.letterguessed=newguessed
        eventEmitter.emit("emotegamerightguess",newguessed,game,message,user)
    }
})
eventEmitter.on("emotegamefinished",async(user,game,channel,emote)=>{
    let id = user["user-id"]
    let response = database.selectWhere("*","EMOTEGAME_STATS","TWITCH_ID",id)
    if(response!=undefined){
        database.updateWhere("EMOTEGAME_STATS","EMOTES_GUESSED",`'${response[0].EMOTES_GUESSED+1}'`,"TWITCH_ID",id)
    }
    else{
        database.insert("EMOTEGAME_STATS","TWITCH_ID,LETTERS_GUESSED,EMOTES_GUESSED",`'${id}','${0}','${1}'`)
    }
})
eventEmitter.on("emotegamerightguess",async(newguessed,game,message,user)=>{
    let id = user["user-id"]
    let response = database.selectWhere("*","EMOTEGAME_STATS","TWITCH_ID",id)
    if(response!=undefined){
        database.updateWhere("EMOTEGAME_STATS","LETTERS_GUESSED",`'${response[0].LETTERS_GUESSED+1}'`,"TWITCH_ID",id)
    }
    else{
        database.insert("EMOTEGAME_STATS","TWITCH_ID,LETTERS_GUESSED,EMOTES_GUESSED",`'${id}','${1}','${0}'`)
    }
})