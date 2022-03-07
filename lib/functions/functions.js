const database = require('../../database')
const request = require('request')
const got = require('got')
const fs = require('fs')
const humanizeDuration = require('humanize-duration')
const AT = require('./ATHandler').AT
const { client } = require('tmi.js')

module.exports.updateChannelInfoDatabase = async channel => {
	let DatabaseChannels = await database.selectWhere(
		'CHANNEL_NAME',
		'CHANNEL_INFO',
		'CHANNEL_NAME',
		channel
	)
	if (!DatabaseChannels)
		database.addNewChannelForAPIUpdates(channel, Date.now())
}
module.exports.addChannel = async channel => {
	database.insert(
		'channels',
		'CHANNEL_NAME, ALLOWED, TIMES_CONNECTED, CURR_CONNECTED, FIRST_CONNECTED, ALLOWED_LIVE',
		`'${channel}','0','1','1','${Date.now()}','1'`
	)
}

module.exports.splitUserMessage =async(users, event, channel, streamer, value) => {
	let beginMessage = await database.getNotifyMessage(event, channel)

	if(!beginMessage){
		beginMessage = getBeginMessage(event, streamer, value)
	}else{
		beginMessage = insertValues(beginMessage, {streamer, event , value})
	}

	let messageArray = []
	let currentMessage = beginMessage

	for (let {USERNAME:user, flags} of users) {
		if(!(await checkAdditionalInfo(flags, event, value))) 
			continue

		if ((currentMessage + ' ' .concat(user)).length < 500) {
			currentMessage += ' ' .concat(user)
		} else {
			messageArray.push(currentMessage)
			currentMessage = beginMessage + ' ' + user
		}
	}
	messageArray.push(currentMessage)

	return messageArray
}

const checkAdditionalInfo =async (additionalInfo, event, value) =>{
	if(!additionalInfo)
		return true

	let flags = JSON.parse(additionalInfo)[event]
	
	for(let[flag, checkValues] of Object.entries(flags)){
		if(checkFlag[flag] != undefined && checkFlag[flag](value, checkValues)){
			return true
		}
	}
	return false
}

const checkFlag = {
	regex:(value, checkValues)=>{
		for(let checkValue of checkValues){
			if(value.search(new RegExp(checkValue,"gmi"))!==-1){
				return true
			}
		}
		return false
	},
	exact: (value, checkValues) => {
		for(let checkValue of checkValues){
			if(value == checkValue){
				return true
			}
		}
		return false
	}
}

const insertValues = (beginMessage, replacements)=>{
	for(let[key, replacement] of Object.entries(replacements)){
		beginMessage  = beginMessage.replace("${" + key +"}", replacement)
	}
	return beginMessage
}

const getBeginMessage = (event, streamer, value)=>{
	switch(event){
		case "live": return `PagMan 👉  ${streamer} went live DinkDonk `
		case "offline":return`FeelsBadMan 👉  ${streamer} went offline DinkDonk ` 
		case "EMOTE_added": return `PagMan 👉 NEW EMOTE IN ${streamer} 👉 ${emote} DinkDonk `;
		case "EMOTE_removed": return `FeelsBadMan 👉 EMOTE REMOVED IN ${streamer}👉 ${emote} DinkDonk`; 
		default: return`PagMan 👉  ${streamer} has changed the ${event} to ${value} DinkDonk `; 
	}
}

module.exports.registerUser = async user => {
	let response = await database.getUserInfo(user.username)
	if (!response) database.addNewUser(user)
}

const userIsBroadcaster = user => {
	return user?.badges?.broadcaster == 1
}

module.exports.getPermissions = async user => {
	let databasePermisssion = await database.getPermissionsForUser(
		user['user-id']
	)
	if (databasePermisssion === 0) return 0
	if (databasePermisssion != undefined) {
		if (userIsBroadcaster(user) && databasePermisssion < 2) return 2
		return databasePermisssion
	}
	if (userIsBroadcaster(user)) {
		return 2
	} else {
		return 1
	}
}

module.exports.shortenTime = time => {
	time = humanizeDuration(time)
	return time
		.replace(/years?/, 'y')
		.replace(/months?/, 'm')
		.replace(/weeks?/, 'w')
		.replace(/days?/, 'd')
		.replace(/hours?/, 'h')
		.replace(/minutes?/, 'min')
		.replace(/seconds?/, 's')
		.replace(/\s/g, '')
		.replace(/,/g, ' ')
}

const changePostionOfColorToFirst = (colorHistoryArray, newcolor) => {
	colorHistoryArray.splice(colorHistoryArray.indexOf(newcolor), 1)
	colorHistoryArray.unshift(newcolor)
	return colorHistoryArray
}
const addColorToFirstPosition = (colorHistoryArray, newcolor) => {
	colorHistoryArray.unshift(newcolor)
	return colorHistoryArray
}
const addColorToFirstPositionRemoveLastColor = (
	colorHistoryArray,
	newcolor
) => {
	colorHistoryArray.splice(colorHistoryArray.length - 1, 1)
	colorHistoryArray.unshift(newcolor)
	return colorHistoryArray
}
module.exports.getColorArrayWithNewColor = async (user_id, newcolor) => {
	let colorresponse = await database.selectWhere(
		'*',
		'COLOR_HISTORY',
		'TWITCH_ID',
		user_id
	)
	let colorHistoryArray = JSON.parse(colorresponse[0].COLOR_HIST)

	if (colorHistoryArray.includes(newcolor))
		return changePostionOfColorToFirst(colorHistoryArray, newcolor)

	if (colorHistoryArray.length < 10)
		return addColorToFirstPosition(colorHistoryArray, newcolor)

	return addColorToFirstPositionRemoveLastColor(colorHistoryArray, newcolor)
}
/**
 *
 * @param {*} options GET options
 * @returns parsed body of the callback
 */
const requestWithOptions = async (options, channelinfo) => {
	return new Promise((resolve, reject) => {
		request.get(options, (err, res, body) => {
			if (err) reject(err)
			hb.currentRateLimit = (res.caseless.dict["ratelimit-remaining"])
			try {
				resolve({channelinfo, info:JSON.parse(body).data})
			} catch {
				console.error()
				resolve(undefined)
			}
		})
	})
}
module.exports.getRequest = async (options, channelinfo) => {
	return new Promise((resolve, reject) => {
		request.get(options, (err, res, body) => {
			if (err) reject(err)
			try {
				resolve(JSON.parse(body))
			} catch {
				console.error()
				resolve(undefined)
			}
		})
	})
}

module.exports.getChannelUpdates = async channelinfo =>{
	const options = {
		url: "https://api.twitch.tv/helix/search/channels?query="+channelinfo.channelname,
		method:'GET',
		headers:{
			'Client-ID':process.env.CLIENT_ID,
			'Authorization': 'Bearer ' + AT.access_token
		}
	}
	return await requestWithOptions(options, channelinfo) 
}

module.exports.postrequest = async options => {
	return new Promise((resolve, reject) => {
		request.post(options, (err, res, body) => {
			if (err) {
				reject(err)
			} else {
				resolve(body)
			}
		})
	})
}
/**
 * simple got request
 * @param {*} url URL
 * @returns parsed body of the callback
 */
module.exports.got = async url => {
	return new Promise(async (resolve, reject) => {
		let response = await got(url)
		if (response === undefined) {
			reject('error')
		} else {
			resolve(JSON.parse(response.body))
		}
	})
}

module.exports.writeFile = (path, jsonobject) => {
	fs.writeFile(path, JSON.stringify(jsonobject), function writeJSON(err) {
		if (err) return console.log(err)
	})
}

module.exports.timer = ms => new Promise(res => setTimeout(res, ms))

module.exports.getThirdPartyEmotes = async (channel) => {
	try{
		let allEmotes = []
		let {room:{twitch_id, set}, sets} = await (await got(`https://api.frankerfacez.com/v1/room/${channel}`).json())
		let {sharedEmotes, channelEmotes} = await (await got(`https://api.betterttv.net/3/cached/users/twitch/${twitch_id}`).json())
		let sevenTvEmotes = await (await got(`https://api.7tv.app/v2/users/${channel}/emotes`).json())
	
		for(let {name} of sevenTvEmotes){
			allEmotes.push(name)
		}
	
		for(let {code} of [...sharedEmotes, ... channelEmotes]){
			allEmotes.push(code)
		}
	
		for(let {name} of sets[set].emoticons){
			allEmotes.push(name)
		}
	
		return allEmotes
	}catch(e){
		return []
	}

}

module.exports.getIndicesOf = (searchStr, str, caseSensitive) => {
	var searchStrLen = searchStr.length
	if (searchStrLen == 0) {
		return []
	}
	var startIndex = 0,
		index,
		indices = []
	if (!caseSensitive) {
		str = str.toLowerCase()
		searchStr = searchStr.toLowerCase()
	}
	while ((index = str.indexOf(searchStr, startIndex)) > -1) {
		indices.push(index)
		startIndex = index + searchStrLen
	}
	return indices
}
module.exports.getGameByID = async id => {
	const options = {
		url: 'https://api.twitch.tv/helix/games?id=' + id,
		method: 'GET',
		headers: {
			'Client-ID': process.env.CLIENT_ID,
			Authorization: 'Bearer ' + AT.access_token
		}
	}
	return new Promise((resolve, reject) => {
		request.get(options, (err, res, body) => {
			if (err) {
				reject(err)
				console.log(err)
			}
			let parsed = JSON.parse(body)
			if (parsed?.data?.length === 0) resolve(undefined)
			resolve(parsed?.data[0]?.name)
		})
	})
}
module.exports.checkAvailableAtTwtichAPI = async channelname => {
	channelname = channelname.replace(/[^\x00-\x7F]|\n|'/g, '')
	const options = {
		url: 'https://api.twitch.tv/helix/search/channels?query=' + channelname,
		method: 'GET',
		headers: {
			'Client-ID': process.env.CLIENT_ID,
			Authorization: 'Bearer ' + AT.access_token
		}
	}
	return new Promise((resolve, reject) => {
		request.get(options, (err, res, body) => {
			if (err) {
				reject(err)
				console.log(err)
			}
			let parseddata = JSON.parse(body)
			if (parseddata?.data === undefined) return false
			resolve(
				parseddata?.data.some(streamer => {
					return streamer.broadcaster_login === channelname
				})
			)
		})
	})
}

module.exports.checkRateLimit = async =>{
	const options = {
		url: 'https://api.twitch.tv/helix/search/channels?query=' + "tests",
		method: 'GET',
		headers: {
			'Client-ID': process.env.CLIENT_ID,
			Authorization: 'Bearer ' + AT.access_token
		}
	}
	return new Promise((resolve, reject)=>{
		request.get(options, (err, res, body) => {
			if (err) {
				reject(err)
				console.log(err)
			}
			resolve(res.caseless.dict["ratelimit-remaining"])
	})
})
}

module.exports.getRegexExp = username => {
	let character = username.split('')
	let regex = ''
	for (let i = 0; i < character.length; i++) {
		let char = character[i]

		if (replacements[char]) {
			char = replacements[char]
		}

		let repetion = getMultiple(username, i)
		if (repetion === 1) {
			if (char === '*') {
				regex += `${char}[\\\\W_]*`
			} else {
				regex += `[${char}][\\\\W_]*`
			}
		} else {
			regex += `(([${char}]){1,${repetion}})[\\\\W_]*`
			i += repetion - 1
		}
	}
	return regex
}
const getMultiple = (username, index) => {
	username = username.substring(index, username.length)
	for (var i = 1; i < username.length; i++) {
		if (!(username[0] === username[i])) {
			return i
		}
	}
	return 1
}

const replacements = {
	e: 'e3',
	a: 'a4',
	b: 'b8',
	i: 'il',
	l: 'li',
	_: '*'
}
module.exports.getAverage = (array)=>{
	let sum = 0
	for(let number of array) {
		if(typeof number != "number") return undefined
		sum+= number
	}
	return Math.round((sum/array.length + Number.EPSILON) * 100) / 100
}

module.exports.getThirdPartyEmotesDECAPI = async username => {
	const bttvEmotes = (
		await got(`http://decapi.me/bttv/emotes/${username}`)
	).body.split(' ')
	const ffzEmotes = (
		await got(`http://decapi.me/ffz/emotes/${username}`)
	).body.split(' ')
	if (
		ffzEmotes.join(' ') ===
		'An error occurred translating the Twitch username to a valid user ID.'
	)
		throw Error('Does not exist')

	return [ffzEmotes, bttvEmotes]
}

const getFlags = (array) => {
	let flags = {}

	if(array.length===0)
		return flags
	
	for (let flag of array) {
		let [key, value] = flag.split(':')
		if (value != undefined) flags[key] = value
	}

	return flags
}

module.exports.getFlags = getFlags
module.exports.getMultiple = getMultiple
module.exports.request = requestWithOptions