const database = require('../../database');
const chalk = require("chalk")
/**
 * @author helltf
 */
module.exports={
    description:"Used to make the watch client join a new channel to track!",
    required_parameters:"channel",
    name: "track",
    required_permissions: 1,
    optional_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        let newchannel = messageparts[0];
        let message = "";
        let trackedchannel = await database.selectWhere("CHANNEL_NAME","WATCHCHANNELS","CHANNEL_NAME",newchannel)
        if(!trackedchannel){
           await hb.watchclient.join(newchannel)
           .then((value)=>{
                message=`Successfully joined to track the channel: ${newchannel}`
            })
            .catch((reason)=>{
                console.log(`${chalk.red("Couldn't join to track the channel")} ${chalk.green(newchannel)} because ${reason}`)
                message=`Couldn't join to track the channel: ${newchannel} because ${reason}`
            })
            return message;
        }
            return`Sorry but I'm already tracking this channel`
    } 
}