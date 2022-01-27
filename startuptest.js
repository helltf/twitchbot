const requireDir = require("require-dir")
const commands =requireDir("./lib/commands")

module.exports =async () =>{
   console.log(await commands.notifications.invocation("helltf", {"user-id":"109035947"}, ["live"]))
}  