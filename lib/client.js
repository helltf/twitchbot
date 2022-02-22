const config = require('../config.json')
const chalk = require('chalk')
const tmi = require('tmi.js')
const client = new tmi.Client(config)
const database = require('../database.js')
const requireDir = require('require-dir')
const commands = requireDir('./commands')
const util = require('./functions/functions')
const {eventEmitter, wordleEvent} = require('../lib/functions/eventEmitter')
const { watchclient } = require('./watchclient')

client.on('connected', () => {
	printSuccesfulConnection()
	joinChannel()
})

client.on('part', (channel, username, self) => {
	if (!self) return;

	channel = channel.replace('#', '')
	
	database.updateWhere(
		'channels',
		'CURR_CONNECTED',
		'0',
		'CHANNEL_NAME',
		channel
	)
})

client.on('join', async (channel, user, self) => {
	channel = channel.replace('#', '')
	if (self) {
		let response = await database.selectWhere(
			'*',
			'channels',
			'CHANNEL_NAME',
			channel
		)
		
		if(!await database.isWatchChannel(channel))
		watchclient.join(channel)

		if (response) {
			let [{TIMES_CONNECTED:timesconnected}] = response
			
			return database.updateWhere(
				'channels',
				'TIMES_CONNECTED',
				timesconnected + 1,
				'CHANNEL_NAME',
				channel
			)
		}
			util.addChannel(channel)
	}
})
client.on('chat', async (channel, user, message, self) => {
	if (self) return

	channel = channel.replace('#', '')
	let [prefix, command, ...data] = message.replace(/\s{2,}/g," ").toLowerCase().split(' ')

	user.username = user.username.toLowerCase()

	if (!prefix?.toLowerCase()?.startsWith('hb')) return

	let userpermissions = await util.getPermissions(user)

	util.registerUser(user)

	if (!commands[command] || !userpermissions) return

	//check userpermissions
	if (commands[command].required_permissions > userpermissions) return

	//running the code for a certain command
	let result = await commands[command].invocation(channel, user, data)
	database.incrementCommandCounter(command.toUpperCase())

	//send message if allowed
	sendAllowedMessage(channel, result)
})

client.on('whisper', (from, user, message, self) => {
	message = message.toLowerCase()
	if (message.search(/^rock$|^paper$|^scissors$/) != -1) {
		eventEmitter.emit('rpswhisper', message, user)
	}
})

client.on('chat', (channel, user, message, self) => {
	if (self || games.emote.length === 0) return

	channel = channel.replace('#', '')

	if (
		games.emote.some((game) => {
			return game.channel === channel
		})
	) {
		let index = games.emote.findIndex((game) => game.channel === channel)
		eventEmitter.emit('emotegame', games.emote[index], user, message)
	}
})

const joinChannel = async () => {
	let joinedChannels =  await database.getConnectedChannels()
	
	if (process.env.IS_RASPI === 'false') return client.join('helltf')
	
	for await (let {CHANNEL_NAME: channel} of  joinedChannels) {
		util.updateChannelInfoDatabase(channel)
		await client.join(channel).catch((reason) => {
			console.log(`couldnt join ${channel}. Reason: ${reason}`)
			if(reason === "msg_channel_suspended")
			hb.queryBuilder.update("channels")
			.set(["CURR_CONNECTED", 0])
			.where("CHANNEL_NAME",channel)
			.query()
		})
		await util.timer(1000)
	}
}

eventEmitter.on('rpsfinished', async (message, channel) => {
	sendAllowedMessage(channel, message)
})

eventEmitter.on('emotegameexceeded', (channel, time) => {
	sendAllowedMessage(
		channel,
		`The Bttvgame has been canceled, because the game exceeded the timelimit of ${
			time / 1000 / 60
		}min!`
	)
})

eventEmitter.on('emotegamefinished', (user, channel, emote) => {
	sendAllowedMessage(
		channel,
		`${user.username} has guessed the Emote PogChamp The emote was ${emote}`
	)
})

eventEmitter.on('emotegamerightguess', (message, game, letter, user) => {
	sendAllowedMessage(
		game.channel,
		`The letter ${letter} has been guessed! ${message}`
	)
})

const sendAllowedMessage = async (channel, message) => {
	let { allowed, allowed_live } = await database.getAllowed(channel)

	if (allowed && allowed_live && message != undefined) {
		process.env.ENVIRONMENT === "prod" 
		? client.say(channel, `${message}`) 
		: console.log(channel, `${message}`)
	}
}

const startClient = async () => {
	await client.connect().catch((reason) => {
		console.log(
			`${chalk.yellow('[NORMAL CLIENT]')} ${chalk.magenta(
				'[TWITCH]'
			)}${chalk.gray('[CONNECTION]')} ${chalk.red('[FAILED]')}`
		)
	})
}

process.on('uncaughtException', (err) => {
	//client.say('helltf', 'monkaS helltf')
	console.log(err)
})
process.on('unhandledRejection', (err) => {
	//client.say('helltf', 'monkaS helltf')
	console.log(err)
})

function printSuccesfulConnection(){
	console.log(
		`${chalk.yellow('[NORMAL CLIENT]')} ${chalk.magenta(
			'[TWITCH]'
		)}${chalk.gray('[CONNECTION]')} ${chalk.green('[SUCCESSFUL]')}`
	)
}
client.on("chat", (channel, user, message, self)=>{
	if(!self){
		wordleEvent.emit('input', channel.replace("#",""), user, message)
	}
})
module.exports = { client, sendAllowedMessage, startClient }
