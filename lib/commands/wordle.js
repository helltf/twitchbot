module.exports = {
    name:"wordle",
    description:"Searches for the last ban for a certain user",
    required_permissions:1,
    required_parameters:"user",
    optional_parameters:"channel",
    invocation:
    async(channel,user, [lookupuser,lookupchannel])=>{
        const currentGames = {} 
        const {["user-id"]:user_id} = user
        const challengeWord = ""

       if(!currentGames[user_id]){
            createNewGame(currentGames, user_id, channel)
       }
        return "" 
    }
}

function createNewGame(currentGames, id, channel){
    currentGames[id] = getNewWordle(channel)
}

function getNewWordle( channel){
    return {
        channel
    }
}