module.exports={
    description:"Check the ratelimit",
    name:"ratelimit",
    required_permissions:4,
    required_parameters:"none",
    optional_parameters:"none",
    invocation: 
    async ()=>{
        return hb.currentRateLimit
    }
}