const database = require('../../database')
const util = require("../functions/functions")

module.exports = {
	description: 'Give the latest removed emotes for the channel',
	required_parameters: '',
	name: 'removed',
	required_permissions: 1,
	optional_parameters: 'channel',
	invocation: async (channel, user, [lookupchannel]) => {
		if (!lookupchannel) lookupchannel = channel
		let recentEmotes = Object.entries(await database.getLastEmotes('added', lookupchannel)).sort(([, a], [, b]) => {
			return b - a
		})
		if(!recentEmotes) return `No recent removed Emotes in this channel :\\`

        let message = `recently removed emotes in ${lookupchannel} are: `

		for(let [emote,timestamp] of recentEmotes){
			message+= `${emote} (${util.shortenTime(Date.now()-timestamp).replace(/(?<=min).*/,"")}), `
		}
		return message
	}
}
