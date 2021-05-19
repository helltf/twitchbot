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
        if(!command)return
        let commandsdata = await database.selectWhere("*","COMMANDS","NAME",commandname)
        if(!commandsdata) return "Couldn't find the given command in my database"
        commandsdata=commandsdata[0]
        let optional_parameters=commandsdata.OPTIONAL_PARAMETERS;
        return `Given Command: ${commandsdata.NAME.toLowerCase()}! Short discription of the command: ${commandsdata.DESCRIPTION}! Required permissions: ${commandsdata.REQUIRED_PERMISSIONS} Command used: ${commandsdata.COUNTER} times! Required parameters: [${commandsdata.REQUIRED_PARAMETERS}] Optional parameters: [${optional_parameters}]` ;
    }
}