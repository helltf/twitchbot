const database = require('../../database')
module.exports = {
	description: 'removes your suggestion from the database',
	name: 'removesuggestion',
	required_permissions: 1,
	required_parameters: 'id',
	optional_parameters: 'none',
	invocation: async (channel, {'user-id': user_id}, [id]) => {
		if (!id) return
		let suggestion = await database.getSuggestion(id, user_id)

		if (!suggestion)
			return `There is no suggestion created by you under the id ${id}`
		database.removeSuggestion(id)
		return `Successfully removed your suggestion`
	}
}
