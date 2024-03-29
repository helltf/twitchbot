const database = require('../../database')

/**
 * @author helltf
 */
module.exports = {
	description:
		'Disables notifications for a given streamern on a certain event. Available events: live/offline/title/game/all/emote_removed/emote_added',
	name: 'removeme',
	required_permissions: 1,
	required_parameters: 'streamer event',
	optional_parameters: 'none',
	invocation: async (channel, user, [streamer, event]) => {
		// Wrong input return
		if (!streamer || !event) return

		//Check if event is valid input
		if (
			event.search(
				hb.regex.EVENTS
			) === -1
		)
			return `Wrong event provided! Available events: live/offline/title/game/all/emote_removed/emote_added`

		// Sets Value of Default Messages
		const DEFAULTMESSAGE_SUCCESSFUL = `Successfully removed notifications for ${streamer} on ${event} changes FeelsBadMan`
		const DEFAULTMESSAGE_SUCCESSFUL_ALL = `Successfully removed all notifications for ${streamer} `
		const DEFAULTMESSAGE_NOT_SUCCESSFUL = `You're not registered for ${event} notifications for ${streamer}. To register for notifications use the command notify!`
		let user_id = user['user-id']

		let databaseEntryForStreamer = await database.getNotifyEntryForStreamer(
			user_id,
			streamer
		)
		if (databaseEntryForStreamer) {
			// User is known for this streamer on some Events

			if (event === 'all') {
				// Removes the whole record for the user
				database.removeNotifyRecordInDatabase(user_id, streamer)
				return DEFAULTMESSAGE_SUCCESSFUL_ALL
			}
			if (databaseEntryForStreamer[event.toUpperCase()] === 0)
				return DEFAULTMESSAGE_NOT_SUCCESSFUL

			await database.updateEventForUser(user_id, streamer, event, 0)
			checkForRecordNeeded(user_id, streamer)
			return DEFAULTMESSAGE_SUCCESSFUL
		}
		return DEFAULTMESSAGE_NOT_SUCCESSFUL
	}
}
const checkForRecordNeeded = async (user_id, streamer) => {
	let notifyEntry = await database.custom(
		`SELECT * FROM NOTIFY WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`
	)
	let [{TITLE, LIVE, OFFLINE, GAME, EMOTE_ADDED, EMOTE_REMOVED}] = notifyEntry
	if (!TITLE && !LIVE && !OFFLINE && !GAME && !EMOTE_ADDED && !EMOTE_REMOVED) {
		database.removeNotifyRecordInDatabase(user_id, streamer)
	}
}
