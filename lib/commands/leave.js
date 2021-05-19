const database = require('../../database')
const chalk = require('chalk')
const util = require('../functions/functions')
/**
 * @author helltf
 */
module.exports = {
	description: 'Used to make the mainclient leave a channel!',
	required_parameters: 'channel',
	name: 'leave',
	required_permissions: 3,
	optional_parameters: 'none',
	invocation: async (channel, user, [leavechannel]) => {
		if (!(await database.isConnected(leavechannel)))
			return `Sorry but I'm not in this channel!`

		return hb.client
			.leave(leavechannel)
			.then(() => {
				database.setCurrentlyConnected(0, leavechannel)
				return `Successfully parted from channel: ${leavechannel}!`
			})

			.catch((reason) => {
				console.log(
					`${chalk.red("Couldn't join the channel")} ${chalk.green(
						leavechannel
					)} because ${reason}`
				)
				return `Couldn't part from channel: ${leavechannel} because ${reason}!`
			})
	},
}
