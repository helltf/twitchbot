module.exports = {
	name: 'list',
	description: 'list your notifications for events',
	required_permissions: 1,
	required_parameters: 'event',
	optional_parameters: 'user',
	invocation: async (channel, user, [event, lookupUser]) => {
		if(!event)
            return `No Event provided.`
        if(!lookupUser)
        lookupUser = user.username

        let result = await hb.queryBuilder
        .select("*")
        .from("NOTIFY")
        .join("TWITCH_USER","NOTIFY.TWITCH_ID", "TWITCH_USER.TWITCH_ID")
        .where("TWITCH_USER.USERNAME", lookupUser.toLowerCase())
        .and(event, 1)
        .query()
        if(result.isEmpty())
            return `${lookupUser} is not notified for any streamer on the ${event} event`
        return `${lookupUser} is notified for ${result.length} streamers in total. Including ${result.map(entry=>entry.STREAMER.split('').join('\u{E0000}')).join(`, `)}`
	}
}
