const util = require("../functions/functions")
const Lyricist = require('lyricist')
const lyricist = new Lyricist(process.env.GENIUS_CLIENT_ACCESS_TOKEN);
module.exports={
    name:"lyrics",
    description:"Retrieves the lyrics for a given song!",
    required_parameters:"song and creator",
    required_permissions: 1,
    optional_parameters:"none",
    invocation:async (channel,user,messageparts)=>{
        let searchfor=""
        let message=""
        messageparts.forEach(element => {
            searchfor+=element + " "
        });

        let response = await lyricist.search(searchfor).catch((reason)=>{
            console.log(reason)
        })
        if(response.length!=0){
            let songresponse = await lyricist.song(response[0].id)
            message= `Here you can find the lyrics for the song ${response[0].title} by ${response[0].primary_artist.name} 👉 ${songresponse.url}`
        }else{
            message=`Sorry but I couldn't find any lyrics for your requested song!`
        }

        return message;
    }
}