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
    optional_parameters:"none",
    invocation:async (channel,user,messageparts)=>{
        let allowedresponse = await database.selectWhere("ALLOWED","CHANNELS","CHANNEL_NAME",channel);
        allowed = allowedresponse[0].ALLOWED;
        if(!allowed)return;
        let searchfor=""
        messageparts.forEach(element => {
            searchfor+=element + " "
        });
        let response = await lyricist
        .search(searchfor)
        .catch((reason)=>{
            console.log(reason)
        })
        const options = {
            apiKey: process.env.GENIUS_CLIENT_ACCESS_TOKEN,
            title:response[0].title ,
            artist: response[0].primary_artist.name,
            optimizeQuery: true
        };
        let lyrics = await getLyrics(options)
        .catch((reason)=>{
            console.log(reason)
        })
        let messagelyrics = lyrics.replace(/\[(?<=\[)(.*?)(?=\])\]\n/g,"").split(/\n/)
        for await(message of messagelyrics){
            if(message!="") client.client.say(channel,`${message}`)
            await util.timer(750)
        }
    }
}