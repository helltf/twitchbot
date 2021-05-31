const mysql = require('mysql')
const chalk = require('chalk')
require('dotenv').config()

const twitchdatabase = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	charset: 'utf8mb4'
})

const testdatabase = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.TESTDATABASE
})
module.exports.connect = ENVIRONMENT => {
	return new Promise((resolve, reject) => {
		if (ENVIRONMENT != 'test') {
			twitchdatabase.connect(function (err) {
				if (err) {
					console.log(
						`${chalk.hex('#3f888f').bold('[DATABASE]')} ${chalk.gray(
							'[CONNECTION]'
						)} ${chalk.red('[NOT SUCCESSFUL]')}`
					)
					reject(err)
				}
				resolve()
				console.log(
					`${chalk.hex('#3f888f').bold('[DATABASE]')} ${chalk.gray(
						'[CONNECTION]'
					)} ${chalk.green('[SUCCESSFUL]')}`
				)
			})
		} else {
			testdatabase.connect(function (err) {
				if (err) {
					console.log(
						`${chalk.hex('#3f888f').bold('[DATABASE]')} ${chalk.gray(
							'[CONNECTION]'
						)} ${chalk.red('[NOT SUCCESSFUL]')}`
					)
					reject(err)
				}
				resolve()
				console.log(
					`${chalk.hex('#3f888f').bold('[TESTDATABASE]')} ${chalk.gray(
						'[CONNECTION]'
					)} ${chalk.green('[SUCCESSFUL]')}`
				)
			})
		}
	})
}
const getLastEmotes = async (event, channel) => {
	event = event.toUpperCase()
	let command = `SELECT LAST_${event} FROM EMOTES WHERE CHANNELNAME = '${channel}'`
	let result = await query(command)
	if(!result) return {}
	return JSON.parse(result[0][`LAST_${event}`])
}
module.exports.updateChannelInfoValue = async(key,value,channelname)=>{
	if(!value) return
	let command =`UPDATE CHANNEL_INFO SET ${key}=${mysql.escape(value.replace("'","\'"))} WHERE CHANNEL_NAME ='${channelname}'`
	return await query(command)
}
module.exports.getColorHistoryForUser = async (username)=>{
	let command = `SELECT * FROM COLOR_HISTORY JOIN TWITCH_USER ON COLOR_HISTORY.TWITCH_ID=TWITCH_USER.TWITCH_ID WHERE TWITCH_USER.USERNAME='${username}'`
	return await query(command)
}
module.exports.addIgnoredPingUser = async (id)=>{
	let command = `INSERT INTO IGNORED_PING_USER (TWITCH_ID) VALUES ('${id}')`
	return await query(command)
}
module.exports.getIgnoredPingUser = async ()=>{
	let command = `SELECT * FROM IGNORED_PING_USER`
	let result = await query(command)
	if(!result) return[]
	return result.map(user=>user.TWITCH_ID)
}
module.exports.getSuggestionForUser = async id => {
	let command = `SELECT ID FROM SUGGESTIONS WHERE TWITCH_ID ='${id}'`
	let result = await query(command)
	if (!result) return 0
	return result.length
}
module.exports.insertNewPing = async(user_id, channel, message, by_user)=>{
	let command = `INSERT INTO PINGS (TWITCH_ID,LAST_PING_CHANNEL, LAST_PING_TIME,BY_USER, MESSAGE) VALUES('${user_id}','${channel}','${Date.now()}','${by_user}',${mysql.escape(message)})`
	return await query(command)
}
module.exports.getLatestSuggestionId = async () => {
	let command = `SELECT MAX(ID) as ID FROM SUGGESTIONS`
	return (await query(command))[0].ID
}
module.exports.getSuggestion = async (id, user_id) => {
	let command = `SELECT * FROM SUGGESTIONS WHERE ID = '${id}' AND TWITCH_ID = '${user_id}'`
	return await query(command)
}
module.exports.removeSuggestion = async id => {
	let command = `DELETE FROM SUGGESTIONS WHERE ID ='${id}'`
	return await query(command)
}

module.exports.emotesGetsUpdated = async streamer => {
	let command = `SELECT * FROM EMOTES WHERE CHANNELNAME = '${streamer}'`
	return (await query(command)) != undefined
}
module.exports.addNewChannelForEmoteUpdates = async (streamer, [ffz, bttv]) => {
	let command = `INSERT INTO EMOTES (CHANNELNAME,FFZ_EMOTES,BTTV_EMOTES,LAST_ADDED,LAST_REMOVED) VALUES ('${streamer}','${JSON.stringify(
		ffz
	)}','${JSON.stringify(bttv)}','{}','{}')`
	return await query(command)
}

module.exports.updateLast = async (emote, channel, event) => {
	let last = await getLastEmotes(event, channel)
	event = event.toUpperCase()
	emoteList = Object.entries(last)
	if (emoteList.length > 10) {
		const oldestEmote = emoteList.reduce((current, savedValue) => {
			return current[1] < savedValue ? current[1] : savedValue
		})[0]
		delete last[oldestEmote]
	}
	last[emote] = Date.now()
	let command = `UPDATE EMOTES SET LAST_${event} = '${JSON.stringify(
		last
	)}' WHERE CHANNELNAME = '${channel}'`
	return await query(command)
}

module.exports.updateChannelInfo = async ({
	title,
	is_live,
	game_id,
	broadcaster_login
}) => {
	let command = `UPDATE CHANNEL_INFO SET LIVE='${is_live}',TITLE=${mysql.escape(
		title.replace("'","\'")
	)},GAME_ID='${game_id}', LIVE_COOLDOWN='${Date.now()}',TITLE_COOLDOWN='${Date.now()}',GAME_COOLDOWN='${Date.now()}' WHERE CHANNEL_NAME='${broadcaster_login}'`
	return await query(command)
}
module.exports.getNotifyMessage = async (event,channel)=>{
	let command = `SELECT * FROM NOTIFY_MESSAGE WHERE CHANNEL_NAME = '${channel}'`
	let result =await query(command)
	if(!result) return undefined
	return result[0][event.toUpperCase()]
}
module.exports.updateEmotes = async (channel, ffz, bttv) => {
	let command = `UPDATE EMOTES SET FFZ_EMOTES='${JSON.stringify(
		ffz
	)}',BTTV_EMOTES='${JSON.stringify(bttv)}' WHERE CHANNELNAME ='${channel}'`
	return await query(command)
}
module.exports.addNewSuggestion = async (suggestionId, user_id, suggestion) => {
	let command = `INSERT INTO SUGGESTIONS (ID,SUGGESTION,TIME,TWITCH_ID) VALUES ('${suggestionId}','${suggestion}','${Date.now()}','${user_id}')`
	return await query(command)
}

module.exports.getEmotesForChannel = async channel => {
	let command = `SELECT * FROM EMOTES WHERE CHANNELNAME=${channel}`
	let {FFZ_EMOTES: ffz, BTTV_EMOTES: bttv} = await query(command)
	return [ffz, bttv]
}

module.exports.getEmoteUpdateChannels = async () => {
	let command = `SELECT * FROM EMOTES`
	return await query(command)
}
module.exports.getEmoteChannels = async () => {
	let command = `SELECT * FROM EMOTES`
	return (await query(command)).map(channel => channel.CHANNELNAME)
}
module.exports.getPingUser = async () => {
	let command = `SELECT * FROM LASTPING JOIN TWITCH_USER ON LASTPING.TWITCH_ID = TWITCH_USER.TWITCH_ID `
	let result = await query(command)

	if (!result) return undefined
	return result.map(element => {
		return {
			username: element.USERNAME,
			user_id: element.TWITCH_ID,
			regex: element.REGEX
		}
	})
}
module.exports.getPingRegex = async id => {}
module.exports.getLastPing = async username => {
	let command = `SELECT * FROM LASTPING JOIN TWITCH_USER ON LASTPING.TWITCH_ID = TWITCH_USER.TWITCH_ID WHERE TWITCH_USER.USERNAME='${username}'`
	let result = await query(command)
	if (!result) return
	let [{COUNTER, LAST_PING_CHANNEL, LAST_PING_TIME, MATCHED, BY_USER, REGEX}] =
		result
	return {
		counter: COUNTER,
		pingchannel: LAST_PING_CHANNEL,
		time: LAST_PING_TIME,
		phrase: MATCHED,
		by: BY_USER,
		regex: REGEX
	}
}
module.exports.isRegisteredForPing = async id => {
	let command = `SELECT * FROM LASTPING WHERE TWITCH_ID = '${id}'`
	return (await query(command)) != undefined
}
module.exports.isRegisteredForColorHistory = async id => {
	let command = `SELECT * FROM COLOR_HISTORY WHERE TWITCH_ID = '${id}'`
	return (await query(command)) != undefined
}
module.exports.addUserToPing = async (id, regex) => {
	let command = `INSERT INTO LASTPING (TWITCH_ID,COUNTER,REGEX) VALUES ('${id}','1','${regex}')`
	return await query(command)
}
module.exports.updateLastPing = async (
	user_id,
	channel,
	matchedWord,
	byUser
) => {
	let command = `SELECT COUNTER FROM LASTPING WHERE TWITCH_ID = '${user_id}'`
	let [{COUNTER: counter}] = await query(command)
	let update = `UPDATE LASTPING SET COUNTER = '${
		counter + 1
	}', LAST_PING_CHANNEL = '${channel}',LAST_PING_TIME='${Date.now()}',MATCHED=${mysql.escape(
		matchedWord
	)}, BY_USER='${byUser}' WHERE TWITCH_ID='${user_id}'`
	return await query(update)
}

module.exports.channelInfoGetsUpdated = async streamer => {
	let command = `SELECT * FROM CHANNEL_INFO WHERE CHANNEL_NAME = '${streamer}'`
	return (await query(command)) != undefined
}
module.exports.addNewNotifyEntryAllEvents = async (
	user_id,
	channel,
	streamer
) => {
	let command = `INSERT INTO NOTIFY (TWITCH_ID,CHANNEL,STREAMER,LIVE,OFFLINE,TITLE,GAME) VALUES ('${user_id}','${channel}','${streamer}','1','1','1','1')`
	return await query(command)
}
module.exports.addNewNotifyEntryNoEvents = async (
	user_id,
	channel,
	streamer
) => {
	let command = `INSERT INTO NOTIFY (TWITCH_ID,CHANNEL,STREAMER,LIVE,OFFLINE,TITLE,GAME,EMOTE_ADDED,EMOTE_REMOVED) VALUES ('${user_id}','${channel}','${streamer}','0','0','0','0','0','0')`
	return await query(command)
}
module.exports.deleteBan = async (channel, username) => {
	let command = `DELETE FROM BANNED_USER WHERE USERNAME='${username}' AND CHANNEL='${channel}'`
	return await query(command)
}
module.exports.setCurrentlyConnected = async (value, channel) => {
	let command = `UPDATE CHANNELS SET CURR_CONNECTED ='${value}' WHERE CHANNEL_NAME = '${channel}'`
	return await query(command)
}

module.exports.isConnected = async channel => {
	let command = `SELECT CURR_CONNECTED FROM CHANNELS WHERE CHANNEL_NAME = '${channel}'`
	let result = await query(command)
	return result != undefined && result[0].CURR_CONNECTED != 0
}
module.exports.getAllowed = async channel => {
	let command = `SELECT ALLOWED,ALLOWED_LIVE FROM CHANNELS WHERE CHANNEL_NAME='${channel}'`
	let response = await query(command)
	if (!response)
		return {
			allowed: false,
			allowed_live: false
		}
	let [{ALLOWED, ALLOWED_LIVE}] = response
	return {
		allowed: ALLOWED,
		allowed_live: ALLOWED_LIVE
	}
}
module.exports.setDisabledForChannel = async channel => {
	let command = `UPDATE CHANNELS SET ALLOWED='0' WHERE CHANNEL_NAME='${channel}'`
	return await query(command)
}
module.exports.setEnabledForChannel = async channel => {
	let command = `UPDATE CHANNELS SET ALLOWED='1' WHERE CHANNEL_NAME='${channel}'`
	return await query(command)
}
module.exports.setPermissionsForUser = async (username, permissionlvl) => {
	let command = `UPDATE TWITCH_USER SET PERMISSIONS ='${permissionlvl}' WHERE USERNAME ='${username}'`
	return await query(command)
}
module.exports.incrementCommandCounter = async commandname => {
	let command = `SELECT COUNTER FROM COMMANDS WHERE NAME='${commandname}'`
	let response = await query(command)
	let count = response[0].COUNTER
	command = `UPDATE COMMANDS SET COUNTER='${
		count + 1
	}' WHERE NAME ='${commandname}'`
	return await query(command)
}
module.exports.deleteCommand = async commandname => {
	let command = `DELETE FROM COMMANDS WHERE NAME = '${commandname}'`
	console.log(
		`${chalk.hex('#A0522D').bold('[COMMAND]')} ${chalk.red(
			'[REMOVED]'
		)} ${chalk.yellow(`[${commandname.toUpperCase()}]`)}`
	)
	return await query(command)
}
module.exports.addNewUser = async user => {
	let command = `INSERT INTO TWITCH_USER (USERNAME, TWITCH_ID, COLOR,PERMISSIONS,REGISTER_TIME) VALUES ('${
		user.username
	}', '${user['user-id']}', '${user.color}','1','${Date.now()}')`
	return await query(command)
}
module.exports.deleteUser = async user_id => {
	let command = `DELETE FROM TWITCH_USER WHERE TWITCH_ID='${user_id}'`
	return await query(command)
}
module.exports.userIsRegisteredForColorHistory = async user_id => {
	let command = `SELECT TWITCH_ID FROM COLOR_HISTORY WHERE TWITCH_ID = '${user_id}'`
	return (await query(command)) != undefined
}
module.exports.getCommands = async () => {
	let command = `SELECT * FROM COMMANDS`
	return await query(command)
}
module.exports.isUserRegistered = async user_id => {
	let command = `SELECT TWITCH_ID FROM TWITCH_USER WHERE TWITCH_ID ='${user_id}'`
	return (await query(command)) != undefined
}
module.exports.getPermissionsForUser = async user_id => {
	let command = `SELECT PERMISSIONS FROM TWITCH_USER WHERE TWITCH_ID='${user_id}'`
	let result = await query(command)
	if (result) return result[0].PERMISSIONS
	return undefined
}
module.exports.getConnectedChannels = async () => {
	let command = `SELECT * FROM CHANNELS WHERE CURR_CONNECTED='1'`
	return await query(command)
}
module.exports.getConnectedChannel = async channel => {
	let command = `SELECT * FROM CHANNELS WHERE CURR_CONNECTED='1' AND CHANNEL_NAME ='${channel}'`
	return await query(command)
}
module.exports.updateNotifyChannelForUser = async (
	user_id,
	newChannel,
	streamer
) => {
	let command = `UPDATE NOTIFY SET CHANNEL='${newChannel}' WHERE TWITCH_ID = '${user_id}'AND STREAMER = '${streamer}'`
	return await query(command)
}
module.exports.getAllWatchChannels = async () => {
	let comand = `SELECT * FROM WATCHCHANNELS`
	return await query(comand)
}
module.exports.isWatchChannel = async channel => {
	let command = `SELECT * FROM WATCHCHANNELS WHERE CHANNEL_NAME ='${channel}'`
	let result = await query(command)
	return result != undefined
}
module.exports.setUpdateCooldown = async (channel, cooldown) => {
	let command = `UPDATE CHANNEL_INFO SET NEXT_UPDATE ='${
		Date.now() + cooldown
	}' WHERE CHANNEL_NAME = '${channel}'`
	return await query(command)
}
module.exports.updateColorHistoryInDatabase = async (colorArray, user_id) => {
	let command = `UPDATE COLOR_HISTORY SET COLOR_HIST = '${JSON.stringify(
		colorArray
	)}', LAST_CHANGE='${Date.now()}' WHERE TWITCH_ID = ${user_id}`
	return await query(command)
}
module.exports.updateColor = async (user_id, color) => {
	let command = `UPDATE TWITCH_USER SET COLOR='${color}' WHERE TWITCH_ID = '${user_id}'`
	return await query(command)
}

module.exports.getUserInfo = async username => {
	let command = `SELECT * FROM TWITCH_USER WHERE USERNAME ='${username}'`
	let user_info = await query(command)
	if (user_info === undefined) return undefined
	let [{USERNAME, TWITCH_ID, COLOR, PERMISSIONS, REGISTER_TIME}] = user_info
	return {
		username: USERNAME,
		twitch_id: TWITCH_ID,
		color: COLOR,
		permissions: PERMISSIONS,
		register_time: REGISTER_TIME
	}
}
module.exports.updateCommandValue = async (commandname, newvalue, key) => {
	let command = `UPDATE COMMANDS SET ${key.toUpperCase()}='${newvalue}' WHERE NAME='${commandname}'`
	console.log(
		`${chalk.hex('#A0522D').bold('[COMMAND]')} ${chalk
			.hex('#3f888f')
			.bold('[UPDATED]')} ${chalk.yellow(`[${commandname.toUpperCase()}]`)}`
	)
	return await query(command)
}
module.exports.addNewCommand = async (commandname, commandinfo) => {
	let command = `INSERT INTO COMMANDS (NAME,COUNTER,REQUIRED_PERMISSIONS,DESCRIPTION,REQUIRED_PARAMETERS,OPTIONAL_PARAMETERS) VALUES ('${commandname.toUpperCase()}','0','${
		commandinfo.required_permissions
	}','${commandinfo.description}','${commandinfo.required_parameters}','${
		commandinfo.optional_parameters
	}')`
	console.log(
		`${chalk.hex('#A0522D').bold('[COMMAND]')} ${chalk
			.hex('#3f888f')
			.bold('[ADDED]')} ${chalk.yellow(`[${commandname.toUpperCase()}]`)}`
	)
	return await query(command)
}
module.exports.insert = async (database, keys, values) => {
	let command = `INSERT INTO ${database} (${keys}) VALUES (${values})`
	return await query(command)
}

module.exports.select = async (keys, table) => {
	let command = `SELECT ${keys} FROM ${table}`
	return await query(command)
}

module.exports.selectWhere = selectWhere = async (
	keys,
	table,
	where,
	value
) => {
	let command = `SELECT ${keys} FROM ${table} WHERE ${where} = '${value}'`
	return await query(command)
}

module.exports.updateWhere = async (table, set, setvalue, where, value) => {
	if(!value) return
	let command = `UPDATE ${table} SET ${set} ='${setvalue}'WHERE ${where} = '${value}'`
	return await query(command)
}

module.exports.updateWhereMultipleSets = async (table, set, where, value) => {
	let command = `UPDATE ${table} SET ${set} WHERE ${where} = '${value}'`
	return await query(command)
}

module.exports.remove = async (table, where, value) => {
	let command = `DELETE FROM ${table} WHERE ${where} = '${value}'`
	return new Promise((resolve, reject) => {
		twitchdatabase.query(command, (err, result) => {
			if (err) console.log(err)
			resolve(result)
		})
	})
}

module.exports.selectJoin = async (
	keys,
	table,
	jointable,
	tablevalue,
	jointablevalue,
	where,
	wherevalue
) => {
	let command = `SELECT ${keys} FROM ${table} JOIN ${jointable} ON ${tablevalue}=${jointablevalue} WHERE ${where} = '${wherevalue}'`
	return await query(command)
}
module.exports.custom = async command => {
	command = command.replace(/\n/g, '')
	return await query(command)
}
module.exports.addNewBan = async (channel, username) => {
	let command = `INSERT INTO BANNED_USER (USERNAME,CHANNEL,TIME) VALUES ('${username}','${channel}','${Date.now()}')`
	return await query(command)
}

module.exports.getColorForUser = async user_id => {
	let command = `SELECT COLOR FROM TWITCH_USER WHERE TWITCH_ID = '${user_id}'`
	let [{COLOR}] = await query(command)
	if (COLOR) {
		return COLOR
	}
	return undefined
}
module.exports.addNewChannelForAPIUpdates = async (streamer, currentDate) => {
	let command = `INSERT INTO CHANNEL_INFO (CHANNEL_NAME,LIVE,TITLE,GAME_ID,NEXT_UPDATE,LIVE_COOLDOWN,TITLE_COOLDOWN,GAME_COOLDOWN) VALUES ('${streamer}','${undefined}','${undefined}','${-1}','${currentDate}','${currentDate}','${currentDate}','${currentDate}')`
	return await query(command)
}
module.exports.getNotifyCooldownForEvent = async (event, channelname) => {
	let command = `SELECT ${event}_COOLDOWN FROM CHANNEL_INFO WHERE CHANNEL_NAME ='${channelname}' `
	let [result] = await query(command)
	return result[`${event}_COOLDOWN`]
}
module.exports.getNotifedUserForStreamerOnEvent = async (streamer, key) => {
	let command = `SELECT * FROM NOTIFY JOIN TWITCH_USER ON NOTIFY.TWITCH_ID=TWITCH_USER.TWITCH_ID WHERE STREAMER = '${streamer}' AND ${key.toUpperCase()} = '1'`
	return await query(command)
}
module.exports.removeNotifyRecordInDatabase = async (user_id, streamer) => {
	let command = `DELETE FROM NOTIFY WHERE TWITCH_ID='${user_id}' AND STREAMER='${streamer}'`
	return await query(command)
}
module.exports.getBansForChannel = async channel => {
	let command = `SELECT * FROM BANNED_USER WHERE CHANNEL= '${channel}' ORDER BY TIME DESC`
	return await query(command)
}
module.exports.getTimeoutsForChannel = async channel => {
	let command = `SELECT * FROM TIMEOUT_USER WHERE CHANNEL= '${channel}' ORDER BY TIME DESC`
	return await query(command)
}
module.exports.addNewWatchChannel = async channel => {
	let command = `INSERT INTO WATCHCHANNELS (CHANNEL_NAME) VALUES ('${channel}')`
	return await query(command)
}
module.exports.addNewTimeout = async (username, channel, duration) => {
	let command = `INSERT INTO TIMEOUT_USER (USERNAME,CHANNEL,TIME,DURATION) VALUES ('${username}','${channel}','${Date.now()}','${duration}')`
	return await query(command)
}
module.exports.removeWatchChannel = async channel => {
	let command = `DELETE FROM WATCHCHANNELS WHERE CHANNEL_NAME = '${channel}'`
	return await query(command)
}

module.exports.getNotifyEntryForStreamer = async (user_id, streamer) => {
	let command = `SELECT * FROM NOTIFY WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`
	let result = await query(command)
	if (!result) return undefined
	return result[0]
}
module.exports.updateEventForUser = async (
	user_id,
	streamer,
	status,
	value
) => {
	let command = `UPDATE NOTIFY SET ${status.toUpperCase()}='${value}' WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`
	return await query(command)
}
module.exports.updateRegexForPing = async (id, regex) => {
	let command = `UPDATE LASTPING SET REGEX = '${regex}' WHERE TWITCH_ID = ${id}`
	return await query(command)
}
module.exports.addNewRecordToColorHistory = async (user_id, currentColor) => {
	let command = `INSERT INTO COLOR_HISTORY (TWITCH_ID,COLOR_HIST,REGISTER_TIME,LAST_CHANGE) VALUES ('${user_id}','["${currentColor}"]','${Date.now()}','${Date.now()}')`
	return await query(command)
}
module.exports.getRPSStatsForUserID = async user_id => {
	let command = `SELECT * FROM RPS_STATS JOIN TWITCH_USER ON RPS_STATS.TWITCH_ID = TWITCH_USER.TWITCH_ID WHERE RPS_STATS.TWITCH_ID ='${user_id}'`
	if (await query(command === undefined)) return undefined
	let [{WIN, LOSE, DRAW}] = await query(command)
	return {
		wins: WIN,
		losses: LOSE,
		draws: DRAW
	}
}
module.exports.getEmotegameStatsForUserID = async user_id => {
	let command = `SELECT * FROM EMOTEGAME_STATS JOIN TWITCH_USER ON EMOTEGAME_STATS.TWITCH_ID = TWITCH_USER.TWITCH_ID WHERE EMOTEGAME_STATS.TWITCH_ID ='${user_id}'`
	if ((await query(command)) === undefined) return undefined
	let [{LETTERS_GUESSED, EMOTES_GUESSED}] = await query(command)
	return {
		letters_guessed: LETTERS_GUESSED,
		emotes_guessed: EMOTES_GUESSED
	}
}
module.exports.getLeaderboardPositionRPS = async user_id => {
	let command = `SELECT * FROM TWITCH_USER JOIN RPS_STATS ON  TWITCH_USER.TWITCH_ID = RPS_STATS.TWITCH_ID ORDER BY RPS_STATS.WIN DESC`
	let allStats = await query(command)
	return allStats.findIndex(user => user.TWITCH_ID === parseInt(user_id)) + 1
}
module.exports.getLeaderboardPositionEmoteGame = async user_id => {
	let command = `SELECT * FROM TWITCH_USER JOIN EMOTEGAME_STATS ON  TWITCH_USER.TWITCH_ID = EMOTEGAME_STATS.TWITCH_ID ORDER BY EMOTEGAME_STATS.EMOTES_GUESSED DESC`
	let allStats = await query(command)
	return allStats.findIndex(user => user.TWITCH_ID === parseInt(user_id)) + 1
}
const query = command => {
	if (
		command.search(/^INSERT$|^UPDATE$|^DELETE$/) != -1 &&
		process.env.IS_RASPI === 'false'
	)
		return
	return new Promise((resolve, reject) => {
		if (process.env.ENVIRONMENT === 'test') {
			testdatabase.query(command, (error, result) => {
				if (error) {
					console.log(error)
					reject(error)
				}
				if (result.length != 0) {
					resolve(result)
				} else {
					resolve(undefined)
				}
			})
		} else {
			twitchdatabase.query(command, (error, result) => {
				if (error) {
					console.log(error)
					reject(error)
				}
				if (result.length != 0) {
					resolve(result)
				} else {
					resolve(undefined)
				}
			})
		}
	})
}

module.exports.getLastEmotes = getLastEmotes
