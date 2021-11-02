# COMMANDS
All available Commands:

| COMMAND | PERMISSIONS | PARAMETERS(req) | PARAMETERS(opt) | DESCRIPTION |
| :---:|:---:| :---:|:---:|:---:|
ADDPING|1|none|Adds an additional ping for your account|none|
ALLOWMESSAGES|2|none|Used to allow messages send by the bot in the current channel|none|
BANSEARCH|1|user|Searches for the last ban for a certain user|channel|
BANSTATS|1|none|Returnes the counter for bans tracked|user|
BOTINFO|1|none|Gives an info about the bot|none|
CHANNELINFO|1|none|Retrieves the currents stats about the channel|none|
CHATSTATS|1|user channel|Checks the chatterlist of the streamer|none|
COLORHISTORY|1|none|The bot will send a message containing your 10 latest colorchanges and the time between your latest change and now|username|
COMMANDINFO|1|command|Gives you an info about the given command|none|
COMMANDS|1|none|Gives you a list containing all available commands|none|
CUSTOMIZE|2|event, message|Customize the notify messages in this channel. use ${value}/${event}/${streamer} for values|none|
DISABLEMESSAGES|2|none|Used to disallow messages send by the bot in the current channel|none|
EMOTEGAME|1|none|Starts a game of hangman with thirdparty emotes|none|
EMOTEGAMESTATS|1|none|Provides your stats for emotegames|username|
EMOTES|1||Give the latest added emotes for the channel|channel|
EVAL|4|code|Evaluates the given code|none|
JOIN|3|channel|Used to make the mainclient join a new channel|none|
LASTBAN|1|none|Searches for the last ban occured in the given channel|channel|
LASTPING|1|user|Gets the information about the lastping for an user|channel|
LASTTIMEOUT|1|none|Searches for the last timeout occured in the given channel. Only tracks timeouts longer than 300s|channel|
LEAVE|3|channel|Used to make the mainclient leave a channel|none|
LIMITNOTIFICATION|1|none|Sets limits for notifications|channel|
LIST|1|event|list your notifications for events|user|
LYRICS|1|song and creator|Retrieves the lyrics for a given song|none|
MOVENOTIFY|0|streamer channel|Moves your notifications to another channel|none|
NOTIFY|1|streamer event|Enables notifications for a given streamern on an certain event. Available events: live/offline/title/game/all/emote_removed/emote_added|none|
PING|1|none|Just a Ping command 4Head|none|
RATELIMIT|4|none|Check the ratelimit|none|
REGISTER|1|none|Deprecated, No longer required|none|
REGISTERCOLOR|1|none|Used to register yourself for colorhistory. The bot will save your 10 latest colors and the time of your last change|none|
REMOVED|1||Give the latest removed emotes for the channel|channel|
REMOVEME|1|streamer event|Disables notifications for a given streamern on an certain event. Right usage: hb notify <streamer> <event>. Available events: live/offline/title/game/all/emote_removed/emote_added|none|
REMOVESUGGESTION|1|id|removes your suggestion from the database|none|
RPS|1|[rock/paper/scissors]|play a game of rock, paper, scissors vs. the bot|none|
RPSPLAYERGAME|1|player|Play a game of rps|none|
RPSSTATS|1|none|Provides your stats for rps|username|
SEARCHUSER|4|username|Search for a certain user in the database|none|
SETPERMISSIONS|4|username permissionlevel|Sets the permissionslevel to the given level for a given user|none|
STATS|1|stats to check for|Provides your stats for cookie/rps/emotegame|user|
SUGGEST|1|suggestion|Suggest something for helltfbot|none|
TIMEOUTSEARCH|1|user|Searches for the last timeout for a certain user. Only tracks timeouts longer than 300s|channel|
TRACK|1|channel|Used to make the watch client join a new channel to track|none|
TRACKCOUNTER|1|none|Gets the current amount of tracked channels across twitch|none|
UNTRACK|1|channel|Used to make the watch client leave a channel|none|