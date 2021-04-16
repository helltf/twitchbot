const database = require("../../database")

module.exports={
    name:"banstats",
    description:"Returnes the counter for bans tracked",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"user",
    invocation: 
    async(channel,user,messageparts)=>{
       let response = await database.select("*","BANNED_USER")
       return `Counter of tracked bans are ${response.length}`
    }
}