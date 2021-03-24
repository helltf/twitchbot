const util = require("../functions/functions")
let options={
        url:undefined,
        method:'GET',
        headers:{
            'Authorization': `Bearer ${process.env.BEARERTOKEN}` ,
            Accept: 'application/json'
    }
}
module.exports={
    "name":"streamelements",
    "description":"Checks the chatterlist of the streamer",
    required_permissions:1,
    required_parameters:"channel user",
    optional_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        if(messageparts[0]===undefined||messageparts[1]===undefined) return;
        let lookupchannel = messageparts[0];
        let lookupuser = messageparts[1];
        let message= ``;
        let amount;
        let url = `https://api.streamelements.com/kappa/v2/chatstats/${lookupchannel}/stats`
        options.url=url;
        await util.request(options)
        .then((value)=>{
            let counter=0;
            let hit = false;
            let position;
            value.chatters.forEach((element) => {
                counter++;
                if(element.name===lookupuser){
                    hit=true;
                    amount=element.amount;
                    position=counter
                    return;
                }    
            });
           if(hit){
               message=`Found user ${lookupuser}! Sent messages: ${amount}! Leaderbordposition: ${position}!`
            }else{
                message=`Couldn't find ${lookupuser} in top 100 of ${lookupchannel}`
        }
        })
        .catch((reason)=>{
             message=`Error occured :\\`
            console.log(reason)
        })
        return message;
    }
}