const database = require('../../database');

module.exports={
    description:"Gives you an info about the given command",
    name: "commandinfo",
    required_parameters:"command",
    required_permissions: 1,
    invocation: async(channel,user,messageparts)=>{
        let message="";
        let commandname = messageparts[0]
        let commandsdata = await database.selectWhere("*","COMMANDS","NAME",commandname)
        if(commandsdata===undefined)return "Couldn't find the given command in my database"
        message=`Given Command: ${commandsdata[0].NAME.toLowerCase()}! Short discription of the command: ${commandsdata[0].DESCRIPTION}! Required permissions: ${commandsdata[0].REQUIRED_PERMISSIONS} Required parameters: [${commandsdata[0].REQUIRED_PARAMETERS}]` ;
        return message;
    }
}