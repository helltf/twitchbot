/**
 * @author helltf
 */
module.exports={
    name:"botinfo",
    description:"Gives an info about the bot",
    required_permissions:1,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: 
    async()=>{
        return `This bot keeps track of your colorchanges in certain channels! If you want to use it register for colorchanges with "hb registercolor". Bot created by helltf. Git repository 👉 https://github.com/helltf/twitchbot/`
    }
}