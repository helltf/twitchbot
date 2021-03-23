const util = require("../functions/functions")
const Lyricist = require('lyricist')
const lyricist = new Lyricist(process.env.GENIUS_CLIENT_ACCESS_TOKEN);
const { getLyrics, getSong } =require('genius-lyrics-api');
module.exports={
    name:"writeyrics",
    description:"Retrieves the lyrics for a given song!",
    required_parameters:"song and creator",
    required_permissions: 4,
    invocation:async (channel,user,messageparts)=>{
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
        console.log(messagelyrics)
        return message;
    }
}