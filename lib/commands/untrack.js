const database = require('../../database');
const chalk = require('chalk');
/**
 * @author helltf
 */
module.exports={
    description:"Used to make the watch client leave a channel!",
    required_parameters:"channel",
    name: "untrack",
    required_permissions: 1,
    optional_parameters:"none",
    invocation: async(channel,user,messageparts)=>{
        let leavechannel = messageparts[0];
        let message= ""
        let trackedchannel = await database.selectWhere("*","WATCHCHANNELS","CHANNEL_NAME",leavechannel)
        if(trackedchannel!=undefined){
            await hb.watchclient.part(leavechannel)
            .then((value)=>{
                message=`${leavechannel} will no longer be tracked!`
            })
            .catch((reason)=>{
                console.log(`${chalk.red("Couldn't part from channel")} ${chalk.green(leavechannel)} ${chalk.red("because")} ${chalk.red(reason)}`)
                message=`Couldn't part from channel: ${leavechannel} because ${reason}!`
            })
            return message;
        }
            return `Sorry but this channel is not tracked at the moment!`
    }
}