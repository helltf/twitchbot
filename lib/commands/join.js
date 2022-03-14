const database = require('../../database')
const chalk = require('chalk')

/**
 * @author helltf
 */

module.exports = {
	description: 'the bot will join the channel',
	required_parameters: 'channel',
	name: 'join',
	required_permissions: 3,
	optional_parameters: 'none',
	invocation: async (channel, user, [newChannel, allowed]) => {
		if (await database.isConnected(newChannel)) {
			return `Sorry but I'm already in this channel!`
		}

		try {
			await hb.client.join(newChannel)
			database.setCurrentlyConnected(1, newChannel)
			if (allowed === 'true') {
				database.setEnabledForChannel(newChannel)
			}
			return `Successfully joined the channel: ${newChannel}`
		} catch (reason) {
			console.log(
				`${chalk.red("Couldn't join the channel")} ${chalk.green(
					newChannel
				)} because ${reason}`
			)
			return `Couldn't join the channel: ${newChannel}! Reason: ${reason}`
		}
	}
}
