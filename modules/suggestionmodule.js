hb.client.on('chat', (channel, {username}, message, self) => {
	if(!(username==="helltf")||(hb.suggestions.length===0)||(channel!="#helltf")) return
	let creator = hb.suggestions.map((suggestion)=>suggestion.user).join(", ")
	message = `helltf, There is/are ${hb.suggestions.length} new suggestion/s 👉 created by ${creator} AlienPls`
	hb.client.say(channel,`${message}`)
	hb.suggestions=[]
})
