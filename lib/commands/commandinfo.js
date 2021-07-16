const database = require('../../database');
/**
 * @author helltf
 */
module.exports={
    description:"Gives you an info about the given command",
    name: "commandinfo",
    required_parameters:"command",
    required_permissions: 1,
    optional_parameters:"none",
    invocation: async(channel,user,[command])=>{
        if(!command) return
        let commandsdata = await database.selectWhere("*","commands","NAME",command)
        if(!commandsdata) return "Couldn't find the given command in my database"
        let [{OPTIONAL_PARAMETERS,NAME,REQUIRED_PERMISSIONS,COUNTER,REQUIRED_PARAMETERS,DESCRIPTION}]=commandsdata
        return `Given Command: ${NAME.toLowerCase()}! Short description of the command: ${DESCRIPTION}! Required permissions: ${REQUIRED_PERMISSIONS} Command used: ${COUNTER} times! Required parameters: [${REQUIRED_PARAMETERS}] Optional parameters: [${OPTIONAL_PARAMETERS}]` ;
    }
}