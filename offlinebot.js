#!/usr/bin/env node

const database = require('./database');
const requiredir = require("require-dir")
require('dotenv').config();
requiredir("./lib/functions")
requiredir("./lib/gamehandler")
require("./lib/watchclient");

const updateReadme = require("./lib/functions/updateReadMe")
const livestatus = require("./lib/notify/updatelivestatus")
const ATupdater = require("./lib/functions/ATHandler").updateAT
const updateCommands = require("./lib/functions/updateCommandsDatabase");
const { initEmotes ,updateEmotes} = require('./lib/notify/updateemotes');

global.games = {}
games.rps = []
games.emote = []

global.hb = {}
hb.client = require('./lib/client.js').client
hb.sendAllowedMessage = require('./lib/client.js').sendAllowedMessage
hb.startClient = require("./lib/client").startClient
hb.watchclient = require("./lib/watchclient").watchclient
hb.watchclient.startwatchClient = require("./lib/watchclient").startwatchClient
hb.database = require("./database")
hb.util = require("./lib/functions/functions")
hb.suggestions = []

requiredir("./modules/")

const start = async()=>{
    await database.connect(process.env.ENVIRONMENT);
    if(process.env.ENVIRONMENT==="test") return 
    await updateCommands();
    await updateReadme();
    await hb.startClient()
    await hb.watchclient.startwatchClient();
    await ATupdater()
    if(process.env.ENVIRONMENT === "dev") return

    startLiveUpdates()
    startEmoteUpdates()
    setInterval(ATupdater,3300000)
}
start();
const startLiveUpdates  =async ()=>{
    await livestatus.init()
    setInterval(livestatus.update,5000)
}
const startEmoteUpdates = async ()=>{
    await initEmotes()
    setInterval( updateEmotes,5000)
}