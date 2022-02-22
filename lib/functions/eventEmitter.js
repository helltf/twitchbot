const {EventEmitter} = require("events")
const eventEmitter = new EventEmitter();
const wordleEvent = new EventEmitter();

module.exports={eventEmitter, wordleEvent};