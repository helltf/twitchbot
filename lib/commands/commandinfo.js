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
    invocation: async(channel,user,messageparts)=>{
        let commandname = messageparts[0]
        let commandsdata = await database.selectWhere("*","COMMANDS","NAME",commandname)
        if(commandsdata===undefined)return "Couldn't find the given command in my database"
        let optional_parameters;
        if(commandsdata[0].OPTIONAL_PARAMETERS!=null){
            optional_parameters = commandsdata[0].OPTIONAL_PARAMETERS
        }else{
            optional_parameters="none"
        }
        return `Given Command: ${commandsdata[0].NAME.toLowerCase()}! Short discription of the command: ${commandsdata[0].DESCRIPTION}! Required permissions: ${commandsdata[0].REQUIRED_PERMISSIONS} Command used: ${commandsdata[0].COUNTER} times! Required parameters: [${commandsdata[0].REQUIRED_PARAMETERS}] Optional parameters: [${optional_parameters}]` ;
    }
}