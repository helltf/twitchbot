
const database = require("./../../database")

module.exports={
    description:"Provides your stats for cookie/rps/emotegame",
    name:"stats",
    required_permissions:1,
    required_parameters:"stats",
    optional_parameters:"user",
    invocation: 
    async (channel, {"user-id":user_id, username}, [event, lookupUser])=>{
        if(!event || event.search(/^cookie$|^rps$|^emotegame$/)===-1) return

        let lookupID= lookupUser!=undefined ? await database.getUserInfo(lookupUser) : user_id
        if(event==="cookie") lookupID = lookupUser!= undefined ? lookupUser : username
        
        if(!lookupID) return `User couldn't be found in the database`
            return await events[event](lookupID)
       }
}

const events = {
    cookie : async (lookupUser)=>{
        let stats = await database.getCookieStats(lookupUser)
        let resets = await database.getCookieResetStats(lookupUser)

        if(!stats) return `This user has no stats recorded`

        resets = resets!=undefined ? resets.length : 0
        let average = hb.util.getAverage(stats.map(element => element.AMOUNT))

        return `${lookupUser} claimed the last cookie ${hb.util.shortenTime(Date.now()-stats[0].TIME)} ago. Average recieved cookies ${average}. Cookie resets bought ${resets}` 
    },

    rps: async (lookupID)=>{
        return `Not supported at the moment`
    },

    emotegame : async (lookupID)=>{
        return `Not supported at the moment`
    }
}