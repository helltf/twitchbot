const database = require('./database');
database.connect();
require('./lib/client.js');
equire("./lib/watchclient");
require('dotenv').config();
const updatecmd = require("./lib/functions/updateCommandsDatabase")
require("./lib/gamehandler/rpsgamehandler")
require("./lib/gamehandler/emotegamehandler")
require("./lib/functions/runningrpsgames")
require("./lib/functions/runningEmoteGames")
require("./lib/functions/updateReadMe")
updatecmd();