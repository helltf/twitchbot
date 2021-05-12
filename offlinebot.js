#!/usr/bin/env node

const database = require('./database');
const requiredir = require("require-dir")
require('dotenv').config();
requiredir("./lib/functions")
requiredir("./lib/gamehandler")
require("./lib/watchclient");
const updateReadme=require("./lib/functions/updateReadMe")
const livestatus = require("./lib/notify/updatelivestatus")
const ATupdater = require("./lib/functions/ATHandler").updateAT
const updatecmd = require("./lib/functions/updateCommandsDatabase")
const addChannelsToWatchchannels=require("./lib/functions/updateWatchchannels");

global.hb = {}
hb.client=require('./lib/client.js').client
hb.sendAllowedMessage=require('./lib/client.js').sendAllowedMessage
hb.startClient=require("./lib/client").startClient
hb.watchclient=require("./lib/watchclient").watchclient
hb.watchclient.startwatchClient=require("./lib/watchclient").startwatchClient

const start = async()=>{
    await database.connect(process.env.ENVIRONMENT);
    if(process.env.ENVIRONMENT==="test") return;
    await updatecmd();
    await updateReadme();
    await addChannelsToWatchchannels()
    await hb.startClient()
    await hb.watchclient.startwatchClient();
    await ATupdater()
    await livestatus.init()
    
    setInterval(livestatus.update,5000)
    setInterval(ATupdater,3300000)
}
start();
