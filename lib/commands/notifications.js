module.exports = {
	description:
		'Will return list all of your notifications',
	name: 'notifications',
	required_permissions: 1,
	required_parameters: 'none',
	optional_parameters: 'none',
	invocation: async (channel, {["user-id"]: id}, [event]) => {
    if(event.search(hb.regex.EVENTS) === -1)
        return `unknown event` 

    let allNotifications = await hb.queryBuilder
        .select("*")
        .from(hb.database.NOTIFY)
        .where("TWITCH_ID", id)
        .and( {[event]: 1})
       .query()

       return `You are notified for ${allNotifications.length} streamers on the  ${event.toLowerCase()} event. Including streamers like ${allNotifications.map((entry)=>entry.STREAMER.split("").join("\u{E0000}")).join(', ')}`
    }
}