'use strict'
const TIMEOUT = 600000
const {wordleEvent} = require('../functions/eventEmitter')

module.exports = {
	name: 'wordle',
	description: 'Searches for the last ban for a certain user',
	required_permissions: 1,
	required_parameters: 'user',
	optional_parameters: 'channel',
	invocation: async (channel, user, [command]) => {
		const {['user-id']: userId} = user

		let challengeWord = await getRandomWordleWord()

		if (command === 'start') {
			return startWorldeGame(new WordleGame(userId, challengeWord), channel)
		} else if (command === 'stop') {
			return stopWordleGame(channel, userId)
		}
	}
}

async function getRandomWordleWord() {
	let word = (
		await hb.queryBuilder
			.select('word')
			.from('wordle_words')
			.orderBy('RAND()', '')
			.limit(1)
			.query()
	).first().word
	return word
}

function createNewGame(game, channel) {
	games.wordle[channel] = game
}

function stopWordleGame(channel, userId) {
	if (games.wordle[channel] && games.wordle[channel].id === userId) {
		deleteGame(channel)
		return 'ended wordle game'
	}
	return 'Error: no game running or you are not permitted to end the game'
}

function startWorldeGame(game, channel) {
	if (!games.wordle[channel]) {
		createNewGame(game, channel)
		setTimeout(() => {
            if(games.wordle[channel]){
                deleteGame(channel)
                hb.sendAllowedMessage(channel, 'ended wordle game')
            }
		}, TIMEOUT)
		return 'started wordle game'
	} else {
		return 'game already running'
	}
}

function deleteGame(channel) {
	delete games.wordle[channel]
}

function checkForRightLetters(rightWord, guess) {
	let end = rightWord === guess
	let messageValue = createResultString(rightWord, guess)
	return {messageValue, end}
}

function createResultString(rightWord, guess) {
	let result = ''
	if (rightWord === guess) return '🟩🟩🟩🟩🟩 Correct answer BroBalt'
	for (let i = 0; i < guess.length; i++) {
		if (rightWord[i] === guess[i]) {
			result = result.concat('🟩')
		} else if (rightWord.includes(guess[i])) {
			result = result.concat('🟨')
		} else {
			result = result.concat('⬛')
		}
	}
	return result
}

wordleEvent.on('input', async (channel, user, message) => {
	if (!games.wordle[channel] || games.wordle[channel].id !== user['user-id'])
		return

	message = message.toLowerCase().replace(/\s/g, '')

	if (message.length !== 5) return

	if (await isValidInput(message)) {
		let {messageValue, end} = checkForRightLetters(
			games.wordle[channel].word,
			message,
			channel
		)
		games.wordle[channel].guessesRemaining--

		if (end) {
			deleteGame(channel)
		}

		hb.sendAllowedMessage(channel, messageValue)

		if (games.wordle[channel]?.guessesRemaining === 0) {
			hb.sendAllowedMessage(
				channel,
				'Stopping game because you dont have any guesses remaining'
			)
			deleteGame(channel)
		}
	}
})

async function isValidInput(message) {
	let res = await hb.queryBuilder
		.select('word')
		.from('wordle_words')
		.where('word', message)
		.query()
	return res !== undefined
}

class WordleGame {
	constructor(id, word) {
		this.id = id
		this.word = word
		this.guessesRemaining = 5
	}
}
