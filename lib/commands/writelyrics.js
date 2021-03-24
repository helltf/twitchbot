const util = require("../functions/functions")
const Lyricist = require('lyricist')
const lyricist = new Lyricist(process.env.GENIUS_CLIENT_ACCESS_TOKEN);
const { getLyrics, getSong } =require('genius-lyrics-api');
const client = require("./../client")
const database=require("../../database")
module.exports={
    name:"writelyrics",
    description:"Writes the lyrics of a given song in the chat!",
    required_parameters:"song and creator",
    required_permissions: 4,
    invocation:async (channel,user,messageparts)=>{
        console.log()
        let allowedresponse = await database.selectWhere("ALLOWED","CHANNELS","CHANNEL_NAME",channel);
        allowed = allowedresponse[0].ALLOWED;
        if(!allowed)return;
        let searchfor=""
        let message=""
        messageparts.forEach(element => {
            searchfor+=element + " "
        });
        let response = await lyricist.search(searchfor).catch((reason)=>{
            console.log(reason)
        })
        const options = {
            apiKey: process.env.GENIUS_CLIENT_ACCESS_TOKEN,
            title:response[0].title ,
            artist: response[0].primary_artist.name,
            optimizeQuery: true
        };
        let lyrics = await getLyrics(options).catch((reason)=>{
            console.log(reason)
        })
        let messagelyrics = lyrics.replace(/\[(?<=\[)(.*?)(?=\])\]\n/g,"").split(/\n/)
        for(let i = 0;i<messagelyrics.length;i++){
            if(messagelyrics[i]!="")client.client.say(channel,`${messagelyrics[i]}`)
            await util.timer(750)
        }
    }
}