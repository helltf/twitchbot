const database = require("../database")

hb.watchclient.on("action",(channel,user,message,self)=>{
    if(user["user-id"]!=425363834) return
    channel = channel.replace("#","")
    if(message.startsWith("[Cookies]")){
        console.log(message)
        let username =  message.match(/(?<=]\s)[^[].+(?=\s->)/)[0]
        let amount = parseInt(message.match(/(?<=\().+(?=\))/)[0])
        database.addNewCookieEvent(username, amount, channel)
    }
    if(message.startsWith("[Shop]")){
        console.log(message)
        let username =  message.match(/(?<=]\s).+(?=,)/)[0]
        database.addNewCookieReset(username, channel)
    }
})