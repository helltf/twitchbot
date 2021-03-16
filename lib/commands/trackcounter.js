const database = require("../../database")
module.exports={
    "name":"trackcounter",
    "description":"Gets the current amount of tracked channels across twitch",
    required_permissions: 1,
    invocation: async(channel,user,messageparts)=>{
        let response = await database.select("CHANNEL_NAME","WATCHCHANNELS")
        return `This bot is currently tracking ${response.length} channels`;
    }
}
