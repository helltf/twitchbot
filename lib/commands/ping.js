const client= require("../client")
const humanizeDuration = require("humanize-duration");
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
    invocation: 
    async (channel,user,messageparts)=>{
        let response = await database.selectWhere("*","CHANNELS","CURR_CONNECTED","1")
        let watchchannels = await database.select("*","WATCHCHANNELS")
        let currentTemp;
        let uptime = process.uptime()
        .toString()
        .replace(/\.[^.]*$/,"")
        *1000;
        await si.cpuTemperature()
        .then((value)=>{
            currentTemp=value.main;
        })
        .catch((reason)=>{
            currentTemp= "unknown"
        })
        return `Pong! Uptime: ${util.shortenTime(uptime)}! Chat latency: ${await client.ping()*1000}ms! Bot available in ${response.length} channels! Currently tracking ${watchchannels.length} channels! Current CPU-Temperature: ${currentTemp}`;
    }
}