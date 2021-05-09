const database = require("../../database")
const fs = require("fs")

/**
 * Updates the README.md to show all available commands!
 */
module.exports=async()=>{
    if(process.env.IS_RASPI==="true")return 
    let response = await database.custom
    (`SELECT * 
    FROM COMMANDS 
    ORDER BY NAME ASC`)
    let file =fs.readFileSync("./README.md","utf-8")
    file = file.replace(/:\|\n.*/gms,"")+":|"
    response.forEach((command) => {
        file+=`\n${command.NAME} | ${command.REQUIRED_PERMISSIONS} | ${command.REQUIRED_PARAMETERS} | ${command.OPTIONAL_PARAMETERS} | ${command.DESCRIPTION}`
    });
    fs.writeFileSync("./README.md",file.replace(/\n([^\n]*)$/, '').replace(/!/g,""))
}