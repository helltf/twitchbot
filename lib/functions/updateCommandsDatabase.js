const database = require("../../database")
const requireDir = require('require-dir');
const commands = requireDir('./../commands');
const chalk = require("chalk")
const commandhex = "#A0522D"
const deleteOldCommands = async()=>{
    let currentcommands=[];
    let response = await database.select("NAME","COMMANDS")
    for(let [commandname, commandinfo]of Object.entries(commands)){
        currentcommands.push(commandname)
    }
    response.forEach(command => {
      if(!currentcommands.includes(command.NAME.toLowerCase())){
        database.remove("COMMANDS","NAME",command.NAME)
        console.log(`${chalk.hex(commandhex).bold("[COMMAND]")} ${chalk.hex("#3f888f").bold("[REMOVED]")} ${chalk.yellow(`[${command.NAME}]`)}`)
      }
    });
    console.log(`${chalk.hex(commandhex).bold("[COMMAND]")} ${chalk.hex("#FF00FF").bold("[DELETING]")} ${chalk.green("[SUCCESSFUL]")}`)
  }
  
  const updateCommandData = async()=>{
    for(let [commandname, commandinfo]of Object.entries(commands)){
      let currentcommandinfo = await database.selectWhere("*","COMMANDS","NAME",commandname)
      if(currentcommandinfo===undefined) { 
      database.insert("COMMANDS","NAME,COUNTER,REQUIRED_PERMISSIONS,DESCRIPTION,REQUIRED_PARAMETERS",(`'${commandinfo.name.toUpperCase()}','0','${commandinfo.required_permissions}','${commandinfo.description}','${commandinfo.required_parameters}'`))
      console.log(`${chalk.hex(commandhex).bold("[COMMAND]")} ${chalk.hex("#3f888f").bold("[UPDATED]")} ${chalk.yellow(`[${commandinfo.name.toUpperCase()}]`)}`)
    }else{
        for(let [name,data] of Object.entries(commandinfo)){
          if(name==="name")data=data.toUpperCase();
          if(data!=currentcommandinfo[0][name.toUpperCase()]&&name!="invocation"){
              if(data===undefined)data="none"
            console.log(`${chalk.hex(commandhex).bold("[COMMAND]")} ${chalk.hex("#3f888f").bold("[UPDATED]")} ${chalk.yellow(`[${name.toUpperCase()}]`)}`)
            database.updateWhere("COMMANDS",name.toUpperCase(),data,"NAME",commandname)
          }
        }
      }
    }
    console.log(`${chalk.hex(commandhex).bold("[COMMAND]")} ${chalk.hex("#FF00FF").bold("[UPDATING]")} ${chalk.green("[SUCCESSFUL]")}`)
  }
 updateCommands = async()=>{
      updateCommandData();
      deleteOldCommands();
    }
module.exports= updateCommands;
  