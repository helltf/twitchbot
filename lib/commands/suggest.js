const database = require('../../database')

module.exports = {
	description: 'Suggest something for helltfbot',
	required_parameters: 'suggestion',
	name: 'suggest',
	required_permissions: 1,
	optional_parameters: 'none',
	invocation: async (channel, {'user-id': id, username}, [...parts]) => {
		let suggestion = parts.join(' ')
		if (!suggestion) return
		if ((await database.getSuggestionForUser(id)) > 20)
			return `You are not Allowed to have more than 20 suggestions`
		let suggestionId = (await database.getLatestSuggestionId()) + 1
		await database.addNewSuggestion(suggestionId, id, suggestion)
		hb.suggestions.push({
			id,
			user:username
		})
		return `Successfully added your suggestion! Id for your suggestion is ${suggestionId}. If you want to remove you suggestion use the removesuggestion command`
	}
}
