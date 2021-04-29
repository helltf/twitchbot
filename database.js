var mysql = require('mysql');
const chalk = require("chalk")
require('dotenv').config();

const twitchdatabase = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});
module.exports.getConnectedChannels=async()=>{
  let command = `SELECT * FROM CHANNELS WHERE CURR_CONNECTED='1'`
  return await query(command)
}
module.exports.getConnectedChannel=async(channel)=>{
  let command = `SELECT * FROM CHANNELS WHERE CURR_CONNECTED='1' AND CHANNEL_NAME ='${channel}'`
  return await query(command)
}
module.exports.updateNotifyChannelForUser=async(user_id,newChannel,streamer)=>{
  let command = `UPDATE NOTIFY SET CHANNEL='${newChannel}' WHERE TWITCH_ID = '${user_id}'AND STREAMER = '${streamer}'`
  return await query(command)
}
module.exports.getAllWatchChannels=async()=>{
  let comand = `SELECT * FROM WATCHCHANNELS`
  return await query(comand)
}
module.exports.setUpdateCooldown=async(channel,cooldown)=>{
  let command = `UPDATE CHANNEL_INFO SET NEXT_UPDATE ='${Date.now()+cooldown}' WHERE CHANNEL_NAME = '${channelname}'`
  return await query(command)
}
module.exports.updateColorHistoryInDatabase =async (colorHistoryArray,user_id)=>{
  let command = `UPDATE COLOR_HISTORY SET COLOR_HIST = '${JSON.stringify(colorHistoryArray)}', LAST_CHANGE='${Date.now()}' WHERE TWITCH_ID = ${user_id}`
  return await query(command)
}
module.exports.getUserInfo=async(username)=>{
  let command = `SELECT * FROM TWITCH_USER WHERE USERNAME ='${username}'`
  let user_info =  await query(command)
  return{
    username:user_info[0].USERNAME,
    twitch_id:user_info[0].TWITCH_ID,
    color:user_info[0].COLOR,
    permissions:user_info[0].PERMISSIONS,
    register_time:user_info[0].REGISTER_TIME
  }
}
module.exports.connect = ()=>{
  twitchdatabase.connect(function(err) {
    if (err){
      console.log(`${chalk.hex("#3f888f").bold("[DATABASE]")} ${chalk.gray("[CONNECTION]")} ${chalk.red("[NOT SUCCESSFUL]")}`);
      throw err;
    } 
    console.log(`${chalk.hex("#3f888f").bold("[DATABASE]")} ${chalk.gray("[CONNECTION]")} ${chalk.green("[SUCCESSFUL]")}`);
  });
}
/**
 * INSERT INTO database (keys) VALUES (values)
 * @param {*} database 
 * @param {*} keys 
 * @param {*} values 
 * @returns 
 */
module.exports.insert = async(database,keys,values) =>{
  let command = `INSERT INTO ${database} (${keys}) VALUES (${values})`
return await query(command)
}
/**
 * SELECT keys FROM table 
 * @param {*} keys Return values
 * @param {*} table Databasetable
 * @returns the result of the query
 */
 module.exports.select = async(keys,table)=>{
  let command = `SELECT ${keys} FROM ${table}`
return await query(command)
}
/**
 * SELECT keys FROM table WHERE where = 'value'
 * @param {*} keys Return values
 * @param {*} table Databasetable
 * @param {*} where key
 * @param {*} value value of the key
 * @returns the result of the query
 */
 module.exports.selectWhere=selectWhere= async(keys,table,where,value)=>{
  let command = `SELECT ${keys} FROM ${table} WHERE ${where} = '${value}'`
return await query(command)
}
/**
 * UPDATE table SET set ='setvalue' WHERE where = 'value'
 * @param {*} table 
 * @param {*} set 
 * @param {*} setvalue 
 * @param {*} where 
 * @param {*} value 
 */
 module.exports.updateWhere =async (table,set,setvalue,where,value)=>{
  let command= `UPDATE ${table} SET ${set} ='${setvalue}' WHERE ${where} = '${value}'`;
return await query(command)
}
/**
 * UPDATE table set WHERE where value
 * @param {*} table 
 * @param {*} set 
 * @param {*} where 
 * @param {*} value 
 * @returns 
 */
 module.exports.updateWhereMultipleSets=async (table,set,where,value)=>{
  let command= `UPDATE ${table} SET ${set} WHERE ${where} = '${value}'`;
return await query(command)
}
/**
 * DELETE FROM tabel WHERE where = value
 * @param {*} table 
 * @param {*} where 
 * @param {*} value 
 * @returns 
 */
module.exports.remove = async(table,where,value) =>{
  let command= `DELETE FROM ${table} WHERE ${where} = '${value}'`;
  return new Promise((resolve,reject)=>{
    twitchdatabase.query(command,(err,result)=>{
      if(err)console.log(err);
        resolve(result)
    })
  })
}
/**
 * SELECT keys FROM table JOIN jointable ON jointablevalue WHERE where = wherevalue
 * @param {*} keys 
 * @param {*} table 
 * @param {*} jointable 
 * @param {*} tablevalue 
 * @param {*} jointablevalue 
 * @param {*} where 
 * @param {*} wherevalue 
 * @returns 
 */
 module.exports.selectJoin=async (keys,table,jointable,tablevalue,jointablevalue,where,wherevalue)=>{
  let command = `SELECT ${keys} FROM ${table} JOIN ${jointable} ON ${tablevalue}=${jointablevalue} WHERE ${where} = '${wherevalue}'` 
  return await query(command)
}
module.exports.custom=async (command)=>{
  command = command.replace(/\n/g,"")
  return await query(command)
}
module.exports.addNewBan=async(channel,username)=>{
  let command = `INSERT INTO BANNED_USER (USERNAME,CHANNEL,TIME) VALUES ('${username}','${channel}','${Date.now()}')`
  return await query(command)
}

module.exports.getColorForUser=async(user_id)=>{
  let command = `SELECT COLOR FROM TWITCH_USER WHERE TWITCH_ID = '${user_id}'`
  let databaseColor=await query(command)
  if(databaseColor){
    return databaseColor[0].COLOR
  } 
  return undefined 
}
module.exports.addNewChannelForAPIUpdates=async(streamer,currentDate)=>{
  let command = `INSERT INTO CHANNEL_INFO (CHANNEL_NAME,LIVE,TITLE,GAME_ID,NEXT_UPDATE,LIVE_COOLDOWN,TITLE_COOLDOWN,GAME_COOLDOWN) VALUES ('${streamer}','${undefined}','${undefined}','${-1}','${currentDate}','${currentDate}','${currentDate}','${currentDate}')`
  return await query(command)
}
module.exports.getNotifyCooldownForKey= async (key,channelname) =>{
  let command= `SELECT ${key}_COOLDOWN FROM CHANNEL_INFO WHERE CHANNEL_NAME ='${channelname}' `
  let result = await query(command)
  return result[0][`${key}_COOLDOWN`]
}
module.exports.getNotifedUserForStreamerOnEvent=async(streamer,key)=>{
  let command = `SELECT * FROM NOTIFY JOIN TWITCH_USER ON NOTIFY.TWITCH_ID=TWITCH_USER.TWITCH_ID WHERE STREAMER = '${streamer}' AND ${key.toUpperCase()} = '1'`
  return await query(command)
}
module.exports.removeNotifyRecordInDatabase=async(user_id,streamer)=>{
  let command = `DELETE FROM NOTIFY WHERE TWITCH_ID='${user_id}' AND STREAMER='${streamer}'`
  return await query(command)
}
module.exports.getBansForChannel=async(channel)=>{
  let command = `SELECT * FROM BANNED_USER WHERE CHANNEL= '${channel}' ORDER BY TIME DESC`
  return await query(command)
}
module.exports.getTimeoutsForChannel=async(channel)=>{
  let command = `SELECT * FROM TIMEOUT_USER WHERE CHANNEL= '${channel}' ORDER BY TIME DESC`
  return await query(command)
}
module.exports.addNewWatchChannel=async(channel)=>{
  let command = `INSERT INTO WATCHCHANNELS (CHANNEL_NAME) VALUES ('${channel}')`
  return await query(command)
}
module.exports.addNewTimeout=async(username,channel,duration)=>{
  let command = `INSERT INTO TIMEOUT_USER (USERNAME,CHANNEL,TIME,DURATION) VALUES ('${username}','${channel}','${Date.now()}','${duration}')`
  return await query(command)
}
module.exports.removeWatchChannel=async(channel)=>{
  let command = `DELETE FROM WATCHCHANNELS WHERE CHANNEL_NAME = '${channel}'`
  return await query(command);
}

module.exports.getNotifyEntryForStreamer=async (user_id,streamer)=>{
  let command = `SELECT * FROM NOTIFY WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'`
  let databaseinfo = await query(command)
  if(databaseinfo) return databaseinfo[0]
  return undefined
}
module.exports.updateEventForUser=async(user_id,streamer,status,value)=>{
  let command = `UPDATE NOTIFY SET ${status.toUpperCase()}='${value}' WHERE TWITCH_ID='${user_id}' AND STREAMER ='${streamer}'` 
  return await query(command)
}
module.exports.addNewRecordToColorHistory=async(user_id,currentColor)=>{
  let command = `INSERT INTO COLORHISTORY (TWITCH_ID,COLOR_HIST,REGISTER_TIME,LAST_CHANGE) VALUES ('${user_id}','["${user.color}"]','${Date.now()}','${Date.now()}')`
  return await query(command)
}
module.exports.getRPSStatsForUserID=async(user_id)=>{
  let command  = `SELECT * FROM RPS_STATS JOIN TWITCH_USER ON RPS_STATS.TWITCH_ID = TWITCH_USER.TWITCH_ID WHERE RPS_STATS.TWITCH_ID ='${user_id}'`
  let stats = await query(command)
  if(!stats)  return undefined
  return{
    wins:stats[0].WIN,
    losses:stats[0].LOSE,
    draws:stats[0].DRAW,
  }
}
module.exports.getEmotegameStatsForUserID=async(user_id)=>{
  let command  = `SELECT * FROM EMOTEGAME_STATS JOIN TWITCH_USER ON EMOTEGAME_STATS.TWITCH_ID = TWITCH_USER.TWITCH_ID WHERE EMOTEGAME_STATS.TWITCH_ID ='${user_id}'`
  let stats = await query(command)
  if(!stats)  return undefined
  return{
    letters_guessed:stats[0].LETTERS_GUESSED,
    emotes_guessed:stats[0].EMOTES_GUESSED,
  }
}
module.exports.getLeaderboardPositionRPS= async(user_id)=>{
  let command = `SELECT * FROM TWITCH_USER JOIN RPS_STATS ON  TWITCH_USER.TWITCH_ID = RPS_STATS.TWITCH_ID ORDER BY RPS_STATS.WIN DESC`
  let allStats = await query(command)
  return allStats.findIndex(user=> user.TWITCH_ID===parseInt(user_id))+1
}
module.exports.getLeaderboardPositionEmoteGame= async(user_id)=>{
  let command = `SELECT * FROM TWITCH_USER JOIN EMOTEGAME_STATS ON  TWITCH_USER.TWITCH_ID = EMOTEGAME_STATS.TWITCH_ID ORDER BY EMOTEGAME_STATS.EMOTES_GUESSED DESC`
  let allStats = await query(command)
  return allStats.findIndex(user=> user.TWITCH_ID===parseInt(user_id))+1
}
const query = (command)=>{
  if(command.search(/^INSERT$|^UPDATE$|^DELETE$/)!=-1&&process.env.IS_RASPI==="false") return
  return new Promise((resolve,reject)=>{
    twitchdatabase.query(command,(error,result)=>{
      if(error){
        console.log(error)
        reject(error)
      }
      if(result.length!=0){
        resolve(result)
      }else{
        resolve(undefined)
      }
    })
  })
}