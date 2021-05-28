const database = require("../../database")

module.exports= {
    description:"Suggest something for helltfbot",
    required_parameters:"suggestion",
    name : "suggest",
    required_permissions:1,
    optional_parameters:"none",
    invocation: async (channel,{"user-id":id},[...parts])=>{
        let suggestion = parts.join(" ")
        if(!suggestion) return
        await database.addNewSuggestion(id,suggestion)
        return `Successfully added your suggestion!`
    }
}