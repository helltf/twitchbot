const database = require('../../database');
/**
 * @author helltf
 */
module.exports={
    description:"Customize the notify messages in this channel. use ${value}/${event}/${streamer} for values",
    name: "customize",
    required_permissions: 2,
    required_parameters:"event, message",
    optional_parameters:"none",
    invocation: async(channel, user, [event, ...newMessage])=>{
        newMessage = newMessage.join(" ")

        if(!newMessage|| event.search(hb.regex.EVENTS)===-1) return

        if(await database.hasCustomMessages(channel)){

            if(newMessage === "set default")
                return await setMessageToDefault(event, channel)

            return await updateNotifyMessage(channel, event, newMessage)
        }
        return await createNewEntry(channel, event, newMessage)
    }
}

const createNewEntry = async (channel, event, newMessage)=>{
    await database.addNewCustomMessage(channel, event, newMessage)
    return `Successfully added new custom message`
}

const updateNotifyMessage = async (channel, event, newMessage)=>{
    await database.updateCustomMessage(channel, event, newMessage)
    return `Successfully updated new custom message`
}

const setMessageToDefault = async(event, channel)=>{
    await database.setCustomMessageToDefault(event, channel)
    return `Set ${event} successfully to default`
}