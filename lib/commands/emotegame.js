const Emotegame = require('../classes/EmoteGame').Emotegame
const util = require('../functions/functions')
const database = require('../../database')
const eventEmitter = require('./../functions/eventEmitter')
/**
 * @author helltf
 */
module.exports = {
	description: `Starts a game of hangman with thirdparty emotes!`,
	name: `emotegame`,
	required_permissions: 1,
	required_parameters: `none`,
	optional_parameters: 'none',
	invocation: async (channel) => {
		let time = 600000
		let { allowed } = await database.getAllowed(channel)

		if (!allowed) return

		if (
			games.emote.some((game) => {
				return game.channel === channel
			})
		)
			return `There is already a game running in this channel!`

		let allemotes = await util.getThirdPartyEmotes(channel)
		let emote = allemotes[Math.floor(Math.random() * allemotes.length)]

		let currentgame = new Emotegame(emote, channel)
		games.emote.push(currentgame)

		setTimeout(() => {
			if (games.emote.includes(currentgame)) {
				eventEmitter.emit('emotegameexceeded', channel, time)
				games.emote.splice(games.emote.indexOf(currentgame), 1)
			}
		}, time)
		return `A Bttvgame has started in this channel! You guess the Emote either writing single letters or the whole Emotename. Emote: ${currentgame.letterguessed}`
	},
}
