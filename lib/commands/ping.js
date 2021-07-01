
const database = require("../../database")
const util = require("../functions/functions")
const si = require('systeminformation');
/**
 * @author helltf
 */
module.exports={
    description:"Just a Ping command 4Head",
    name:"ping",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: 
    async ()=>{
        let uptime = process.uptime().toString().replace(/\.[^.]*$/,"")*1000;
        let watchchannels = await database.getAllWatchChannels()
        let channels = await database.getConnectedChannels()
        let temperature = (await si.cpuTemperature()).main
        let mem =  Math.round(process. memoryUsage(). heapUsed / 1024 / 1024)

        return `Pong! Uptime: ${util.shortenTime(uptime)}! Chat latency: ${await hb.client.ping()*1000}ms! Bot available in ${channels.length} channels! Currently tracking ${watchchannels.length} channels! Current CPU-Temperature: ${temperature}°C! Running on ${process.platform}! Memory usage: ${mem}mb`;
    }
}