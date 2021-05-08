let AT={
    access_token:""
}
const options={
  url: "https://id.twitch.tv/oauth2/token",
  json:true,
  body:{
      client_id:process.env.CLIENT_ID,
      client_secret:process.env.CLIENT_SECRET,
      grant_type:'client_credentials'
  }
};
require('dotenv').config();
const request = require("request")
const updateAT=async()=>{
    let response = await postrequest(options)
    AT.access_token=response?.access_token
}
const postrequest= async(options)=>{
    return new Promise((resolve,reject)=>{
      request.post(options,(err,res,body)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(body)
        }
      })
    })
  }
module.exports.AT=AT
module.exports.updateAT=updateAT