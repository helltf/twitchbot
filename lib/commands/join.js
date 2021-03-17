const database = require('../../database');
const client= require("../client")
const chalk = require("chalk")
const util = require('../functions/functions')

/**
 * @author helltf
 */
module.exports={
    description:"Used to make the mainclient join a new channel!",
    required_parameters:"channel",
    name: "join",
    required_permissions: 3,
    invocation: async(channel,user,messageparts)=>{
        let newchannel = messageparts[0];
        let message = "";
        let trackedchannel = await database.selectWhere("*","CHANNELS","CHANNEL_NAME",newchannel)
        if(trackedchannel===undefined||!trackedchannel[0].CURR_CONNECTED){
           await client.join(newchannel).then((value)=>{
               database.updateWhere("CHANNELS","CURR_CONNECTED","1","CHANNEL_NAME",newchannel)
                message=`Successfully joined the channel: ${newchannel}`
            }).catch((reason)=>{
                console.log(`${chalk.red("Couldn't join the channel")} ${chalk.green(newchannel)} because ${reason}`)
                message=`Couldn't join the channel: ${newchannel} because ${reason}`
            })
        }else{
            message=`Sorry but I'm already in this channel!`
        }
        return message;
    } 
}