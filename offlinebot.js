const database = require('./database');
database.connect();
const requiredir = require("require-dir")

require('dotenv').config();
requiredir("./lib/functions")
requiredir("./lib/gamehandler")
let helltfbot = require('./lib/client.js');
let watchclient = require("./lib/watchclient");
const livestatus = require("./lib/notify/updatelivestatus")
const ATupdater = require("./lib/functions/ATHandler").updateAT
const updatecmd = require("./lib/functions/updateCommandsDatabase")
const addChannelsToWatchchannels=require("./lib/functions/updateWatchchannels")
const start = async()=>{
    updatecmd();    

    await addChannelsToWatchchannels()

    helltfbot.connect()
 
    watchclient.connect()
 
    await ATupdater()

   await livestatus.init()


    setInterval(livestatus.update,5000)
    
    setInterval(ATupdater,3300000)
}

start();
