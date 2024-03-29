const util = require("../functions/functions")

/**
 * @author helltf
 */
module.exports={
    "name":"chatstats",
    "description":"Checks if the given user is in the top 100 stats",
    required_permissions:1,
    required_parameters:"user channel",
    optional_parameters:"none",
    invocation: async(channel, user,[lookupuser, lookupchannel])=>{
        if(!lookupchannel && !lookupuser) return

        lookupchannel = lookupchannel.toLowerCase()
        lookupuser = lookupuser.toLowerCase()

        const options={
            url:`https://api.streamelements.com/kappa/v2/chatstats/${lookupchannel}/stats`,
            method:'GET',
            headers:{
                'Authorization': `Bearer ${process.env.BEARERTOKEN}` ,
                Accept: 'application/json'
        }
    }
        let stats = await util.getRequest(options)
        .catch((reason)=>{
            console.log(reason)
        })
        if(!stats?.chatters) return `No stats provided`
        let index = stats.chatters.findIndex(user => user.name === lookupuser)
            
            if(index===-1) 
                return `Couldn't find ${lookupuser} in top 100 of ${lookupchannel}`

            return `Found user ${lookupuser}! Sent messages: ${stats.chatters[index].amount}! Leaderbordposition: ${index+1}!`
            
    }
}