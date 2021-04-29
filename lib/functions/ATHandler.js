let AT={
    access_token:""
}
const util = require("./functions")
require('dotenv').config();
const updateAT=async()=>{
    const options={
        url: "https://id.twitch.tv/oauth2/token",
        json:true,
        body:{
            client_id:process.env.CLIENT_ID,
            client_secret:process.env.CLIENT_SECRET,
            grant_type:'client_credentials'
        }
    };
    let response = await util.postrequest(options).catch((err)=>{
    })
    AT.access_token=response?.access_token
}
module.exports.AT=AT
module.exports.updateAT=updateAT