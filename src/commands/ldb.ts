import Discord from "discord.js";
import Ship from "../interfaces/ship";
import ResourcesObject from "../interfaces/resourcesObject";

/**
 * Turns a number into a string with comma notation (e.g. 1234 becomes "1,234")
 */
function commaNumber(num:number):string {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

/**
 * limits the length of a string
 */
function limitString(string:string, length:number):string {
    return string.substring(0, length);
}

/**
 * Transforms a Ship object into a string that is sent to discord
 */
function shipString(ship:Ship):string {
    return `\n**${commaNumber(ship.position)}** \`${ship.name} {${ship.hex}}\` (${commaNumber(ship.score)}pts)`;
}

let ldb = {
    name: "ldb",
    execute(resources:ResourcesObject):void {
        let {message, cache, prefix} = resources;

        message.channel.send("Fetching...").then(function(loadingMessage:Discord.Message) {
            let query:string = message.content.substring(prefix.length + ldb.name.length + 1);

            let matches:Array<Ship> = [];
            matches = cache.leaderboard.ships.filter(function(s:Ship) {
                return s.name.toLowerCase().includes(query.toLowerCase());
            });

            let msg:string = "";

            let totalPoints:number = 0;

            for(let i = 0; i < matches.length; i++) {
                totalPoints += matches[i].score;
                let msgLine = shipString(matches[i]);
                if((msg + msgLine).length <= 2000) {
                    msg += msgLine;
                } else {
                    break;
                }
            }
            
            loadingMessage.delete();
            message.channel.send(msg || "**[No Results]**");
            message.channel.send(`Total points for term "${query}": **${totalPoints}**`);
        });
    }
}
module.exports = ldb;