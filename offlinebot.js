const database = require('./database');
database.connect();
const client = require('./lib/client.js');
const watchclient = require("./lib/watchclient");
require('dotenv').config();
const got = require('got')
var mysql = require('mysql');
const updatecmd = require("./lib/functions/updateCommandsDatabase")
updatecmd();

var emoteJSON={}

let runningRpsGames=[]
module.exports.runningRpsGames=runningRpsGames;