module.exports={
    name:"limitnotification",
    description:"Sets limits for notifications",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"channel",
    invocation:async(channel, user, [streamer, event, ...flags])=>{
        if(!streamer || !event) return `Missing streamer or event. Use command like hb limitnotifications <streamer> <event> <flags>`
        let message = `Added flags for ${streamer} on ${event} events: `
        let messageFlags = []
        let  {ADDITIONAL_INFO:currentFlags} = (await hb.queryBuilder
        .select("ADDITIONAL_INFO")
        .from("NOTIFY")
        .where("TWITCH_ID", user["user-id"])
        .and("STREAMER", streamer)
        .query()).first()

        for(let flag of flags){
            flag = flag.replace(" ","")

            if(flag.search(/^[^:]*:[^:]*$/gmi)!=-1){
                [key, value] = flag.split(":")
                if(currentFlags[event] == undefined){
                    currentFlags[event] = "s"
                    console.log(currentFlags[event] )
                }
                 messageFlags.push([key, value])
            }else{
                return "no valid flags found"
            }
        }
        
        //return message + printMessageFlags(messageFlags)
    }
}

const printMessageFlags = (messageFlags)=>{
    let result = ""

    for(let flag of messageFlags){
        result += flag.join(":")+" "
    }
    return result
}