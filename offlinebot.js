const database = require('./database');
database.connect();
const client = require('./lib/client.js');
const watchclient = require("./lib/watchclient");
require('dotenv').config();
const got = require('got')
const updatecmd = require("./lib/functions/updateCommandsDatabase")
require("./lib/functions/rpsgamehandler")
require("./lib/functions/runningrpsgames")
updatecmd();

var emoteJSON={}
