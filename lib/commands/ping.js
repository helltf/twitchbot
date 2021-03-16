const client= require("../client")
const humanizeDuration = require("humanize-duration");
const database = require("../../database")
const util = require("../functions/functions")

module.exports={
    description:"Just a Ping command 4Head",
    name:"ping",
    required_permissions:1,
    invocation: 
    async (channel,user,messageparts)=>{
        let response = await database.selectWhere("*","CHANNELS","CURR_CONNECTED","1")
        let watchchannels = await database.select("*","WATCHCHANNELS")
        let uptime = process.uptime().toString().replace(/\.[^.]*$/,"")*1000;
        return `Pong! Uptime: ${util.shortenTime(humanizeDuration(uptime))}! Chat latency: ${await client.ping()}! Bot available in ${response.length} channels! Currently tracking ${watchchannels.length} channels! `;
    }
}