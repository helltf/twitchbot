const {getRegexExp} = require("./../functions/functions")
const database = require("./../../database")

module.exports={
    description:"Adds an additional ping for your account",
    name: "addping",
    required_permissions: 1,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: async(channel,{username,"user-id":id},[ping])=>{
        if(!ping) return
        if(!await database.isRegisteredForPing(id)) return `You are not registered for ping module. Register with hb register ping`
        let pingregex = getRegexExp(ping)
        let {regex} = await database.getLastPing(username)
        regex = regex.split("\\").join("\\\\")
        let singleRegex = regex.includes("|") ? regex.split("|") : [regex]
        if(singleRegex.length===3) return `max ping reached`
        if(singleRegex.includes(pingregex)) return `You already registered this phrase as a ping`
        singleRegex.push(pingregex)
        database.updateRegexForPing(id,singleRegex.join("|"))
    }
}