const database = require('../../database')
const util = require("../functions/functions")
module.exports = {
	description: 'Give the latest added emotes for the channel',
	required_parameters: '',
	name: 'emotes',
	required_permissions: 1,
	optional_parameters: 'channel',
	invocation: async (channel, user, [lookupchannel]) => {
		if (!lookupchannel) lookupchannel = channel
		let recentEmotes = await database.getLastEmotes('added', lookupchannel)

		if(!Object.keys(recentEmotes).length) return `No recent added Emotes in this channel :\\`
		recentEmotes = Object.entries(recentEmotes).sort(([, a], [, b]) => {
			return b - a
		})
        let message = `recently added emotes in ${lookupchannel} are: `

		for(let [emote,timestamp] of recentEmotes){
			message+= `${emote} (${util.shortenTime(Date.now()-timestamp).replace(/(?<=min).*/,"")}), `
		}
		return message
	}
}
