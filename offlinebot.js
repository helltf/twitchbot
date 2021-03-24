const database = require('./database');
database.connect();
const client = require('./lib/client.js');
const watchclient = require("./lib/watchclient");
require('dotenv').config();
const got = require('got')
const updatecmd = require("./lib/functions/updateCommandsDatabase")
require("./lib/gamehandler/rpsgamehandler")
require("./lib/gamehandler/emotegamehandler")
require("./lib/functions/runningrpsgames")
require("./lib/functions/runningEmoteGames")
updatecmd();

var emoteJSON={}
