const database = require("./../database")
const antiPingRegex = new RegExp("[\u034f\u2800(\u{e0000}\u{dc00})\u180e\ufeff\u2000-\u200d\u206D]","gu")

hb.watchclient.on('chat',async(channel,{username},message,self)=>{
    channel = channel.replace("#","")
    let pinguser = await database.getPingUser()
    for({username,user_id,regex} of pinguser){

        if(username===username.toLowerCase()) continue

        const matchRegex = new RegExp(regex,"gmi")
        let match = message.toLowerCase().replace(antiPingRegex,"").match(matchRegex)

        if(match){
            database.updateLastPing(user_id,channel,match[0].replace(/[\W]+/g,""),username.toLowerCase())
        }
    }
})
