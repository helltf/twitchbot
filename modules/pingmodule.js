const database = require("./../database")

hb.watchclient.on('chat',async(channel,userstate,message,self)=>{
    if(self) return
    channel = channel.replace("#","")
    let pinguser = await database.getPingUser()
    for({username,user_id,regex} of pinguser){

        const matchRegex = new RegExp(regex,"gmi")
        let match = message.toLowerCase().match(matchRegex)
        if(match){
            database.updateLastPing(user_id,channel,match[0],userstate.username.toLowerCase())
        }
    }
})
