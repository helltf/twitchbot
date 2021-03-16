const database = require("../../database")

module.exports={
    description:"Gives you a list containing all available commands",
    name: "commandlist",
    required_parameters:"none",
    required_permissions: 1,
    invocation: async(channel,user,messageparts)=>{
        let message="All available commands are: ";
        let commandsname = await database.select("NAME","COMMANDS")
        commandsname.forEach(element => {
            message+=element.NAME.toLowerCase() +", "
        });
        message=message.substring(0,message.length-2)
        return message;
    }
}