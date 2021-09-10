const util = require('../functions/functions')
const database = require('../../database')

/**
 * @author helltf
 */
module.exports = {
	description:
		'Enables notifications for a given streamern on an certain event. Available events: live/offline/title/game/all/emote_removed/emote_added',
	name: 'notify',
	required_permissions: 1,
	required_parameters: 'streamer event',
	optional_parameters: 'none',
	invocation: async (channel, user, [streamer, event]) => {
		// Wrong input return
		if (!streamer || !event) return 'Missing event or streamer. Right Usage: hb notify <streamer> <event>'
		streamer = streamer.toLowerCase()
		event = event.toLowerCase()
		//Check if event is valid input
		if (
			event.search(
				/^live$|^offline$|^title$|^game$|^all$|^emote_added$|^emote_removed$/
			) === -1
		)
			return `Wrong event provided! Available events: live/offline/title/game/all/emote_removed/emote_added`

		// Sets Value of Default Messages
		let {'user-id': user_id} = user

		let databaseEntryForStreamer = await database.getNotifyEntryForStreamer(
			user_id,
			streamer
		)

		if (databaseEntryForStreamer) {
			if (event === 'all') {
				return updateNotifyEntryAll(
					user_id,
					streamer,
					databaseEntryForStreamer.CHANNEL
				)
			}
			if (databaseEntryForStreamer[event.toUpperCase()] === 1)
				return (
					`You're already registered for this event on ${streamer} in ` +
					databaseEntryForStreamer.CHANNEL +
					'. If you want to get notified in an other channel use the command movenotify'
				)
			return updateNotifyEntry(user_id, streamer, event)
		}
		return await insertNewNotifyEntry(user_id, streamer, event, channel)
	}
}

const updateNotifyEntryAll = async (user_id, streamer, channel) => {
	// Updates all variables to 1 if the event is all
	database.custom(
		`UPDATE NOTIFY SET LIVE='1',OFFLINE='1',TITLE='1',GAME='1' WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`
	)
	return `Successfully added all notifications for ${streamer} in ${channel}`
}

const updateNotifyEntry = async (user_id, streamer, event) => {
	database.updateEventForUser(user_id, streamer, event, 1)
	return `Successfully added notifications for ${streamer} on ${event} changes PogChamp`
}

const insertNewNotifyEntry = async (user_id, streamer, event, channel) => {
	if (event === 'emote_added' || event === 'emote_removed')
		return await checkForEmoteAPIUpdates(user_id, streamer, event, channel)
	return await checkForTwitchAPIUpdates(user_id, streamer, event, channel)
}
const checkForTwitchAPIUpdates = async (user_id, streamer, event, channel) => {
	if (!(await database.channelInfoGetsUpdated(streamer))) {
		if (!(await util.checkAvailableAtTwtichAPI(streamer)))
			return `Twitch API does not support this streamer :\\`

		// Create new instance of the streamer in the Channel info database for API updates if not existing already
		database.addNewChannelForAPIUpdates(streamer, Date.now())
	}

	if (event === 'all') {
		database.addNewNotifyEntryAllEvents(user_id, channel, streamer)
		return (
			`Successfully added all notifications for ${streamer} in ` +
			`this channel`
		)
	}
	// Inserts a new record in the database for the user in current channel
	await database.addNewNotifyEntryNoEvents(user_id, channel, streamer)

	// Sets the value on the given event to 1
	database.updateEventForUser(user_id, streamer, event, 1)

	return `Successfully added notifications for ${streamer} on ${event} changes PogChamp`
}
const checkForEmoteAPIUpdates = async (user_id, streamer, event, channel) => {
	try {
		if (!(await database.emotesGetsUpdated(streamer))) {
			let ThirdPartyEmotes = await util.getThirdPartyEmotesDECAPI(streamer)
			if (ThirdPartyEmotes)
				database.addNewChannelForEmoteUpdates(streamer, ThirdPartyEmotes)
		}
		// Inserts a new record in the database for the user in current channel
		await database.addNewNotifyEntryNoEvents(user_id, channel, streamer)

		// Sets the value on the given event to 1
		database.updateEventForUser(user_id, streamer, event, 1)
		return `Successfully added notifications for ${streamer} on ${event} changes PogChamp`
	} catch (e) {
		console.log(e)
		return `This user doesn't have any FFZ or BTTV emotes :\\`
	}
}
