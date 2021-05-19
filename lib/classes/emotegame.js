class Emotegame {
	emote
	letterguessed
	channel
	constructor(emote, channel) {
		let underscores = ''
		for (var i = 0; i < emote.length; i++) {
			underscores += '_ '
		}
		this.emote = emote
		this.letterguessed = underscores.substring(0, underscores.length - 1)
		this.channel = channel
	}
	get emote() {
		return this.emote
	}
	get letterguessed() {
		return this.letterguessed
	}
	set emote(emote) {
		this.emote = emote
	}
	set letterguessed(letterguessed) {
		this.letterguessed = letterguessed
	}
	set channel(channel) {
		this.channel = channel
	}
	get channel() {
		return this.channel
	}
}
module.exports.Emotegame = Emotegame
