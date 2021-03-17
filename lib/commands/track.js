const database = require('../../database');
const client= require("../watchclient")
const chalk = require("chalk")
const util = require('../functions/functions')
/**
 * @author helltf
 */
module.exports={
    description:"Used to make the watch client join a new channel to track!",
    required_parameters:"channel",
    name: "track",
    required_permissions: 1,
    invocation: async(channel,user,messageparts)=>{
        let newchannel = messageparts[0];
        let message = "";
        let trackedchannel = await database.selectWhere("CHANNEL_NAME","WATCHCHANNELS","CHANNEL_NAME",newchannel)
        if(trackedchannel===undefined){
           await client.join(newchannel).then((value)=>{
                message=`Successfully joined to track the channel: ${newchannel}`
            }).catch((reason)=>{
                console.log(`${chalk.red("Couldn't join to track the channel")} ${chalk.green(newchannel)} because ${reason}`)
                message=`Couldn't join to track the channel: ${newchannel} because ${reason}`
            })
        }else{
            message=`Sorry but I'm already tracking this channel`
        }
        return message;
    } 
}