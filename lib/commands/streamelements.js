const util = require("../functions/functions")

/**
 * @author helltf
 */
module.exports={
    "name":"streamelements",
    "description":"Checks the chatterlist of the streamer",
    required_permissions:1,
    required_parameters:"channel user",
    optional_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        if(messageparts.length!=2) return;
        let lookupchannel = messageparts[0];
        const options={
            url:`https://api.streamelements.com/kappa/v2/chatstats/${lookupchannel}/stats`,
            method:'GET',
            headers:{
                'Authorization': `Bearer ${process.env.BEARERTOKEN}` ,
                Accept: 'application/json'
        }
    }
        let lookupuser = messageparts[1];
        let amount;
        let responseStats = await util.request(options)
        .catch((reason)=>{
            console.log(reason)
        })
            let counter=0;
            let hit = false;
            let position;
            responseStats.chatters.forEach((element) => {
                counter++;
                if(element.name===lookupuser){
                    hit=true;
                    amount=element.amount;
                    position=counter
                    return;
                }    
            });
           if(hit){
               return `Found user ${lookupuser}! Sent messages: ${amount}! Leaderbordposition: ${position}!`
            }
            return `Couldn't find ${lookupuser} in top 100 of ${lookupchannel}`
    }
}