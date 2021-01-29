import Discord from "discord.js";
import Ship from "../interfaces/ship";
import ResourcesObject from "../interfaces/resourcesObject";

function commaNumber(num:number):string {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function limitString(string:string, length:number):string {
    return string.substring(0, length);
}
function shipString(ship:Ship):string {
    return `\n**${ship.position}** \`${ship.name} {${ship.hex}}\` (${commaNumber(ship.score)}pts)`;
}

let ldb = {
    name: "ldb",
    execute(resources:ResourcesObject):void {
        let {message, cache, prefix} = resources;

        message.channel.send("Fetching...").then(function(loadingMessage:Discord.Message) {
            let query:string = message.content.substring(prefix.length + ldb.name.length + 1);

            let matches:Array<Ship> = [];
            matches = cache.leaderboard.filter(function(s:Ship) {
                return s.name.toLowerCase().includes(query.toLowerCase());
            });

            let msg:string = "";

            for(let i = 0; i < matches.length; i++) {
                let msgLine = shipString(matches[i]);
                if((msg + msgLine).length <= 2000) {
                    msg += msgLine;
                } else {
                    continue;
                }
            }
            
            loadingMessage.delete();
            message.channel.send(msg || "**[No Results]**");
        });
    }
}
module.exports = ldb;