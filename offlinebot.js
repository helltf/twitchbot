const database = require('./database');
database.connect();
const requiredir = require("require-dir")
require('./lib/client.js');
require("./lib/watchclient");
require('dotenv').config();
requiredir("./lib/functions")
requiredir("./lib/gamehandler")
const livestatus = require("./lib/notify/updatelivestatus")
const ATupdater = require("./lib/functions/ATHandler").updateAT
const updatecmd = require("./lib/functions/updateCommandsDatabase")
const start = async()=>{
    updatecmd();    

    await ATupdater()

   await livestatus.init()

    setInterval(livestatus.update,5000)
    
    setInterval(ATupdater,3300000)
}

start();
