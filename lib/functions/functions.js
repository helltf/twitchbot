const database = require('../../database')
const request = require('request')
const got = require('got')
const fs = require('fs')
const humanizeDuration = require('humanize-duration')
const AT = require('./ATHandler').AT

module.exports.updateChannelInfoDatabase = async (channel) => {
	let DatabaseChannels = await database.selectWhere(
		'CHANNEL_NAME',
		'CHANNEL_INFO',
		'CHANNEL_NAME',
		channel
	)
	if (!DatabaseChannels)
		database.addNewChannelForAPIUpdates(channel, Date.now())
}
module.exports.addChannel = async (channel) => {
	database.insert(
		'CHANNELS',
		'CHANNEL_NAME,ALLOWED,TIMES_CONNECTED,CURR_CONNECTED,FIRST_CONNECTED,ALLOWED_LIVE',
		`'${channel}','0','1','1','${Date.now()}','1'`
	)
}

module.exports.splitUserMessage = (users, beginmessage) => {
	let messageArray = []
	let currentmessage = beginmessage
	for (user of users) {
		if ((currentmessage + ' ' + user).length < 500) {
			currentmessage += ' ' + user
		} else {
			messageArray.push(currentmessage)
			currentmessage = beginmessage + ' ' + user
		}
	}
	messageArray.push(currentmessage)
	return messageArray
}

module.exports.registerUser = async (user) => {
	let response = await database.getUserInfo(user.username)
	if (!response) database.addNewUser(user)
}
const userIsBroadcaster = (user) => {
	return user?.badges?.broadcaster === 1
}
module.exports.getPermissions = async (user) => {
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

module.exports.shortenTime = (time) => {
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
module.exports.request = async (options) => {
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

module.exports.postrequest = async (options) => {
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
module.exports.got = async (url) => {
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

module.exports.timer = (ms) => new Promise((res) => setTimeout(res, ms))

module.exports.getThirdPartyEmotes = async (channel) => {
	let allemotes = []
	let id
	await got(`https://api.frankerfacez.com/v1/room/${channel}`)
		.json()
		.then((value) => {
			id = value.room.twitch_id
			let setid = Object.keys(value.sets)[0]
			value.sets[setid].emoticons.forEach((emote) => {
				allemotes.push(emote.name)
			})
		})
		.catch((reason) => {
			console.log("Couldn't fetch FrankerFaceZ emotes")
		})

	await got(`https://api.betterttv.net/3/cached/users/twitch/${id}`)
		.json()
		.then((value) => {
			value.channelEmotes.forEach((emote) => {
				allemotes.push(emote.code)
			})
		})
		.catch((reason) => {
			console.log("Couldn't fetch BTTV emotes")
		})

	return new Promise((resolve, reject) => {
		if (allemotes.length === 0) {
			resolve(undefined)
		} else {
			resolve(allemotes)
		}
	})
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
module.exports.getGameByID = async (id) => {
	const options = {
		url: 'https://api.twitch.tv/helix/games?id=' + id,
		method: 'GET',
		headers: {
			'Client-ID': process.env.CLIENT_ID,
			Authorization: 'Bearer ' + AT.access_token,
		},
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
module.exports.checkAvailableAtTwtichAPI = async (channelname) => {
	channelname = channelname.replace(/[^\x00-\x7F]|\n|'/g, '')
	const options = {
		url: 'https://api.twitch.tv/helix/search/channels?query=' + channelname,
		method: 'GET',
		headers: {
			'Client-ID': process.env.CLIENT_ID,
			Authorization: 'Bearer ' + AT.access_token,
		},
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
				parseddata?.data.some((streamer) => {
					return streamer.broadcaster_login === channelname
				})
			)
		})
	})
}
module.exports.getRegexExp = (username)=>{
	let character = username.split("")
	let regex = ""
	for(let i = 0; i < character.length; i++){
		let char = character[i]

		if(replacements[char]){
			char = replacements[char]
		}

		let repetion = getMultiple(username,i)
		if(repetion===1){
			regex+=`[${char}][\\W_]*`

		}else{
			regex+=`(([${char}]){1,${repetion}})[\\W_]*`
			i+=repetion-1
		}
		
	}
	return regex
}
const getMultiple = (username,index)=>{

	username = username.substring(index,username.length)
	for(var i = 1; i<username.length;i++){
		if(!(username[0]===username[i])){
			return i
		}
	}
	return 1
}

const replacements = {
	e:"e3",
	a:"a4",
	b:"b8",
	i:"il",
	l:"li",
	"_":"_\W"
}
module.exports.getMultiple = getMultiple