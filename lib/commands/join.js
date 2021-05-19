const database = require('../../database');
const chalk = require("chalk")

/**
 * @author helltf
 */

module.exports={
    description:"Used to make the mainclient join a new channel!",
    required_parameters:"channel",
    name: "join",
    required_permissions: 3,
    optional_parameters:"none",
    invocation: 
    async(channel,user,[newchannel])=>{
        if(await database.isConnected(newchannel)) return `Sorry but I'm already in this channel!`;

        return await hb.client.join(newchannel)
            .then(()=>{
               database.setCurrentlyConnected(1,newchannel)
                return `Successfully joined the channel: ${newchannel}`
            })

            .catch((reason)=>{
                console.log(`${chalk.red("Couldn't join the channel")} ${chalk.green(newchannel)} because ${reason}`)
                return `Couldn't join the channel: ${newchannel}! Reason: ${reason}`
            })
    } 
}