import ResourcesObject from "../interfaces/resourcesObject";
import {Command} from "../handler/client";

let cmd:Command = {
    name: "players",
    description: "Show online players",
    execute(resources:ResourcesObject) {
        let {message, cache} = resources;
        let msg:string = "";
        for(let i in cache.players) {
            msg += `**${cache.players[i].name}**: ${cache.players[i].players}/${cache.players[i].maxPlayers}`;
            if(cache.players[i].players - cache.players[i].maxPlayers >= 0) msg += " **[SERVER FULL]**";
            msg += "\n";
        }
        message.channel.send(msg);
    }
}
module.exports = cmd;