# COMMANDS
All available Commands:

| COMMAND | REQUIRED PERMISSIONS | REQUIRED PARAMETERS | OPTIONAL PARAMETERS | DESCRIPTION |
| :---:|:---:| :---:|:---:|:---:|
ALLOWMESSAGES | 2 | none | none | Used to allow messages send by the bot in the current channel
BANSEARCH | 1 | user | channel | Searches for the last ban for a certain user
BANSTATS | 1 | none | user | Returnes the counter for bans tracked
BOTINFO | 1 | none | none | Gives an info about the bot
CHANNELINFO | 1 | none | none | Retrieves the currents stats about the channel
CHATSTATS | 1 | user channel | none | Checks the chatterlist of the streamer
COLORHISTORY | 1 | none | none | The bot will send a message containing your 10 latest colorchanges and the time between your latest change and now
COMMANDINFO | 1 | command | none | Gives you an info about the given command
COMMANDS | 1 | none | none | Gives you a list containing all available commands
DISABLEMESSAGES | 2 | none | none | Used to disallow messages send by the bot in the current channel
EMOTEGAME | 1 | none | none | Starts a game of hangman with thirdparty emotes
EMOTEGAMESTATS | 1 | none | username | Provides your stats for emotegames
JOIN | 3 | channel | none | Used to make the mainclient join a new channel
LASTBAN | 1 | none | channel | Searches for the last ban occured in the given channel
LASTPING | 1 | user | channel | Gets the information about the lastping for an user
LASTTIMEOUT | 1 | none | channel | Searches for the last timeout occured in the given channel. Only tracks timeouts longer than 300s
LEAVE | 3 | channel | none | Used to make the mainclient leave a channel
LYRICS | 1 | song and creator | none | Retrieves the lyrics for a given song
MOVENOTIFY | 0 | streamer channel | none | Moves your notifications to another channel
NOTIFY | 1 | streamer event | none | Enables notifications for a given streamern on an certain event. Available events: live/offline/title/game/all
PING | 1 | none | none | Just a Ping command 4Head
REGISTER | 1 | none | none | Deprecated, No longer required
REGISTERCOLOR | 1 | none | none | Used to register yourself for colorhistory. The bot will save your 10 latest colors and the time of your last change
REMOVEME | 1 | streamer event | none | Disables notifications for a given streamern on an certain event. Right usage: hb notify <streamer> <event>. Available events: live/offline/title/game/all
RPS | 1 | [rock/paper/scissor] | none | play a game of rock, paper, scissors vs. the bot
RPSPLAYERGAME | 1 | player | none | Play a game of rps
RPSSTATS | 1 | none | username | Provides your stats for rps
SEARCHUSER | 4 | username | none | Search for a certain user in the database
SETPERMISSIONS | 4 | username permissionlevel | none | Sets the permissionslevel to the given level for a given user
TIMEOUTSEARCH | 1 | user | channel | Searches for the last timeout for a certain user. Only tracks timeouts longer than 300s
TRACK | 1 | channel | none | Used to make the watch client join a new channel to track
TRACKCOUNTER | 1 | none | none | Gets the current amount of tracked channels across twitch
UNTRACK | 1 | channel | none | Used to make the watch client leave a channel