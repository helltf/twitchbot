const database = require('../../database');
const client= require("../client");
const chalk = require('chalk');
const util = require('../functions/functions')
/**
 * @author helltf
 */
module.exports={
    description:"Used to make the mainclient leave a channel!",
    required_parameters:"channel",
    name: "leave",
    required_permissions: 3,
    invocation: async(channel,user,messageparts)=>{
        let leavechannel = messageparts[0];

        let message= "";

        let trackedchannel = await database.selectWhere("*","CHANNELS","CHANNEL_NAME",leavechannel)

        if(trackedchannel!=undefined&&trackedchannel[0].CURR_CONNECTED){
            await client.leave(leavechannel).then((value)=>{
                message=`Successfully parted from channel: ${leavechannel}!`
            }).catch((reason)=>{
                console.log(`${chalk.red("Couldn't part from channel")} ${chalk.green(leavechannel)} ${chalk.red("because")} ${chalk.red(reason)}`)
                message=`Couldn't part from channel: ${leavechannel} because ${reason}!`
            })
        }else{
            message=`Sorry but I'm not in this channel!`
        }
        return message
    }
}