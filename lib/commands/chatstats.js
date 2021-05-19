const util = require("../functions/functions")

/**
 * @author helltf
 */
module.exports={
    "name":"streamelements",
    "description":"Checks the chatterlist of the streamer",
    required_permissions:1,
    required_parameters:"user channel",
    optional_parameters:"none",
    invocation: async(channel,user,[lookupuser,lookupchannel])=>{
        if(!lookupchannel && !lookupuser) return;
        const options={
            url:`https://api.streamelements.com/kappa/v2/chatstats/${lookupchannel}/stats`,
            method:'GET',
            headers:{
                'Authorization': `Bearer ${process.env.BEARERTOKEN}` ,
                Accept: 'application/json'
        }
    }
        let stats = await util.request(options)
        .catch((reason)=>{
            console.log(reason)
        })

        if(!stats) return `Couldn't fetch the data`

        let index = stats.chatters.findIndex(user=>user.name===lookupuser)
            
            if(index===-1) 
                return `Couldn't find ${lookupuser} in top 100 of ${lookupchannel}`

            return `Found user ${lookupuser}! Sent messages: ${stats.chatters[index].amount}! Leaderbordposition: ${index+1}!`
            
    }
}