const client= require("../client")
const database = require("../../database")
const util = require("../functions/functions")
const si = require('systeminformation');
const ATHandler=require("../functions/ATHandler")
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
    async (channel,user,messageparts)=>{
        let currentTemp;
        let uptime = process.uptime()
        .toString()
        .replace(/\.[^.]*$/,"")
        *1000;
        let response = await database.selectWhere(
            "*",
            "CHANNELS"
            ,"CURR_CONNECTED"
            ,"1")
        let watchchannels = await database.select(
            "*",
            "WATCHCHANNELS")
        await si.cpuTemperature()
        .then((value)=>{
            currentTemp=value.main;
        })
        .catch((reason)=>{
            currentTemp= "unknown"
        })
        let mem = Math.round(process.memoryUsage().rss*0.000001)
        return `Pong! Uptime: ${util.shortenTime(uptime)}! Chat latency: ${await client.ping()*1000}ms! Bot available in ${response.length} channels! Currently tracking ${watchchannels.length} channels! Current CPU-Temperature: ${currentTemp}°C! Running on ${process.platform}! Memory usage: ${mem}mb`;
    }
}