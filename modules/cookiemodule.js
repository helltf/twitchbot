const database = require("../database")

hb.watchclient.on("chat",(channel, user, message, self)=>{
    if(user["user-id"]!=425363834) return
    if(message.startsWith("[Cookies]")){
        let username =  message.match(/(?<=]\s)[^[].+(?=\s->)/)[0]
        let amount = parseInt(message.match(/(?<=\().+(?=\))/)[0])
        database.addNewCookieEvent(username, amount)
    }
    if(message.startsWith("[Shop]")){
        let username =  message.match(/(?<=]\s).+(?=,)/)
        database.addNewCookieReset(username)
    }
})