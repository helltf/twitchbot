const database = require("../../database")
const requireDir = require('require-dir');
const commands = requireDir('./../commands');
const chalk = require("chalk");
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

      let databasecommandinfo = await database.selectWhere("*","COMMANDS","NAME",commandname)
      if(databasecommandinfo===undefined) { 
        let optional_parameters;
        if(commandinfo.optional_parameters===undefined){
          optional_parameters="none"
        }else{
          optional_parameters=commandinfo.optional_parameters;
        }
      database.insert("COMMANDS","NAME,COUNTER,REQUIRED_PERMISSIONS,DESCRIPTION,REQUIRED_PARAMETERS,OPTIONAL_PARAMETERS",(`'${commandinfo.name.toUpperCase()}','0','${commandinfo.required_permissions}','${commandinfo.description}','${commandinfo.required_parameters}','${optional_parameters}'`))
      console.log(`${chalk.hex(commandhex).bold("[COMMAND]")} ${chalk.hex("#3f888f").bold("[ADDED]")} ${chalk.yellow(`[${commandinfo.name.toUpperCase()}]`)}`)
    }else{
        for(let [key,data] of Object.entries(commandinfo)){
          if(key==="name")data=data.toUpperCase();
          if(data!=databasecommandinfo[0][key.toUpperCase()]&&key!="invocation"){
            
              if(data===undefined)data="none"
            console.log(`${chalk.hex(commandhex).bold("[COMMAND]")} ${chalk.hex("#3f888f").bold("[UPDATED]")} ${chalk.yellow(`[${key.toUpperCase()}]`)}`)
            database.updateWhere("COMMANDS",key.toUpperCase(),data,"NAME",commandname)
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
  