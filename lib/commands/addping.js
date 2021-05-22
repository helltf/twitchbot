const {getRegexExp} = require("./../functions/functions")
const database = require("./../../database")
module.exports={
    description:"Adds an additional ping for your account",
    name: "addping",
    required_permissions: 1,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: async(channel,{username},[ping])=>{

        if(!ping) return
        if(!await database.isRegisteredForPing(username)) return `You are not registered for ping module. Register with hb register ping`
        let pingregex = getRegexExp(ping)
        let {regex} = await database.getLastPing(username)
        let singleRegex = regex.split("|")
        if(simpleRegex.length===3) return `max ping reached`
        if(singleRegex.includes(pingregex)) return `Regex ist already used`
        

    }
}