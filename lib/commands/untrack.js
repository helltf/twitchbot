const database = require('../../database');
const client= require("../watchclient");
const chalk = require('chalk');
const util = require('../functions/functions')

module.exports={
    description:"Used to make the watch client leave a channel!",
    required_parameters:"channel",
    name: "untrack",
    required_permissions: 1,
    invocation: async(channel,user,messageparts)=>{
        let leavechannel = messageparts[0];
        let message= ""
        let trackedchannel = await database.query(`SELECT * FROM WATCHCHANNELS WHERE CHANNEL_NAME = '${leavechannel}'`)
        if(trackedchannel!=undefined){
            await client.leave(leavechannel).then((value)=>{
                message=`${leavechannel} will no longer be tracked!`
            }).catch((reason)=>{
                console.log(`${chalk.red("Couldn't part from channel")} ${chalk.green(leavechannel)} ${chalk.red("because")} ${chalk.red(reason)}`)
                message=`Couldn't part from channel: ${leavechannel} because ${reason}!`
            })
    
        }else{
            message=`Sorry but this channel is not tracked at the moment!`
        }
        return message
    }
}