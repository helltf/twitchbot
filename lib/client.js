const config = require('../config.json')
const chalk = require('chalk')
const tmi = require('tmi.js')
const client = new tmi.Client(config)
const database = require('../database.js')
const requireDir = require('require-dir')
const commands = requireDir('./commands')
const util = require('./functions/functions')
const eventEmitter = require('../lib/functions/eventEmitter')
const { watchclient } = require('./watchclient')

client.on('connected', () => {
	console.log(
		`${chalk.yellow('[NORMAL CLIENT]')} ${chalk.magenta(
			'[TWITCH]'
		)}${chalk.gray('[CONNECTION]')} ${chalk.green('[SUCCESSFUL]')}`
	)
	joinChannel()
})

client.on('part', (channel, username, self) => {
	channel = channel.replace('#', '')
	if (!self) return
	database.updateWhere(
		'CHANNELS',
		'CURR_CONNECTED',
		'0',
		'CHANNEL_NAME',
		channel
	)
	console.log(
		`${chalk.yellow('[NORMAL CLIENT]')} ${chalk.red('[PARTED]')} ${chalk.green(
			'['
		)}${chalk.green(channel.replace('#', '').toUpperCase())}${chalk.green(']')}`
	)
})

client.on('join', async (channel, user, self) => {
	channel = channel.replace('#', '')
	if (self) {
		console.log(
			`${chalk.yellow('[NORMAL CLIENT]')} ${chalk
				.hex('#800080')
				.bold('[JOINED]')} ${chalk.hex('#96ffcb').bold('[')}${chalk
				.hex('#96ffcb')
				.bold(channel.replace('#', '').toUpperCase())}${chalk
				.hex('#96ffcb')
				.bold(']')}`
		)
		let response = await database.selectWhere(
			'*',
			'CHANNELS',
			'CHANNEL_NAME',
			channel
		)
		
		if(!await database.isWatchChannel(channel))
		watchclient.join(channel)

		if (response) {
			let [{TIMES_CONNECTED:timesconnected}] = response
			return database.updateWhere(
				'CHANNELS',
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
	let messageparts = message.split(' ')
	user.username = user.username.toLowerCase()

	if (!message.toLowerCase().startsWith('hb')) return

	let userpermissions = await util.getPermissions(user)
	let command

	if (messageparts[1]) command = messageparts[1].toLowerCase()
	messageparts.splice(0, 2).map((value) => value.toLowerCase())
	util.registerUser(user)

	if (!commands[command] || !userpermissions) return

	//check userpermissions
	if (commands[command].required_permissions > userpermissions) return

	//running the code for a certain command
	let result = await commands[command].invocation(channel, user, messageparts)
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
	let response = await database.getConnectedChannels()
	if (process.env.IS_RASPI === 'false') return client.join('helltf')
	for await (channel of response) {
		util.updateChannelInfoDatabase(channel.CHANNEL_NAME)
		await client.join(channel.CHANNEL_NAME).catch((reason) => {
			console.log(reason)
		})
		await util.timer(150)
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
		`The letter ${letter} has been guessed!  ${message}`
	)
})
const sendAllowedMessage = async (channel, message) => {
	let { allowed, allowed_live } = await database.getAllowed(channel)
	if (allowed && allowed_live && message != undefined) {
		client.say(channel, `${message}`)
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
const getFlags = (message) => {
	let rawFlags = message.split(' ').splice(2)
	let flags = {}

	for (flag of rawFlags) {
		let [key, value] = flag.split(':')
		if (value != undefined) flags[key] = value.toLowerCase()
	}

	return flags
}
process.on('exit', () => {
	client.say('helltf', 'monkaS exit helltf')
})
process.on('uncaughtException', (err) => {
	client.say('helltf', 'monkaS uncaughtException helltf')
	console.log(err)
})
process.on('unhandledRejection', (err) => {
	client.say('helltf', 'monkaS unhandledRejection helltf')
	console.log(err)
})
process.on('beforeExit', (err) => {
	client.say('helltf', 'monkaS')
	console.log(err)
})

module.exports = { client, sendAllowedMessage, startClient }
