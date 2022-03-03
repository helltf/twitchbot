const database = require('../../database')
const util = require("../functions/functions")

module.exports = {
	description: 'Give the latest removed emotes for the channel',
	required_parameters: 'none',
	name: 'removed',
	required_permissions: 1,
	optional_parameters: 'channel',
	invocation: async (channel, user, [lookupchannel]) => {
		if (!lookupchannel) lookupchannel = channel
		let recentEmotes = await database.getLastEmotes('removed', lookupchannel)
		if(!Object.keys(recentEmotes).length) return `No recent removed Emotes in this channel :\\`
		recentEmotes = Object.entries(recentEmotes).sort(([, a], [, b]) => {
			return b - a
		})
        let message = `recently removed emotes in ${lookupchannel} are: `

		for(let [emote, timestamp] of recentEmotes){
			message+= `${emote} (${util.shortenTime(Date.now()-timestamp).replace(/(?<=min).*/,"")}), `
		}
		return message
	}
}
