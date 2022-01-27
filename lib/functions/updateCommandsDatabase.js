const database = require("../../database")
const requireDir = require('require-dir');
const commands = requireDir('./../commands');
const chalk = require("chalk");

const checkForCommandUpdates = async()=>{
    let databaseCommands = await  database.getCommands();

    for(let [commandname, commandinfo]of Object.entries(commands)){
      let contains = databaseCommands.some((command)=>{return (command.NAME.toLowerCase()===commandname)})

      if(!contains) {
          database.addNewCommand(commandname, commandinfo)
          continue;
      }
      
      let index = databaseCommands.findIndex((elemtent)=>{ return elemtent.NAME === commandname.toUpperCase()})
      updateCommandData(commandname, databaseCommands[index], commandinfo)
    }
  }

  const updateCommandData= async(commandname, olddata, newdata)=>{
    for(let[key, value] of Object.entries(olddata)){
      if(key==="NAME"||key==="COUNTER"||key==="id") continue
      if(value!=newdata[key.toLowerCase()]){
        database.updateCommandValue(commandname, newdata[key.toLowerCase()], key)
      }
    }
  }
  deleteOldCommands=async()=>{
    let databaseCommands= await database.getCommands();
    for(let commandinfo of databaseCommands){
      let doesNotContain = commands[commandinfo.NAME.toLowerCase()]===undefined 
      if(doesNotContain) database.deleteCommand(commandinfo.NAME)
    }
  }

 module.exports = async()=>{
      await checkForCommandUpdates()
      console.log(`${chalk.hex("#A0522D").bold("[COMMAND]")} ${chalk.hex("#3f888f").bold("[UPDATING]")}${chalk.green("[SUCCESSFUL]")}`)
      await deleteOldCommands();
      console.log(`${chalk.hex("#A0522D").bold("[COMMAND]")} ${chalk.hex("#FF00FF").bold("[DELETING]")} ${chalk.green("[SUCCESSFUL]")}`)
    }
  