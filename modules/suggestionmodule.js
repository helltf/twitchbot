hb.client.on('chat', (channel, {username}, message, self) => {
	if(!(username==="helltf")||!(hb.suggestions.length===0)||(channel!="helltf")) return
	let creator = hb.suggestions.map((suggestion)=>suggestion.user).join(", ")
	message = `There are ${hb.suggestions.length} suggestions 👉  created by ${creator} AlienPls`
	hb.sendAllowedMessage(channel,message)
})
